import AttendenceModel from "../Models/Attendence.model.js";

export const generateAttendances = async () => {
  const statuses = ["present", "absent", "late", "leave"];

  const USER_ID = "69482203d9a9eb5299243384";
  const ADMIN_ID = "69482203d9a9eb5299243399";

  const records = [];

  for (let i = 0; i < 100; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    records.push({
      user: USER_ID,
      date,
      status: statuses[i % statuses.length],
      markedBy: ADMIN_ID,
      note: `Mock record ${i + 1}`,
    });
  }

  await AttendenceModel.insertMany(records, { ordered: false });
  console.log("✅ Attendance records inserted");
};
