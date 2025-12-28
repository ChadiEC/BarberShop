import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import "../css/Home.css";

interface Barber {
  username: string;
  fullname: string;
  photoUrl?: string;
  avgRating?: number;
  ratingCount?: number;
}

export default function Home() {
  const [topBarbers, setTopBarbers] = useState<Barber[]>([]);
  const [badgeWinners, setBadgeWinners] = useState<string[]>([]);

  useEffect(() => {
    async function loadTopBarbers() {
      const res = await api.get("/barbers");

      const sorted = [...res.data]
        .filter((b) => b.ratingCount > 0)
        .sort((a, b) => {
          if (b.avgRating !== a.avgRating) {
            return b.avgRating - a.avgRating;
          }
          return b.ratingCount - a.ratingCount;
        });

      setTopBarbers(sorted.slice(0, 3)); // affichage
      setBadgeWinners(sorted.length > 0 ? [sorted[0].username] : []);
    }

    loadTopBarbers();
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <h1>Welcome to Barber Web</h1>
        <p>Book your next haircut with professional barbers you can trust.</p>

        <div className="hero-buttons">
          <Link to="/barbers" className="btn-primary">
            Find a Barber
          </Link>

          <Link to="/booking" className="btn-outline">
            Book Now
          </Link>
        </div>
      </section>
      <section className="features">
        <div className="feature-card">
          <h3>💈 Professional Barbers</h3>
          <p>Experienced barbers with verified profiles.</p>
        </div>

        <div className="feature-card">
          <h3>⭐ Real Reviews</h3>
          <p>Honest ratings from real clients.</p>
        </div>

        <div className="feature-card">
          <h3>📅 Easy Booking</h3>
          <p>Choose your barber, date and time in seconds.</p>
        </div>
      </section>

      {/* TOP BARBERS */}
      <section className="top-barbers">
        <h2>⭐ Top Rated Barbers</h2>

        <div className="barber-grid">
          {topBarbers.map((b) => (
            <Link
              to={`/barbers/${b.username}`}
              className="barber-card"
              key={b.username}
            >
              {badgeWinners.includes(b.username) && (
                <span className="top-badge">TOP BARBER</span>
              )}
              <img
                src={
                  b.photoUrl ||
                  "https://lagarebarbier.ca/cdn/shop/files/IR4A6572.jpg"
                }
                alt={b.fullname}
              />

              <h3>{b.fullname}</h3>

              <p className="rating">
                ⭐ {b.avgRating}{" "}
                <span className="count">
                  ({b.ratingCount} review{b.ratingCount! > 1 ? "s" : ""})
                </span>
              </p>
            </Link>
          ))}
        </div>

        {topBarbers.length === 0 && (
          <p className="no-barbers">No ratings yet.</p>
        )}
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready for a fresh look?</h2>
        <Link to="/booking" className="btn-primary">
          Book Your Appointment
        </Link>
      </section>
    </div>
  );
}
