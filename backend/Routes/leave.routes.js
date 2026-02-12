import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  applyLeave,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getMyLeaves,
  pendingLeaves,
} from "../controllers/leave.controllers.js";

const router = express.Router();

/* ================= EMPLOYEE ================= */
router.post("/apply", authMiddleware, applyLeave);

/* ================= MANAGER / OWNER ================= */
router.get("/all", authMiddleware, getAllLeaves);
router.patch("/approve/:leaveId", authMiddleware, approveLeave);
router.patch("/reject/:leaveId", authMiddleware, rejectLeave);
router.get("/my", authMiddleware, getMyLeaves);
router.get("/pending-leaves", authMiddleware, pendingLeaves);
export default router;
