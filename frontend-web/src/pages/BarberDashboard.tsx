import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/BarberDashboard.css"
import api from "../api/axiosInstance";

export default function BarberDashboard() {
  const { username } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [today, setToday] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState<any>(null);

  // Redirect if not logged in
  if (!localStorage.getItem("token")) {
    navigate("/login");
  }

  // Only admin or the barber himself
  if (user.role !== "admin" && user.username !== username) {
    return <div style={{ paddingTop: "120px", paddingLeft: "50px", color: "white" }}>
      Access Denied
    </div>;
  }

  async function loadDashboard() {
    const r1 = await api.get(`/reservations/barber/${username}/today`);
    const r2 = await api.get(`/reservations/barber/${username}/upcoming`);
    const r3 = await api.get(`/reservations/barber/${username}/stats`);

    setToday(r1.data);
    setUpcoming(r2.data);
    setStats(r3.data);
  }

  useEffect(() => {
    loadDashboard();
  }, [username]);

  return (
    <div style={{ color: "white" }}>
      <h1 style={{ marginBottom: "20px" }}>Barber Dashboard — {username}</h1>

      {/* ---- Stats ---- */}
      {stats && (
        <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
          <div className="stat-card">
            <h3>Today</h3>
            <p>{stats.today}</p>
          </div>

          <div className="stat-card">
            <h3>Week</h3>
            <p>{stats.week}</p>
          </div>

          <div className="stat-card">
            <h3>Month</h3>
            <p>{stats.month}</p>
          </div>
        </div>
      )}

      {/* ---- Today's Appointments ---- */}
      <h2>Today's Appointments</h2>
      {today.length === 0 && <p>Aucun rendez-vous aujourd’hui.</p>}
      {today.map((r: any) => (
        <div key={r._id} className="dashboard-card">
          Client: {r.clientUsername} — {r.time} — {r.serviceName}
        </div>
      ))}

      {/* ---- Upcoming ---- */}
      <h2 style={{ marginTop: "40px" }}>Upcoming Appointments</h2>
      {upcoming.length === 0 && <p>Aucun rendez-vous futur.</p>}
      {upcoming.map((r: any) => (
        <div key={r._id} className="dashboard-card">
          {r.date} at {r.time} — {r.clientUsername} — {r.serviceName}
        </div>
      ))}
    </div>
  );
}
