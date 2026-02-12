import express from "express";
const router = express.Router();
import {
  createUser,
  disableaccount,
  editUser,
  activateaccount,
  deleteUser,
  getAllDepartmentUser,
  getBlockedUser,
  GetAllEmployee,
  GetManagers,
  BlockedUsers,
  replaceManager,
  // getAllEmployees,
  getAllEmployeesForAttendance,
  createOwner,
  forceLogoutAllUsers,
} from "../Controllers/owner.controller.js";
import { canEditAttendance } from "../middleware/canEditPastAttendance.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import {
  markAttendance,
  bulkMarkAttendance,
} from "../Controllers/attendence.controller.js";
router.post("/create-owner", createOwner);
router.post("/addUser", authMiddleware, isAdmin, createUser); // creating user
router.put("/updateUser/:id", authMiddleware,editUser);
router.patch("/disableaccount/:id", authMiddleware, isAdmin, disableaccount); // block  user
router.put("/unblockUser/:id", authMiddleware, isAdmin, activateaccount); // unbloack user
router.patch("/manager/replace/:id", authMiddleware, replaceManager);
router.post("/markattendence", authMiddleware, isAdmin, markAttendance);
router.post(
  "/attendance/bulk",
  authMiddleware,
  // canEditAttendance,
  bulkMarkAttendance
);
router.post("/deleteUser/:id", authMiddleware, isAdmin, deleteUser);
router.get("/getAllUsers", authMiddleware, isAdmin, getAllDepartmentUser);
router.post("/getBlockedUser", authMiddleware, isAdmin, getBlockedUser);
router.get("/getManagers", authMiddleware, isAdmin, GetManagers);
router.get("/getBlockedUsers", authMiddleware, isAdmin, BlockedUsers);
router.get("/getAllEmployee", authMiddleware, isAdmin, GetAllEmployee);

router.get(
  "/getAllEmployeesForAttendance",
  authMiddleware,
  isAdmin,
  getAllEmployeesForAttendance
);
router.post("/force-logout-all", authMiddleware, isAdmin, forceLogoutAllUsers);

export default router;
