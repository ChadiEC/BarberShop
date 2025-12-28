import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createRating,getBarberRatings,deleteRatingController,getAllBarbersController,getAllRatingsController } from "../controllers/ratingController";
import { requireClient } from "../middlewares/requireClient";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

// ===== ADMIN =====
router.get("/all", authMiddleware, requireAdmin, getAllRatingsController);
router.delete("/:id", authMiddleware, requireAdmin, deleteRatingController);

// ===== CLIENT =====
router.post("/:barberUsername", authMiddleware, requireClient, createRating);

// ===== PUBLIC =====
router.get("/:username", getBarberRatings);
router.get("/", getAllBarbersController);

export default router;
