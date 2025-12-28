import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/types";

export function requireClient(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "client") {
    return res.status(403).json({ message: "Only clients can leave ratings" });
  }
  next();
}
