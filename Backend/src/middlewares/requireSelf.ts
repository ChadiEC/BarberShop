import { Request, Response, NextFunction } from "express";

export function requireSelf(req: Request & { user?: any }, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const isAdmin = req.user.role === "admin";
  const isSelf = req.user.username === req.params.username;

  if (isAdmin || isSelf) {
    return next();
  }

  return res.status(403).json({ message: "You are not allowed to access this resource" });
}
