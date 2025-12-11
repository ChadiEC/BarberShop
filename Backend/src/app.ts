import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import serviceRoutes from "./routes/serviceRoutes"
import userRoutes from "./routes/userRoutes"
import scheduleRoutes from "./routes/scheduleRoutes"
import barberRoutes from "./routes/barberRoutes";
import reservationRoutes from "./routes/reservationRoutes"
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/services",serviceRoutes)
app.use("/api/users",userRoutes)
app.use("/api/reservations", reservationRoutes)
app.use("/api/schedule",scheduleRoutes)
app.use("/api/barbers", barberRoutes);

export default app;
