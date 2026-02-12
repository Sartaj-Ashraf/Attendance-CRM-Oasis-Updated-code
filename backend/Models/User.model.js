import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
    },

    role: {
      type: String,
      enum: ["owner", "employee", "manager"],
      default: "employee",
      index: true,
    },

    payment: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "paid",
      lowercase: true,
      index: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      index: true,
    },

    reportingManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // 🔁 New email waiting for verification
    pendingEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    // 🔐 OTP for email verification (optional approach)
    verifyOtp: {
      type: String,
      default: null,
    },
    verifyOtpExpires: {
      type: Date, // expiry time
      default: null,
    },
    // 🔗 Password / email verification link
    passwordSetupToken: {
      type: String,
    },
    resendTry: {
      type: Number,
      default: 0,
    },
    passwordSetupExpires: {
      type: Date,
    },

    versionToken: {
      type: Number,
      default: 0,
    },
    canEditPastAttendance: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Helpful compound index
userSchema.index({ department: 1, reportingManager: 1 });

export default mongoose.model("User", userSchema);
