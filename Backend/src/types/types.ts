import { Request } from "express";

export interface AuthUserPayload {
  id: string;          
  username: string;
  role: "client" | "barber" | "admin";
}

export interface AuthRequest extends Request {
  user?: AuthUserPayload;
}