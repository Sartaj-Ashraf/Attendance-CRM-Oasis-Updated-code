import bcrypt from "bcrypt";
import crypto from "crypto";
import userModel from "../Models/User.model.js";
import { sendEmail } from "../services/email.service.js";
import nodemailer from "nodemailer";
import GenerateToken from "../utils/GenrateToken.js";
import { generatePasswordToken } from "../utils/passwordToken.util.js";

export const editProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { username, phone } = req.body;

    /* ================= VALIDATION ================= */
    if (!username && !phone) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const updateData = {};

    /* ================= USERNAME ================= */
    if (username) {
      const trimmedUsername = username.trim().toLowerCase();

      if (trimmedUsername.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters",
        });
      }

      // Optional: unique username check
      const exists = await UserModel.findOne({
        username: trimmedUsername,
        _id: { $ne: userId },
      });

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Username already taken",
        });
      }

      updateData.username = trimmedUsername;
    }

    /* ================= PHONE ================= */
    if (phone) {
      updateData.phone = phone;
    }

    /* ================= UPDATE ================= */
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =====================================================
   VERIFY CURRENT PASSWORD
===================================================== */
export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const user = await userModel.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: "User account deleted",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account disabled",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password verified successfully",
    });
  } catch (error) {
    console.error("verifyPassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================================
   SET PENDING EMAIL + SEND OTP
===================================================== */
export const setPendingEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Same email already pending on same user
    if (user.pendingEmail === normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "This email is already pending verification",
      });
    }

    // Email used or pending by another user
    const emailTaken = await userModel.findOne({
      _id: { $ne: user._id },
      isDeleted: false,
      $or: [{ email: normalizedEmail }, { pendingEmail: normalizedEmail }],
    });

    if (emailTaken) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already used or pending verification by another user",
      });
    }

    // Generate OTP
    const otp = crypto.randomInt(10000, 100000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    // Send OTP email
    await sendEmail({
      toEmail: normalizedEmail,
      type: "VERIFY_OTP",
      data: { otp },
    });

    // Save pending email + OTP
    user.pendingEmail = normalizedEmail;
    user.verifyOtp = hashedOtp;
    user.verifyOtpExpires = Date.now() + 24 * 60 * 60 * 1000; // 10 min
    user.resendTry = 0; // reset on new request

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP sent to new email for verification",
    });
  } catch (error) {
    console.error("setPendingEmail error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =====================================================
   VERIFY EMAIL VIA OTP
===================================================== */
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.pendingEmail) {
      return res.status(400).json({
        success: false,
        message: "No pending email to verify",
      });
    }

    if (!user.verifyOtp || !user.verifyOtpExpires) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found",
      });
    }

    if (user.verifyOtpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request again.",
      });
    }

    const isOtpValid = await bcrypt.compare(otp.toString(), user.verifyOtp);

    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP verified → finalize email change
    user.email = user.pendingEmail;
    user.pendingEmail = null;
    user.verifyOtp = null;
    user.verifyOtpExpires = null;
    user.resendTry = 0;
    user.isEmailVerified = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      email: user.email,
    });
  } catch (error) {
    console.error("verifyEmail error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =====================================================
   RESEND EMAIL OTP (MAX 3 TIMES)
===================================================== */
export const resendEmailOtp = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("+verifyOtp");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked. Contact support.",
      });
    }

    if (!user.pendingEmail) {
      return res.status(400).json({
        success: false,
        message: "No pending email to verify",
      });
    }

    if (user.resendTry >= 3) {
      user.isActive = false;
      await user.save();

      return res.status(403).json({
        success: false,
        message: "Too many OTP requests. Your account has been blocked.",
      });
    }

    const otp = crypto.randomInt(10000, 100000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    await sendEmail({
      toEmail: user.pendingEmail,
      type: "VERIFY_OTP",
      data: { otp },
    });

    user.verifyOtp = hashedOtp;
    user.verifyOtpExpires = Date.now() + 10 * 60 * 1000;
    user.resendTry += 1;

    await user.save();

    return res.status(200).json({
      success: true,
      message: `OTP resent successfully (${user.resendTry}/3)`,
    });
  } catch (error) {
    console.error("resendEmailOtp error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resendSetPasswordEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        msg: "User email is already verified",
      });
    }

    // 🔐 Generate token
    const passwordToken = generatePasswordToken();

    const resetUrl = `${process.env.FRONTEND_URL}/set-password?email=${user.email}&token=${passwordToken}`;

    // 📧 Send email
    await sendEmail({
      toEmail: user.email,
      type: "SET_PASSWORD",
      data: {
        resetUrl,
      },
    });

    // 💾 Save token
    user.passwordSetupToken = passwordToken;
    user.passwordSetupExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Set password email sent successfully",
    });
  } catch (error) {
    console.error("Resend Set Password Error:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    /* ================= VALIDATION ================= */
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    /* ================= FIND USER ================= */
    const user = await userModel.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* ================= VERIFY CURRENT PASSWORD ================= */
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    /* ================= UPDATE PASSWORD ================= */
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
