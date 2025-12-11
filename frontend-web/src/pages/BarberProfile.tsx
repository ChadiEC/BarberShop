import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../css/BarberProfile.css";

interface Barber {
  username: string;
  fullname: string;
  photoUrl?: string;
  bio?: string;
  specialties?: string[];
  experience?: number;
}

interface ScheduleSlot {
  day: string;
  time: string;
  available: boolean;
}

export default function BarberProfile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const [barber, setBarber] = useState<Barber | null>(null);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);

  const loadBarber = async () => {
    if (!username) return;
    const res = await api.get(`/barbers/${username}`);
    setBarber(res.data);
  };

  const loadSchedule = async () => {
    if (!username) return;
    const res = await api.get(`/schedule/${username}`);
    setSchedule(res.data);
  };

  useEffect(() => {
    
    loadBarber();
    loadSchedule();
  }, [username]);

  function book(day: string, time: string) {
    navigate(`/booking?barber=${username}&day=${day}&time=${time}`);
  }

  if (!barber) return <div className="loading">Loading...</div>;

  return (
    <div className="barber-profile">
      {/* --- SECTION PHOTO + INFOS --- */}
      <div className="profile-header">
        <img
          src={barber.photoUrl || "https://lagarebarbier.ca/cdn/shop/files/IR4A6572.jpg?v=1736263971&width=1500"}
          alt={barber.fullname}
          className="barber-photo"
        />

        <div>
          <h1>{barber.fullname}</h1>
          <p className="username">@{barber.username}</p>
          {barber.bio && <p className="bio">{barber.bio}</p>}
          {barber.experience && <p>{barber.experience} years experience</p>}

          {barber.specialties && (
            <div className="specialties">
              <strong>Specialties:</strong>
              <ul>
                {barber.specialties.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* --- SECTION SCHEDULE --- */}
      <h2>Available Slots</h2>

      <div className="schedule-grid">
        {schedule.length === 0 && <p>No available slots.</p>}

        {schedule.map((slot, index) => (
          <div className="slot-card" key={index}>
            <p className="slot-day">{slot.day}</p>
            <p className="slot-time">{slot.time}</p>

            {slot.available ? (
              <button
                className="btn-book"
                onClick={() => book(slot.day, slot.time)}
              >
                Book
              </button>
            ) : (
              <p className="unavailable">Unavailable</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
