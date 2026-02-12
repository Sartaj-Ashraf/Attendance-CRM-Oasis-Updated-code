import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    startDate: {
      type: Date,
      required: true, // ✅ REQUIRED
    },

    days: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    isPaid: {
      type: Boolean,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

leaveSchema.index({ user: 1, status: 1 });

export default mongoose.model("Leave", leaveSchema);
