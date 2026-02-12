import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import UserModel from "../Models/User.model.js";
import nodemailer from "nodemailer";
import GenerateToken from "../utils/GenrateToken.js";
import Attendance from "../Models/Attendence.model.js";
import { generatePasswordToken } from "../utils/passwordToken.util.js";
import { sendEmail } from "../services/email.service.js";
import pagination from "../utils/pagination.js";

/* ================= VERIFY TOKEN ================= */
export const verifyToken = async (req, res) => {
  try {
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).json({
        success: false,
        message: "Email and token are required",
      });
    }

    const user = await UserModel.findOne({
      email,
      passwordSetupToken: token,
      passwordSetupExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired link",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token is valid",
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= SET PASSWORD ================= */
export const setPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({
        message: "Email, token, and password are required",
      });
    }

    const user = await UserModel.findOne({
      email,
      passwordSetupToken: token,
      passwordSetupExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.passwordSetupToken = undefined;
    user.passwordSetupExpires = undefined;
    user.isActive = true;
    user.isEmailVerified = true;

    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await UserModel.findOne({
      email,
      isDeleted: false,
    }).select("+password");

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ msg: "Your account is disabled by admin" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        msg: "Please verify your email",
      });
    }

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const token = GenerateToken(user);

    res.cookie("AttendenceToken", token, {
      httpOnly: true,
      secure: process.env.MODE === "production",
      sameSite: process.env.MODE === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* ================= CURRENT ATTENDANCE ================= */
export const getCurrentAttendance = async (req, res) => {
  try {
    const userId =
      req.params.userId && req.user.role === "owner"
        ? req.params.userId
        : req.user.id;

    const { from, to } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const user = await UserModel.findById(userId).select(
      "-password -passwordSetupToken -passwordSetupExpires"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const query = { user: userId };

    if (from || to) {
      query.date = {};
      if (from) {
        const f = new Date(from);
        f.setHours(0, 0, 0, 0);
        query.date.$gte = f;
      }
      if (to) {
        const t = new Date(to);
        t.setHours(23, 59, 59, 999);
        query.date.$lte = t;
      }
    }

    const result = await pagination({
      model: Attendance,
      page,
      limit,
      query,
      sort: { date: -1 },
    });

    return res.status(200).json({
      success: true,
      user,
      data: result.data,
      pagination: result.meta,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* ================= ATTENDANCE SUMMARY ================= */
export const getAttendanceSummary = async (req, res) => {
  try {
    const { from, to, userId } = req.query;

    const match = {};

    // ✅ If owner sends userId → filter by that user
    // ✅ Else normal user → own data
    if (req.user.role === "owner" && userId) {
      match.user = new mongoose.Types.ObjectId(userId);
    } else {
      match.user = new mongoose.Types.ObjectId(req.user.id);
    }

    if (from || to) {
      match.date = {};
      if (from) {
        const f = new Date(from);
        f.setHours(0, 0, 0, 0);
        match.date.$gte = f;
      }
      if (to) {
        const t = new Date(to);
        t.setHours(23, 59, 59, 999);
        match.date.$lte = t;
      }
    }

    const summary = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      holiday: 0,
      total: 0,
    };

    summary.forEach((item) => {
      const key = String(item._id).toLowerCase();
      if (result[key] !== undefined) {
        result[key] = item.count;
        result.total += item.count;
      }
    });

    return res.status(200).json({
      success: true,
      summary: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};


/* ================= RESET PASSWORD ================= */
export const resetpassword = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        msg: "Email is required",
      });
    }

    email = email.toLowerCase();

    const user = await UserModel.findOne({ email });
    if (!user || user.isDeleted || !user.isActive) {
      return res.status(403).json({
        success: false,
        msg: "Account is disabled or does not exist",
      });
    }

    const passwordToken = generatePasswordToken();
    const resetUrl = `${process.env.FRONTEND_URL}/set-password?email=${email}&token=${passwordToken}`;

    await sendEmail({
      toEmail: email,
      type: "SET_PASSWORD",
      data: { resetUrl },
    });

    user.passwordSetupToken = passwordToken;
    user.passwordSetupExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    return res.status(200).json({
      success: true,
      msg: "Password reset link sent to email",
      resetUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  try {
    res.clearCookie("AttendenceToken", {
      httpOnly: true,
      secure: process.env.MODE === "production",
      sameSite: process.env.MODE === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      msg: "Cookie removed successfully",
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Failed to remove cookie",
      error: e.message,
    });
  }
};
