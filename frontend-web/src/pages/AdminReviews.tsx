import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import "../css/AdminReviews.css";

interface Review {
  _id: string;
  barberUsername: string;
  clientUsername: string;
  stars: number;
  comment?: string;
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openBarber, setOpenBarber] = useState<string | null>(null);

  async function loadReviews() {
    try {
      const res = await api.get("/rating/all"); // admin route
      setReviews(res.data);
    } catch {
      toast.error("Failed to load reviews");
    }
  }
  useEffect(() => {
    loadReviews();
  }, []);

  async function deleteReview(id: string) {
    if (!confirm("Delete this review permanently?")) return;

    try {
      await api.delete(`/rating/${id}`);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  }

  const grouped = reviews.reduce<Record<string, Review[]>>((acc, r) => {
    const barber = r.barberUsername || "Unknown barber";
    acc[barber] = acc[barber] || [];
    acc[barber].push(r);
    return acc;
  }, {});

  return (
    <div className="admin-reviews">
      <h1>🛡 Review Moderation</h1>

      {Object.keys(grouped).length === 0 && <p>No reviews available.</p>}

      {Object.entries(grouped).map(([barber, barberReviews]) => (
        <div key={barber} className="barber-group">
          <button
            className="barber-toggle"
            onClick={() => setOpenBarber(openBarber === barber ? null : barber)}
          >
            <span>{barber}</span>
            <span>({barberReviews.length})</span>
          </button>

          {openBarber === barber && (
            <div className="reviews-list">
              {barberReviews.map((r) => (
                <div key={r._id} className="review-card">
                  <div className="review-header">
                    <strong>⭐ {r.stars}</strong>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="comment">{r.comment || "No comment"}</p>

                  <small>
                    By <b>{r.clientUsername}</b>
                  </small>

                  <button
                    className="delete-btn"
                    onClick={() => deleteReview(r._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
