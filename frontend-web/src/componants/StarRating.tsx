import { useState } from "react";
import "../css/StarRating.css";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function StarRating({ value, onChange }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            (hover ?? value) >= star ? "star filled" : "star"
          }
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
