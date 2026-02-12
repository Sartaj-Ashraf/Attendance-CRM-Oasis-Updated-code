import mongoose from "mongoose";
import AttendenceModel from "../Models/Attendence.model.js";
import userModel from "../Models/User.model.js";

const MONGO_URI = process.env.MONGO_URL;

const STATUSES = ["present", "absent", "late", "leave", "holiday"];

const getRandomStatus = () => {
  return STATUSES[Math.floor(Math.random() * STATUSES.length)];
};

const seedAttendance = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // 🔹 FIND ONE USER (FIXED)
    const user = await userModel.findById("6954ca807883bc9db9dc86d3");
    if (!user) {
      console.log("❌ No user found");
      process.exit(1);
    }

    const records = [];

    for (let i = 0; i < 1000; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const status = getRandomStatus();

      records.push({
        user: user._id,
        date,
        status,
        leaveType:
          status === "leave"
            ? Math.random() > 0.5
              ? "paid"
              : "unpaid"
            : undefined,
        note: "Seeded data",
        markedBy: user._id,
        isLocked: true,
      });
    }

    // 🔹 INSERT (FIXED MODEL NAME)
    await AttendenceModel.insertMany(records, { ordered: false });

    console.log("🎉 1000 attendance records seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAttendance();
