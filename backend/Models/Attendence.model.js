import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true, // 
    },

    status: {
      type: String,
      enum: ["present", "absent", "late", "leave", "holiday"],
      required: true,
    },

    // ✅ Only valid when status === "leave"
    leaveType: {
      type: String,
      enum: ["paid", "unpaid"],
      default: undefined,
    },

    note: {
      type: String,
      default: "",
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* 🔐 MOST IMPORTANT PART (DO NOT SKIP) */
/* Prevents duplicate attendance per user per day */
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema);
