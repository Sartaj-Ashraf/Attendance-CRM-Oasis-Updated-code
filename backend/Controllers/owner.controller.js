import bcrypt from "bcryptjs";
import crypto from "crypto";
import UserModel from "../Models/User.model.js";
import DepartmentModel from "../Models/Department.model.js";
import nodemailer from "nodemailer";
import GenerateToken from "../utils/GenrateToken.js";
import Attendance from "../Models/Attendence.model.js";
import pagination from "../utils/pagination.js";
import mongoose from "mongoose";
import { sendEmail } from "../services/email.service.js";

export const createUser = async (req, res) => {
  try {
    let { username, email, phone, payment, department } = req.body;

    // 1️⃣ Validation
    if (!username || !email || !phone || !payment || !department) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({
        message: "Invalid department ID",
      });
    }

    username = username.toLowerCase();
    email = email.toLowerCase();
    payment = payment.toLowerCase();

    // 2️⃣ Find department by ID ✅
    const departmentDoc = await DepartmentModel.findById(department);
    if (!departmentDoc) {
      return res.status(404).json({
        message: "Department does not exist",
      });
    }

    // 3️⃣ Check existing user
    const existingUser = await UserModel.findOne({ email, isDeleted: false });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    let finalRole = "employee";
    let reportingManager = null;

    const departmentUser = await UserModel.findOne({
      department,
      isDeleted: false,
    });

    if (!departmentUser) {
      // First user in department
      finalRole = "manager";
    } else {
      const manager = await UserModel.findOne({
        role: "manager",
        department,
        isActive: true,
        isDeleted: false,
      });

      if (!manager) {
        return res.status(400).json({
          message: "Department has no active manager",
        });
      }

      reportingManager = manager._id;
    }

    // 5️⃣ Password + Token
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const passwordSetupToken = crypto.randomBytes(32).toString("hex");
    const resetUrl = `${process.env.FRONTEND_URL}/set-password?email=${email}&token=${passwordSetupToken}`;

    await sendEmail({
      toEmail: email,
      type: "SET_PASSWORD",
      data: {
        resetUrl,
      },
    });

    // 6️⃣ Create user
    const newUser = await UserModel.create({
      username,
      email,
      phone,
      payment,
      department,
      role: finalRole,
      reportingManager,
      password: hashedPassword,
      passwordSetupToken,
      passwordSetupExpires: Date.now() + 60 * 60 * 1000, // 1 hour
    });
    const rawId = newUser._id.toString();
    const employeeId = `EMP-${rawId.slice(-7).toUpperCase()}`;

    newUser.employeeId = employeeId;
    await newUser.save();
    if (finalRole === "manager") {
      await DepartmentModel.findByIdAndUpdate(department, {
        $addToSet: { managers: newUser._id },
      });
    }
    // 7️⃣ Response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        department: departmentDoc.name,
        reportingManager: reportingManager || "SELF",
        resetUrl: resetUrl,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
export const createOwner = async (req, res) => {
  try {
    let { username, email, phone } = req.body;

    // Check if owner already exists
    const totalUsers = await UserModel.countDocuments({ isDeleted: false });

    if (totalUsers > 0) {
      return res.status(403).json({
        message: "Owner already exists",
      });
    }

    if (!username || !email || !phone) {
      return res.status(400).json({
        message: "Username and email are required",
      });
    }

    username = username.toLowerCase();
    email = email.toLowerCase();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    // Password setup
    const tempPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const passwordSetupToken = crypto.randomBytes(32).toString("hex");
    const resetUrl = `${process.env.FRONTEND_URL}/set-password?email=${email}&token=${passwordSetupToken}`;

    await sendEmail({
      toEmail: email,
      type: "SET_PASSWORD",
      data: {
        resetUrl,
      },
    });

    const owner = await UserModel.create({
      username,
      email,
      phone,
      role: "owner",
      password: hashedPassword,
      passwordSetupToken,
      passwordSetupExpires: Date.now() + 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Owner created successfully",
      user: {
        id: owner._id,
        username: owner.username,
        email: owner.email,
        role: owner.role,
        resetUrl,
      },
    });
  } catch (error) {
    console.error("Create owner error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllEmployeesForAttendance = async (req, res) => {
  try {
    const users = await UserModel.find({
      role: "employee",
      isDeleted: false,
      isActive: true,
    })
      .populate("department")
      .sort({ username: 1 }); // A–Z

    res.status(200).json({
      data: users,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch employees" });
  }
};
export const GetAllEmployee = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const { department, search, verification } = req.query;

    const query = {
      _id: { $ne: loggedInUserId },
      role: "employee",
      isDeleted: false,
      isActive: true,
    };

    /* ================= DEPARTMENT FILTER ================= */
    if (department && mongoose.Types.ObjectId.isValid(department)) {
      query.department = new mongoose.Types.ObjectId(department);
    }

    /* ================= SEARCH FILTER ================= */
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    /* ================= VERIFICATION FILTER ================= */
    if (verification === "verified") {
      query.isEmailVerified = true;
    }

    if (verification === "unverified") {
      query.isEmailVerified = false;
    }

    const result = await pagination({
      model: UserModel,
      page,
      limit,
      query,
      select: "-password",
      populate: [
        { path: "department", select: "name" },
        { path: "reportingManager", select: "username email" },
      ],
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("GetAllEmployee error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    let { email, department, payment } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.user.role === "employee") {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // ❌ Manager can ONLY edit users from his department
    if (
      req.user.role === "manager" &&
      String(user.department) !== String(req.user.department)
    ) {
      return res.status(403).json({
        message: "You can only manage users from your department",
      });
    }

    /* =======================
       EMAIL (DIRECT UPDATE)
    ======================= */
    if (email) {
      email = email.toLowerCase().trim();

      if (email !== user.email) {
        const emailExists = await UserModel.findOne({
          email,
          _id: { $ne: id },
        });

        if (emailExists) {
          return res.status(409).json({
            message: "Email already in use",
          });
        }

        user.email = email;
        user.pendingEmail = null;
        user.isEmailVerified = false;
        user.resendTry = 0;
      }
    }
    if (req.user.role === "owner") {
      // 👑 Owner can change department
      if (department) {
        user.department = department;
      }
    }

    if (req.user.role === "manager") {
      // 🔒 Manager is FORCED to his department
      user.department = req.user.department;
    }

    /* =======================
       PAYMENT
    ======================= */
    if (payment) {
      payment = payment.toLowerCase();
      if (!["paid", "unpaid"].includes(payment)) {
        return res
          .status(400)
          .json({ message: "Payment must be paid or unpaid" });
      }
      user.payment = payment;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        email: user.email,
        department: user.department,
        payment: user.payment,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const disableaccount = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user id" });
    }

    // 2️⃣ Check user exists
    const user = await UserModel.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 3️⃣ SAFE update (NO save)
    await UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true });

    return res.status(200).json({
      msg: "Account disabled successfully",
    });
  } catch (error) {
    console.error("disableaccount error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const activateaccount = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user id" });
    }

    // 2️⃣ Check user exists
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 3️⃣ Activate account (NO save)
    await UserModel.findByIdAndUpdate(
      id,
      { isActive: true, resendTry: 0 },
      { new: true }
    );

    return res.status(200).json({
      msg: "Account activated successfully",
    });
  } catch (e) {
    console.error("activateaccount error:", e);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
};

export const replaceManager = async (req, res) => {
  try {
    const { id: newManagerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(newManagerId)) {
      return res.status(400).json({ msg: "Invalid manager ID" });
    }
    if (!newManagerId) {
      return res.status(400).json({ msg: "New manager ID is required" });
    }

    // 1️⃣ Find new manager candidate
    const newManager = await UserModel.findById(newManagerId);
    if (!newManager || newManager.isDeleted) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!newManager.department) {
      return res.status(400).json({
        msg: "User is not assigned to any department",
      });
    }

    // 2️⃣ Find existing manager in same department
    const previousManager = await UserModel.findOne({
      role: "manager",
      department: newManager.department,
      isDeleted: false,
      isActive: true,
    });

    // 3️⃣ If same user already manager
    if (previousManager && previousManager._id.equals(newManager._id)) {
      return res.status(400).json({
        msg: "User is already the manager of this department",
      });
    }

    // 4️⃣ Reassign reporting users
    if (previousManager) {
      await UserModel.updateMany(
        {
          reportingManager: previousManager._id,
          isDeleted: false,
        },
        { $set: { reportingManager: newManager._id } }
      );

      // Demote old manager
      previousManager.role = "employee";
      previousManager.reportingManager = newManager._id;
      await previousManager.save();
    }

    // 5️⃣ Promote new manager
    newManager.role = "manager";
    newManager.reportingManager = null;
    await newManager.save();
    await DepartmentModel.findByIdAndUpdate(newManager.department, {
      $set: { managers: [newManager._id] },
    });
    return res.status(200).json({
      msg: "Manager replaced successfully",
      data: {
        newManager: {
          id: newManager._id,
          username: newManager.username,
          department: newManager.department,
        },
        previousManager: previousManager
          ? {
              id: previousManager._id,
              username: previousManager.username,
            }
          : null,
      },
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await UserModel.find().select("-password");

//     const usersWithAttendance = await Promise.all(
//       users.map(async (user) => {
//         const attendance = await Attendance.find({ user: user._id }).populate(
//           "status"
//         );

//         return {
//           ...user.toObject(),
//           attendance,
//         };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       users: usersWithAttendance,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const getAllDepartmentUser = async (req, res) => {
  try {
    const { department } = req.query; // ✅ from query

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department id is required",
      });
    }

    const users = await UserModel.find({
      department, // ✅ filter by department ObjectId
      isDeleted: false,
      isActive: true,
      role: "employee",
    })
      .select("-password -passwordSetupToken -passwordSetupExpires")
      .populate("department", "name")
      .populate("reportingManager", "username email");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid user id" });
    }

    // 2️⃣ Check user exists
    const user = await UserModel.findById(id);
    if (!user || user.isDeleted) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 3️⃣ Soft delete (NO save)
    await UserModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        isActive: false,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      msg: "User deleted successfully",
    });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

export const getBlockedUser = async (req, res) => {
  try {
    const users = await UserModel.find({
      isActive: false,
      isDeleted: false,
    }).select(
      "-passwordSetupToken -passwordSetupExpires -updatedAt -createdAt -isDeleted -isActive"
    );
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blocked users",
      error: e.message,
    });
  }
};

export const GetManagers = async (req, res) => {
  try {
    const managers = await UserModel.find({
      role: "manager",
      isDeleted: false,
      isActive: true,
    })
      .select("-password -passwordSetupToken -passwordSetupExpires")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: managers.length,
      data: managers,
    });
  } catch (error) {
    console.error("GetManagers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch managers",
    });
  }
};
export const BlockedUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ isActive: false, isDeleted: false })
      .select("-password -passwordSetupToken -passwordSetupExpires")
      .populate("department", "name");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch blocked users" });
  }
};

export const forceLogoutAllUsers = async (req, res) => {
  try {
    // increment versionToken for everyone
    await UserModel.updateMany({}, { $inc: { versionToken: 1 } });

    return res.status(200).json({
      success: true,
      message: "All users have been force logged out",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to force logout users",
    });
  }
};
