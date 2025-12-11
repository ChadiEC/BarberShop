import { Router } from "express";
import {getScheduleController,createScheduleController,updateScheduleController,deleteScheduleController } from "../controllers/scheduleController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireStaff } from "../middlewares/requireStaff";
import { getAvailableSlotsController } from "../controllers/scheduleController";

const router = Router();

router.post("/", requireStaff, createScheduleController);
router.get("/:username", getScheduleController);
router.patch("/:username/:day", requireStaff, updateScheduleController);
router.delete("/:username/:day", requireStaff, deleteScheduleController);
router.get("/:barberUsername/:date", getAvailableSlotsController);

export default router;