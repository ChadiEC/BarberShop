import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../css/Reservation.css";

interface Reservation {
  _id: string;
  serviceName: string;
  barberUsername: string;
  date: string;   // YYYY-MM-DD
  time: string;  // HH:mm
  status: string;
}
export default function MyReservations() {
  const [upcoming, setUpcoming] = useState<Reservation[]>([]);
  const [history, setHistory] = useState<Reservation[]>([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user?.username;

  useEffect(() => {
    if (!username) return;

    async function loadReservations() {
      try {
        const u = await api.get(`/reservations/client/${username}/upcoming`);
        setUpcoming(u.data);

        const h = await api.get(`/reservations/client/${username}/history`);
        setHistory(h.data);

      } catch (err) {
        console.error("Error loading reservations:", err);
      }
    }

    loadReservations();
  }, [username]);

  async function cancelReservation(id: string) {
    try {
      await api.delete(`/reservations/${id}/cancel`);
      alert("Reservation canceled!");

      // reload upcoming list
      setUpcoming(upcoming.filter(r => r._id !== id));

    } catch (err) {
      alert("Failed to cancel reservation");
      console.error(err);
    }
  }

  return (
    <div className="my-reservations">
      <h1>My Reservations</h1>

      {/* UPCOMING */}
      <h2>Upcoming</h2>
      {upcoming.length === 0 && <p>No upcoming reservations.</p>}

      <div className="reservations-list">
        {upcoming.map(r => (
          <div className="reservation-card" key={r._id}>
            <p><strong>Service:</strong> {r.serviceName}</p>
            <p><strong>Barber:</strong> {r.barberUsername}</p>
            <p><strong>Date:</strong> {r.date}</p>
            <p><strong>Time:</strong> {r.time}</p>
            <button onClick={() => cancelReservation(r._id)}>
              Cancel
            </button>
          </div>
        ))}
      </div>

      {/* HISTORY */}
      <h2>History</h2>
      {history.length === 0 && <p>No history.</p>}

      <div className="reservations-list">
        {history.map(r => (
          <div className="reservation-card" key={r._id}>
            <p><strong>Service:</strong> {r.serviceName}</p>
            <p><strong>Barber:</strong> {r.barberUsername}</p>
            <p><strong>Date:</strong> {r.date}</p>
            <p><strong>Time:</strong> {r.time}</p>
            <p className="status">{r.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
