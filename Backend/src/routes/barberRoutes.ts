import { Router } from "express";
import {getAllBarbersController,getBarberController,createBarberController,updateBarberController,deleteBarberController} from "../controllers/barberController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireSelf } from "../middlewares/requireSelf";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

// Public: list of barbers
router.get("/", getAllBarbersController);

// Public: single barber profile
router.get("/:username", getBarberController);
router.post("/", authMiddleware, requireAdmin, createBarberController);
// Protected: only barber himself or admin
router.patch("/:username", authMiddleware, requireAdmin,updateBarberController);
router.delete("/:username", authMiddleware, requireAdmin,deleteBarberController);
export default router;