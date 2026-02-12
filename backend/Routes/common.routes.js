import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
const app = express();
const router = express.Router();
import UserModel from "../Models/User.model.js";
import { getAttendanceByDate } from "../Controllers/attendence.controller.js";
// router.get("/statuses", getAllStatuses);
router.get("/isAuth", authMiddleware, async (req, res) => {
  const user = await UserModel.findById(req.user.id)
    .select("username email role department phone")
    .populate("department", "name");

  if (!user) {
    return res.status(401).json({ msg: "User not found" });
  }

  return res.status(200).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      department: user.department,
    },
  });
});
router.get("/GetAttendanceByDate", authMiddleware, getAttendanceByDate);
export default router;
