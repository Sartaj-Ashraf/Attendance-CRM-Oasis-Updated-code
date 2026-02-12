import express from "express";
import UserModel from "../Models/User.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import DepartmentModel from "../Models/Department.model.js";
import AttendanceModel from "../Models/Attendence.model.js";
import bcrypt from "bcrypt";

const router = express.Router();

// ⚠️ Use only in DEV
router.post("/seed/full-attendance", authMiddleware, async (req, res) => {
  try {
    /* ============================
       SAFE BODY HANDLING
    ============================ */
    const body = req.body || {};

    const {
      departments = ["DEVELOPMENT", "DESIGN", "HR", "MARKETING", "SALES"],
      usersPerDepartment = 100,
      days = 90,
      markedBy,
    } = body;

    if (!markedBy) {
      return res.status(400).json({
        success: false,
        message: "markedBy (admin/owner id) is required",
      });
    }

    const password = await bcrypt.hash("Password@123", 10);
    const statuses = ["present", "present", "present", "late", "absent"];

    let totalUsersCreated = 0;
    let totalAttendanceCreated = 0;

    /* ============================
       LOOP DEPARTMENTS
    ============================ */
    for (const deptName of departments) {
      const cleanDept = deptName.trim().toUpperCase();

      /* 1️⃣ CREATE / FIND DEPARTMENT */
      let department = await DepartmentModel.findOne({ name: cleanDept });

      if (!department) {
        department = await DepartmentModel.create({
          name: cleanDept,
          isActive: true,
          members: 0,
        });
      }

      /* 2️⃣ CREATE USERS (SAFE) */
      const createdUsers = [];

      for (let i = 1; i <= usersPerDepartment; i++) {
        const email = `${cleanDept.toLowerCase()}_emp_${i}@example.com`;

        const exists = await UserModel.findOne({ email });
        if (exists) continue;

        const user = await UserModel.create({
          username: `${cleanDept.toLowerCase()}_emp_${i}`,
          email,
          password,
          phone: `9${String(100000000 + i).slice(0, 9)}`,
          role: "employee",
          department: department._id,
          isActive: true,
        });

        createdUsers.push(user);
        totalUsersCreated++;
      }

      /* UPDATE MEMBERS COUNT */
      department.members += createdUsers.length;
      await department.save();

      /* 3️⃣ GENERATE ATTENDANCE */
      const attendanceRecords = [];

      createdUsers.forEach((user, userIndex) => {
        for (let d = 0; d < days; d++) {
          const date = new Date();
          date.setDate(date.getDate() - d);
          date.setHours(0, 0, 0, 0);

          attendanceRecords.push({
            user: user._id,
            date,
            status: statuses[(userIndex + d) % statuses.length],
            markedBy,
            note: "Auto generated attendance",
          });
        }
      });

      if (attendanceRecords.length) {
        await AttendanceModel.insertMany(attendanceRecords, {
          ordered: false,
        });

        totalAttendanceCreated += attendanceRecords.length;
      }
    }

    return res.status(201).json({
      success: true,
      message: "Seed data created successfully",
      departmentsProcessed: departments.length,
      usersCreated: totalUsersCreated,
      attendanceRecords: totalAttendanceCreated,
    });
  } catch (error) {
    console.error("Seed Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to seed data",
      error: error.message,
    });
  }
});

router.post("/single-user", async (req, res) => {
  try {
    const { userId, days = 1000, markedBy } = req.body;

    if (!userId || !markedBy) {
      return res.status(400).json({
        success: false,
        message: "userId and markedBy are required",
      });
    }

    // 🔒 Optional safety
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({
        success: false,
        message: "Seeding not allowed in production",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const STATUSES = ["present", "present", "present", "late", "absent"];
    const attendanceRecords = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const status = STATUSES[i % STATUSES.length];

      attendanceRecords.push({
        user: user._id,
        date,
        status,
        leaveType:
          status === "leave"
            ? Math.random() > 0.5
              ? "paid"
              : "unpaid"
            : undefined,
        markedBy,
        note: "Seeded single-user attendance",
        isLocked: true,
      });
    }

    await AttendanceModel.insertMany(attendanceRecords, {
      ordered: false, // 🔥 ignores duplicate date errors
    });

    return res.status(201).json({
      success: true,
      message: `${days} attendance records created for user`,
      user: user.username,
      totalRecords: attendanceRecords.length,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(201).json({
        success: true,
        message: "Some attendance already existed, remaining inserted",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to seed attendance",
      error: error.message,
    });
  }
});
router.post(
  "/seed/add-users-to-department",
  authMiddleware,
  async (req, res) => {
    try {
      const departmentId = "695df71f2d797fe8b14b18b3";
      const usersCount = 100;

      /* =========================
         FIND DEPARTMENT
      ========================= */
      const department = await DepartmentModel.findOne({
        _id: departmentId,
        isActive: true,
      });

      if (!department) {
        return res.status(404).json({
          success: false,
          message: "Department not found or inactive",
        });
      }

      /* =========================
         CHECK ACTIVE MANAGER 🔥
      ========================= */
      const activeManagerExists = await UserModel.exists({
        _id: { $in: department.managers },
        role: "manager",
        isActive: true,
      });

      if (!activeManagerExists) {
        return res.status(400).json({
          success: false,
          message: "Department has no active manager",
        });
      }

      const password = await bcrypt.hash("Password@123", 10);
      const users = [];
      let createdCount = 0;

      /* =========================
         CREATE USERS
      ========================= */
      for (let i = 1; i <= usersCount; i++) {
        const email = `dev_emp_${i}@example.com`;

        const exists = await UserModel.findOne({ email });
        if (exists) continue;

        users.push({
          username: `dev_emp_${i}`,
          email,
          password,
          phone: `9${String(100000000 + i).slice(0, 9)}`,
          role: "employee",
          department: department._id,
          isActive: true,
        });

        createdCount++;
      }

      if (users.length) {
        await UserModel.insertMany(users, { ordered: false });

        await DepartmentModel.findByIdAndUpdate(department._id, {
          $inc: { members: users.length },
        });
      }

      return res.status(201).json({
        success: true,
        message: "Users added successfully",
        department: department.name,
        usersRequested: usersCount,
        usersCreated: createdCount,
      });
    } catch (error) {
      console.error("Add Users Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to add users",
        error: error.message,
      });
    }
  }
);

export default router;
