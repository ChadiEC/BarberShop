import { useState } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";
import StarRating from "./StarRating";

interface Props {
  barberUsername: string;
}

export default function RatingForm({ barberUsername }: Props) {
  const [stars, setStars] = useState<number>(5);
  const [comment, setComment] = useState("");

  async function submitRating() {
    try {
      await api.post(`/rating/${barberUsername}`, {
        stars,
        comment,
      });

      toast.success("Thanks for your review!");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit rating");
    }
  }

  return (
    <div className="rating-form">
      <h3>Rate this barber</h3>

      <StarRating value={stars} onChange={setStars} />

      <textarea
        placeholder="Leave a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button type="button" onClick={submitRating}>
        Submit review
      </button>
    </div>
  );
}
