import mongoose from "mongoose";
// import Status from "../Models/Status.model.js";
// mongoose.connect(process.env.MONGO_URL);
export const seed = async () => {
  await Status.insertMany([
    {
      status: "present",
      code: "P",
      description: "Employee was present on time",
    },
    {
      status: "absent",
      code: "A",
      description: "Employee was Absent on this day",
    },
    { status: "leave", code: "L", description: "Employee was on leave " },
    { status: "late", code: "LT", description: "Arrived after office hours" },
  ]);
  console.log("Status seeded");
  process.exit();
};
