import Leave from "../Models/Leave.models.js";
import UserModel from "../Models/User.model.js";
import sanitizeHtml from "sanitize-html";
import AttendanceModel from "../Models/Attendence.model.js";
import mongoose from "mongoose";
import paginate from "../utils/pagination.js";
/* =====================================================
   APPLY LEAVE (EMPLOYEE)
===================================================== */
export const applyLeave = async (req, res) => {
  try {
    const { days, subject, reason, startDate } = req.body;

    if (!days || !subject || !reason || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Days, subject, reason and startDate are required",
      });
    }

    const safeReason = sanitizeHtml(reason, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const leave = await Leave.create({
      user: req.user.id,
      days,
      subject,
      reason: safeReason,
      startDate: new Date(startDate),
    });

    return res.status(201).json({
      success: true,
      message: "Leave applied successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Apply Leave Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to apply leave",
    });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    /* ================= PAGINATION PARAMS ================= */
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    /* ================= PAGINATED QUERY ================= */
    const result = await paginate({
      model: Leave,
      page,
      limit,
      query: {
        user: req.user.id,
      },
      sort: { createdAt: -1 },
      populate: {
        path: "approvedBy",
        select: "username role",
      },
    });

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.meta,
    });
  } catch (error) {
    console.error("getMyLeaves error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user leaves",
      error: error.message,
    });
  }
};

/* =====================================================
   APPROVE LEAVE (MANAGER / OWNER)
===================================================== */

export const approveLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { isPaid, days } = req.body;

    /* ================= VALIDATIONS ================= */
    if (typeof isPaid !== "boolean") {
      return res.status(400).json({
        message: "isPaid must be true or false",
      });
    }

    if (!Number.isInteger(days) || days <= 0) {
      return res.status(400).json({
        message: "Days must be a positive integer",
      });
    }

    /* ================= ATOMIC LEAVE UPDATE ================= */
    const leave = await Leave.findOneAndUpdate(
      { _id: leaveId, status: "pending" },
      {
        $set: {
          status: "approved",
          isPaid,
          days, // ✅ UPDATED DAYS
          approvedBy: req.user.id,
          approvedAt: new Date(),
        },
      },
      { new: true }
    );

    // If null → already processed
    if (!leave) {
      return res.status(400).json({
        message: "Leave already processed or not found",
      });
    }

    /* ================= ATTENDANCE (IDEMPOTENT) ================= */
    const leaveType = isPaid ? "paid" : "unpaid";

    for (let i = 0; i < leave.days; i++) {
      const leaveDate = new Date(leave.startDate);
      leaveDate.setDate(leaveDate.getDate() + i);
      leaveDate.setHours(0, 0, 0, 0);

      await AttendanceModel.updateOne(
        { user: leave.user, date: leaveDate },
        {
          $setOnInsert: {
            status: "leave",
            leaveType,
            markedBy: req.user.id,
            note: "Approved leave",
          },
        },
        { upsert: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Leave approved successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Approve Leave Error:", error);

    return res.status(500).json({
      message: "Failed to approve leave",
      error: error.message,
    });
  }
};

/* =====================================================
   REJECT LEAVE (MANAGER / OWNER)
===================================================== */
export const rejectLeave = async (req, res) => {
  try {
    const { leaveId } = req.params;

    /* ================= ATOMIC REJECT ================= */
    const leave = await Leave.findOneAndUpdate(
      { _id: leaveId, status: "pending" },
      {
        $set: {
          status: "rejected",
          isPaid: false,
          approvedBy: req.user.id,
          approvedAt: new Date(),
        },
      },
      { new: true }
    );

    // If null → already approved/rejected or not found
    if (!leave) {
      return res.status(400).json({
        message: "Leave already processed or not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Leave rejected successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Reject Leave Error:", error);

    return res.status(500).json({
      message: "Failed to reject leave",
      error: error.message,
    });
  }
};

/* =====================================================
   GET ALL LEAVES (ROLE BASED)
===================================================== */

export const getAllLeaves = async (req, res) => {
  try {
    /* ================= PAGINATION PARAMS ================= */
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let filter = {};

    /* ================= ROLE BASED FILTER ================= */

    // EMPLOYEE → only own leaves
    if (req.user.role === "employee") {
      filter.user = req.user._id;
    }

    // MANAGER → department leaves
    if (req.user.role === "manager") {
      const users = await UserModel.find({
        department: req.user.department,
        isDeleted: false,
      }).select("_id");

      filter.user = { $in: users.map((u) => u._id) };
    }

    // OWNER → all leaves (no filter)

    /* ================= PAGINATED QUERY ================= */
    const result = await paginate({
      model: Leave,
      page,
      limit,
      query: filter,
      sort: { createdAt: -1 },
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
          path: "approvedBy",
          select: "username role",
        },
      ],
    });
    console.log(result.meta);
    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.meta,
    });
  } catch (error) {
    console.error("Get All Leaves Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaves",
      error: error.message,
    });
  }
};

export const pendingLeaves = async (req, res) => {
  try {
    const leaveCount = await Leave.countDocuments({
      status: "pending",
    });
    console.log(leaveCount);
    return res.status(200).json({
      success: true,
      pendingLeaves: leaveCount,
    });
  } catch (error) {
    console.error("Pending leaves error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending leaves",
    });
  }
};
