import express from "express";
import {
  createDepartment,
  getDepartments,
  deleteDepartment,
} from "../controllers/department.controller.js";

const router = express.Router();

router.post("/create", createDepartment);
router.get("/get", getDepartments);
// router.get("/:id", getDepartmentById);
// router.put("/:id", updateDepartment);
router.delete("/delete/:id", deleteDepartment);

export default router;
