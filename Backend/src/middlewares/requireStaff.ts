import { Request, Response, NextFunction } from "express";

export function requireStaff(req: Request & { user?: any }, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role === "barber" || req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Staff only" });
}
