import { Request, Response } from "express";
import { registerUser, loginUser, changePasswordService,requestPasswordReset,resetPassword } from "../services/authService";
import User from "../models/User";
import {sendPasswordResetEmail} from "../utils/sendPasswordResetEmail"
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



export async function changePasswordController(req: Request & { user?: any }, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await changePasswordService(req.user.id, currentPassword, newPassword);

    res.json({ message: "Password updated successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function requestPasswordResetController(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const token = await requestPasswordReset(email);

    // send email here
    await sendPasswordResetEmail(email, token);

    res.json({ message: "Password reset email sent" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    await resetPassword(token!, newPassword);

    res.json({ message: "Password updated successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
