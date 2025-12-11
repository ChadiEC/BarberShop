import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";
import User from "../models/User";

export async function register(req: Request, res: Response) {
  try {
    const { fullname, email, password,username,phoneNumber } = req.body;

    if (!fullname || !email || !password || !username || !phoneNumber) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await registerUser(fullname, email, password,username,phoneNumber);

    res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const { user, token } = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      token,
      user
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export const me = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user?.id) {
    return res.status(401).json({ message: "Invalid token payload" });
  }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
