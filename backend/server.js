import dotenv from "dotenv";
dotenv.config();

import { authMiddleware } from "./middleware/auth.middleware.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./Database/Database.js";
import morgan from "morgan";
import userRouter from "./Routes/user.routes.js";
import ownerRoute from "./Routes/owner.routes.js";
import commonRoute from "./Routes/common.routes.js";
import departmentRoute from "./Routes/department.routes.js";
import { generateAttendances } from "./seed/tempUser.js";
import authRoute from "./Routes/auth.routes.js";
// import { seedFullAttendanceData } from "./seed/seed.controller.js";
// import seedAttendance from "./seed/seedAttendance.js";
import leaveRoutes from "./routes/leave.routes.js";
connectDB();
const app = express();

app.use(
  cors({
    origin:
      process.env.MODE === "development"
        ? process.env.LOCAL_URL
        : process.env.FRONTEND_URL,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true, 
  })
);
// seed();
// generateAttendances();
// seedFullAttendanceData();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("backend is running perfectly");
});
const PORT = process.env.PORT || 5000;
app.use("/user", userRouter);
app.use("/owner", ownerRoute);
app.use("/department", departmentRoute);
app.use("/api", commonRoute);
app.use("/leaves", leaveRoutes);
app.use("/auth", authRoute);
// auth middleware
import seedRoutes from "./routes/seed.routes.js";

app.use("/api", seedRoutes);
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
