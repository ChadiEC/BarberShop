import Reservation from "../models/Reservation";
import { ReservationInput } from "../models/Reservation";

export async function createReservation(data: ReservationInput) {
  return Reservation.create(data);
}

export async function getClientUpcoming(username: string) {
  return Reservation.find({ clientUsername: username, status: "upcoming" });
}

export async function getClientHistory(username: string) {
  return Reservation.find({ clientUsername: username, status: "completed" });
}

export async function getBarberWeek(username: string) {
  return Reservation.find({ barberUsername: username, status: "upcoming" });
}

export async function cancelReservation(id: string) {
  return Reservation.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
}

export async function completeReservation(id: string) {
  return Reservation.findByIdAndUpdate(id, { status: "completed" }, { new: true });
}

export async function getOccupiedTimeSlots(barberUsername: string, date: string) {
  const reservations = await Reservation.find({
    barberUsername,
    date,
    status: { $ne: "cancelled" },
  });

  return reservations.map(r => r.time);
}
