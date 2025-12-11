import { Router } from "express";
import {createReservationController,
    getClientUpcomingController,
    getClientHistoryController,
    getBarberWeekController,
    cancelReservationController,
    getOccupiedTimeSlotsController} from "../controllers/reservationController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireSelf } from "../middlewares/requireSelf";

const router = Router();

// Créer une réservation
router.post("/", authMiddleware, createReservationController);

// Client : réservations à venir
router.get("/client/:username/upcoming",authMiddleware,requireSelf,getClientUpcomingController);

// Client : historique
router.get("/client/:username/history",authMiddleware,requireSelf,getClientHistoryController);

// Barber : réservations de la semaine
router.get("/barber/:username/week",authMiddleware,getBarberWeekController);

// Annuler une réservation
router.patch("/:id/cancel",authMiddleware,cancelReservationController);

router.get("/occupied", getOccupiedTimeSlotsController);

export default router;
