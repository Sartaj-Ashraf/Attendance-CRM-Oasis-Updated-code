import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  verifyPassword,
  setPendingEmail,
  resendEmailOtp,
  verifyEmail,
  resendSetPasswordEmail,
  editProfile,
  changePassword,
} from "../Controllers/auth.controllers.js";
const router = express.Router();
router.patch("/edit-profile", authMiddleware, editProfile);
router.post("/verify-password", authMiddleware, verifyPassword);
router.put("/setPendingEmail", authMiddleware, setPendingEmail);
router.post("/resendOtp", authMiddleware, resendEmailOtp);
router.post("/verifyEmail", authMiddleware, verifyEmail);
router.post("/resend-confirmation/:id", authMiddleware, resendSetPasswordEmail);
router.put("/change-password", authMiddleware, changePassword);
export default router;
