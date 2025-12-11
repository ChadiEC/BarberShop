import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/types";

export function requireBarberSelfOrAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const user = req.user!;
  const { username } = req.params;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Admin → accès complet
  if (user.role === "admin") {
    return next();
  }

  // Barber → accès seulement à son propre dashboard
  if (user.role === "barber" && user.username === username) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden" });
}
