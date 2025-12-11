import { Request, Response } from "express";
import { createSchedule, getScheduleForBarber, updateSchedule, deleteSchedule } from "../services/scheduleService";
import Reservation from "../models/Reservation";

export async function createScheduleController(req: Request, res: Response) {
  const schedule = await createSchedule(req.body);
  return res.status(201).json(schedule);
}

export async function getScheduleController(req: Request, res: Response) {
  const { username } = req.params;
  const schedule = await getScheduleForBarber(username!);
  return res.json(schedule);
}

export async function updateScheduleController(req: Request, res: Response) {
  const { username, day } = req.params;
  const updated = await updateSchedule(username!, day!, req.body);
  return res.json(updated);
}

export async function deleteScheduleController(req: Request, res: Response) {
  const { username, day } = req.params;
  await deleteSchedule(username!, day!);
  return res.json({ message: "Schedule deleted" });
}

const WORK_START = 10;
const WORK_END = 18;

export async function getAvailableSlotsController(req: Request, res: Response) {
  try {
    const { barberUsername, date } = req.params;

    // Génération de tous les slots de la journée
    const slots: string[] = [];
    for (let h = WORK_START; h < WORK_END; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }

    // Trouver les réservations existantes
    //@ts-ignore
    const reservations = await Reservation.find({
      barberUsername,
      date,
      status: { $ne: "cancelled" }
    });

    const taken = reservations.map(r => r.time);

    // Filtrer les slots disponibles
    const available = slots.filter(t => !taken.includes(t));

    res.json({ available, taken });
  } catch (err) {
    res.status(500).json({ message: "Error loading slots" });
  }
}