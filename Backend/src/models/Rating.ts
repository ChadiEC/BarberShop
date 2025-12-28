import mongoose,{ Schema, model, Document } from "mongoose";

export interface IRating extends Document {
  clientUsername: string;
  barberUsername: string;
  stars: number;
  comment?: string;
}

const RatingSchema = new Schema<IRating>({
  clientUsername: { type: String, required: true },
  barberUsername: { type: String, required: true },

  stars: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" }
}, { timestamps: true });

// 🔒 VERROU ANTI-TRICHE (ULTRA IMPORTANT)
RatingSchema.index(
  { clientUsername: 1, barberUsername: 1 },
  { unique: true }
);

export default mongoose.models.Rating ||
  mongoose.model<IRating>("Rating", RatingSchema)