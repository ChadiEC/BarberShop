import { Schema, model, Document } from "mongoose";

export interface IReservation extends Document {
  clientUsername: string;
  barberUsername: string;
  serviceName: string;
  date: string; 
  time: string;
  status: "upcoming" | "completed" | "cancelled";
}

const ReservationSchema = new Schema<IReservation>({
  clientUsername: { type: String, required: true },
  barberUsername: { type: String, required: true },
  serviceName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming"
  }
}, { timestamps: true });

export type ReservationInput = {
  clientUsername: string;
  barberUsername: string;
  serviceName: string;
  date: string;
  time: string;
};

export default model<IReservation>("Reservation", ReservationSchema);
