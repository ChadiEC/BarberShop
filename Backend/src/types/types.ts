import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    username: string;
    role: string;
    sub: string;
  };
}
