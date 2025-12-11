import { Router } from "express";
import {
createReservationController,
getClientUpcomingController,
getClientHistoryController,
getBarberWeekController,
cancelReservationController,
getOccupiedTimeSlotsController,
getBarberTodayController,
getBarberUpcomingController,
getBarberStatsController} from "../controllers/reservationController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireSelf } from "../middlewares/requireSelf";
import { requireBarberSelfOrAdmin } from "../middlewares/requireBarberSelfOrAdmin";

const router = Router();

// Créer une réservation
router.post("/", authMiddleware, createReservationController);

// Client : réservations à venir
router.get("/client/:username/upcoming",authMiddleware,requireSelf,getClientUpcomingController);

// Client : historique
router.get("/client/:username/history",authMiddleware,requireSelf,getClientHistoryController);

// Barber : réservations de la semaine
router.get("/barber/:username/week",authMiddleware,requireBarberSelfOrAdmin,getBarberWeekController);

// Annuler une réservation
router.delete("/:id/cancel",authMiddleware,cancelReservationController);

router.get("/occupied", getOccupiedTimeSlotsController);

// Barber Dashboard : today's reservations
router.get("/barber/:username/today",authMiddleware,requireBarberSelfOrAdmin,getBarberTodayController);

// Barber Dashboard : upcoming reservations
router.get("/barber/:username/upcoming",authMiddleware,requireBarberSelfOrAdmin,getBarberUpcomingController);

// Barber Dashboard : stats
router.get("/barber/:username/stats",authMiddleware,requireBarberSelfOrAdmin,getBarberStatsController);


export default router;
