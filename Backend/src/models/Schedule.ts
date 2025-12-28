import { Schema, model, Document } from "mongoose";

export interface ISchedule extends Document {
  barberUsername: string;
  day: string;
  startTime: string;
  endTime: string;
}

const ScheduleSchema = new Schema<ISchedule>({
  barberUsername: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

// barber + day doit être unique
ScheduleSchema.index({ barberUsername: 1, day: 1 }, { unique: true });

export default model<ISchedule>("Schedule", ScheduleSchema);