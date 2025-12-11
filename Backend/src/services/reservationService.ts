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

export async function getBarberToday(username: string) {
  const today = new Date().toISOString().split("T")[0];
  //@ts-ignore
  return Reservation.find({
    barberUsername: username,
    date: today,
    status: { $ne: "cancelled" }
  }).sort({ time: 1 });
}

export async function getBarberUpcoming(username: string) {
  const today = new Date().toISOString().split("T")[0];
  //@ts-ignore
  return Reservation.find({
    barberUsername: username,
    status: "upcoming",
    date: { $gte: today }
  }).sort({ date: 1, time: 1 });
}

export async function getBarberStats(username: string) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // 7 jours
  const weekAhead = new Date();
  weekAhead.setDate(now.getDate() + 7);

  // 30 jours
  const monthAhead = new Date();
  monthAhead.setDate(now.getDate() + 30);

  const [todayCount, weekCount, monthCount, serviceStats] = await Promise.all([
    //@ts-ignore
    Reservation.countDocuments({
      barberUsername: username,
      date: today,
      status: { $ne: "cancelled" }
    }),

    //@ts-ignore
    Reservation.countDocuments({
      barberUsername: username,
      date: { $gte: today, $lte: weekAhead.toISOString().split("T")[0] },
      status: { $ne: "cancelled" }
    }),

    //@ts-ignore
    Reservation.countDocuments({
      barberUsername: username,
      date: { $gte: today, $lte: monthAhead.toISOString().split("T")[0] },
      status: { $ne: "cancelled" }
    }),

    Reservation.aggregate([
      { $match: { barberUsername: username, status: { $ne: "cancelled" } } },
      { $group: { _id: "$serviceName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ])
  ]);

  return {
    today: todayCount,
    week: weekCount,
    month: monthCount,
    topServices: serviceStats
  };
}


export async function cancelReservation(id: string) {
  return Reservation.findByIdAndDelete(id, { status: "cancelled" });
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
