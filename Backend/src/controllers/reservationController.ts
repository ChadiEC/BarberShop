import { Request, Response } from "express";
import {
  createReservation,
  getClientUpcoming,
  getClientHistory,
  getBarberWeek,
  cancelReservation,
  completeReservation,
  getOccupiedTimeSlots
} from "../services/reservationService";
import { AuthRequest } from "../types/types";
import Reservation from "../models/Reservation";

export async function createReservationController(
  req: AuthRequest,
  res: Response
) {
  try {
    const clientUsername = req.user!.username;
    const { service, barber, date, time } = req.body;

    // Validation date future
    const chosenDate = new Date(`${date}T${time}`);
    const now = new Date();
    if (chosenDate < now) {
      return res.status(400).json({ message: "Cannot book a past date." });
    }

    // Prevent double booking (barber)
    const barberConflict = await Reservation.findOne({
      barberUsername: barber,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (barberConflict) {
      return res.status(400).json({
        message: "This barber already has a reservation at this time.",
      });
    }

    // Prevent double booking (client)
    const clientConflict = await Reservation.findOne({
      clientUsername,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (clientConflict) {
      return res.status(400).json({
        message: "You already have a reservation at this time.",
      });
    }

    // Create reservation
    const reservation = await createReservation({
      clientUsername,
      barberUsername: barber,
      serviceName: service,
      date,
      time,
    });

    return res.status(201).json(reservation);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}

export async function getClientUpcomingController(req: Request, res: Response) {
  const { username } = req.params;
  const list = await getClientUpcoming(username!);
  res.json(list);
}

export async function getClientHistoryController(req: Request, res: Response) {
  const { username } = req.params;
  const list = await getClientHistory(username!);
  res.json(list);
}

export async function getBarberWeekController(req: Request, res: Response) {
  const { username } = req.params;
  const list = await getBarberWeek(username!);
  res.json(list);
}

export async function cancelReservationController(req: Request, res: Response) {
  const { id } = req.params;
  const result = await cancelReservation(id!);
  res.json(result);
}

export async function getOccupiedTimeSlotsController(req: Request, res: Response) {
  const { barber, date } = req.query;

  if (!barber || !date) {
    return res.status(400).json({ message: "Missing barber or date." });
  }

  const occupied = await getOccupiedTimeSlots(String(barber), String(date));

  res.json(occupied);
}
