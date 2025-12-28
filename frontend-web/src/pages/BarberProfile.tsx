import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import RatingForm from "../componants/RatingForm";
import "../css/BarberProfile.css";
import toast from "react-hot-toast";

interface Barber {
  username: string;
  fullname: string;
  photoUrl?: string;
  bio?: string;
  specialties?: string[];
  experience?: number;
  avgRating?: number;
  ratingCount?: number;
}

interface Rating {
  _id: string;
  clientUsername: string;
  stars: number;
  comment?: string;
  createdAt: string;
}

interface ScheduleSlot {
  day: string;
  time: string;
  available: boolean;
}

export default function BarberProfile() {
  const { username } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [barber, setBarber] = useState<Barber | null>(null);
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  // Load barber
  useEffect(() => {
    async function loadBarber() {
      if (!username) return;
      const res = await api.get(`/barbers/${username}`);
      setBarber(res.data);
    }

    async function loadSchedule() {
      if (!username) return;
      const res = await api.get(`/schedule/${username}`);
      setSchedule(res.data);
    }

    loadBarber();
    loadSchedule();
  }, [username]);

  // Load ratings
  useEffect(() => {
    async function loadRatings() {
      try {
        const res = await api.get(`/rating/${username}`);
        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error loading ratings", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }

    if (username) loadRatings();
  }, [username]);

  // Logic
  const alreadyRated =
    token &&
    user?.role === "client" &&
    reviews.some((r) => r.clientUsername === user.username);

  function handleBook(barberUsername: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Log in or register to book now!");
      navigate("/login");
      return;
    }

    navigate("/booking", {
      state: {
        preselectedBarber: barberUsername,
      },
    });
  }

  if (!barber) return <div className="loading">Loading...</div>;

  return (
    <div className="barber-profile">
      {/* ===== HEADER ===== */}
      <div className="profile-header">
        <img
          src={
            barber.photoUrl ||
            "https://lagarebarbier.ca/cdn/shop/files/IR4A6572.jpg"
          }
          alt={barber.fullname}
          className="barber-photo"
        />

        <div>
          <h1>{barber.fullname}</h1>
          <p className="username">@{barber.username}</p>

          {barber.avgRating !== undefined && (
            <p className="rating-summary">
              ⭐ {barber.avgRating} ({barber.ratingCount} reviews)
            </p>
          )}

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

      {/* ===== RATING FORM ===== */}
      {token && user.role === "client" && !alreadyRated && (
        <RatingForm barberUsername={username!} />
      )}

      {token && user.role === "client" && alreadyRated && (
        <p className="already-rated">You already rated this barber ⭐</p>
      )}

      {/* ===== REVIEWS ===== */}
      <div className="reviews-section">
        <h2>⭐ Reviews</h2>

        {!loading && reviews.length === 0 && (
          <p className="no-reviews">No reviews yet.</p>
        )}

        {reviews.map((r) => (
          <div key={r._id} className="review-card">
            <div className="review-header">
              <span className="review-stars">
                {"★".repeat(r.stars)}
                {"☆".repeat(5 - r.stars)}
              </span>
              <span className="review-date">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            </div>

            {r.comment && <p className="comment">{r.comment}</p>}
            <p className="client">— {r.clientUsername}</p>
          </div>
        ))}
      </div>

      
      {/* ===== BOOK NOW ===== */}
      <button
        className="service-btn"
        onClick={() => handleBook(barber.username)}
      >
        Book Now
      </button>
    </div>
  );
}
