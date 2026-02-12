import UserModel from "../Models/User.model.js";
import AttendanceModel from "../Models/Attendence.model.js";
import pagination from "../utils/pagination.js";
import mongoose from "mongoose";
export const markAttendance = async (req, res) => {
  try {
    const { userId, status, note, date } = req.body;

    if (!userId || !status) {
      return res.status(400).json({ msg: "userId and status are required" });
    }

    const allowedStatuses = ["present", "absent", "leave", "late", "holiday"];
    const normalizedStatus = status.toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ msg: "Invalid attendance status" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ✅ USE DATE FROM REQUEST (FIXED)
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    // 🔒 CHECK EXISTING & LOCK
    const existingAttendance = await AttendanceModel.findOne({
      user: userId,
      date: attendanceDate,
    });

    if (existingAttendance?.isLocked) {
      return res.status(403).json({
        msg: "Attendance is locked and cannot be modified",
      });
    }

    const isLocked = ["leave", "holiday"].includes(normalizedStatus);

    const attendance = await AttendanceModel.findOneAndUpdate(
      { user: userId, date: attendanceDate },
      {
        status: normalizedStatus,
        note,
        markedBy: req.user._id,
        date: attendanceDate,
        isLocked,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    )
      .populate("user", "username email")
      .populate("markedBy", "username role");

    return res.status(200).json({
      msg: "Attendance saved successfully",
      attendance,
    });
  } catch (err) {
    console.error("❌ markAttendance:", err);
    return res.status(500).json({ msg: err.message });
  }
};

/* =========================================================
   BULK ATTENDANCE (NO DUPLICATES + LOCK SAFE)
========================================================= */

export const bulkMarkAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !records || !records.length) {
      return res.status(400).json({
        success: false,
        message: "Date and records are required",
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const bulkOps = records
      .map((rec) => {
        if (!mongoose.Types.ObjectId.isValid(rec.userId)) return null;

        return {
          updateOne: {
            filter: {
              user: rec.userId,
              date: attendanceDate,
            },
            update: {
              $set: {
                status: rec.status,
                note: rec.note || "",
                isLocked: rec.isLocked || false,
                markedBy: req.user._id,
              },
            },
            upsert: true, // 🔥 THIS PREVENTS DUPLICATE KEY ERRORS
          },
        };
      })
      .filter(Boolean);

    if (!bulkOps.length) {
      return res.status(400).json({
        success: false,
        message: "No valid attendance records",
      });
    }

    await AttendanceModel.bulkWrite(bulkOps, { ordered: false });

    return res.status(200).json({
      success: true,
      message: "Attendance saved successfully",
    });
  } catch (error) {
    console.error("Attendance bulk error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit attendance",
    });
  }
};
/* =========================================================
   GET ATTENDANCE BY DATE (PAGINATED + ROLE SAFE)
========================================================= */
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date, page = 1, limit = 10 } = req.query;
    const user = req.user;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required (YYYY-MM-DD)",
      });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    let userFilter = {};

    // 🔐 MANAGER ACCESS
    if (user.role === "manager") {
      const users = await UserModel.find({
        department: user.department,
        isDeleted: false,
        isActive: true,
      }).select("_id");

      userFilter.user = { $in: users.map((u) => u._id) };
    }

    const result = await pagination({
      model: AttendanceModel,
      query: {
        date: { $gte: start, $lte: end },
        ...userFilter,
      },
      sort: { createdAt: 1 },
      page: Number(page),
      limit: Number(limit),
      populate: [
        {
          path: "user",
          select: "username email department",
          populate: {
            path: "department",
            select: "name",
          },
        },
        {
          path: "markedBy",
          select: "username role",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: result.data.length,
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    console.error("❌ getAttendanceByDate:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
