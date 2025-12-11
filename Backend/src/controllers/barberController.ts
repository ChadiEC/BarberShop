import { Request, Response } from "express";
import {getAllBarbers,getBarberByUsername,updateBarberProfile,createBarber,deleteBarber} from "../services/barberService";
import  User  from "../models/User";
import bcrypt from "bcryptjs";
import { AuthRequest } from "../types/types";

// GET /api/barbers
export async function getAllBarbersController(req: Request, res: Response) {
  const barbers = await getAllBarbers();
  return res.json(barbers);
}

// GET /api/barbers/:username
export async function getBarberController(req: Request, res: Response) {
  const { username } = req.params;

  const barber = await getBarberByUsername(username!);

  if (!barber) {
    return res.status(404).json({ message: "Barber not found" });
  }

  return res.json(barber);
}

//@ts-ignore
export async function createBarberController(req, res) {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const barber = await User.create({
      username: req.body.username,
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword, // sera hashé par ton UserSchema
      bio: req.body.bio,
      experience: req.body.experience,
      photoUrl: req.body.photoUrl,
      role: "barber",
    });

    res.status(201).json(barber);
  } catch (err) {
    //@ts-ignore
    res.status(400).json({ message: err.message });
  }
}


//@ts-ignore
export async function updateBarberController(req, res) {
  try {
    const { username } = req.params;

    const updateData: any = {};

    if (req.body.fullname) updateData.fullname = req.body.fullname;
    if (req.body.bio) updateData.bio = req.body.bio;
    if (req.body.experience !== undefined) updateData.experience = req.body.experience;
    if (req.body.photoUrl) updateData.photoUrl = req.body.photoUrl;
    if (req.body.specialties) updateData.specialties = req.body.specialties;
    
    const updated = await User.findOneAndUpdate(
      { username, role: "barber" },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Barber not found" });
    }

    res.json(updated);
  } catch (err) {
    //@ts-ignore
    res.status(400).json({ message: err.message });
  }
}

//@ts-ignore
export async function deleteBarberController(req, res) {
  try {
    const { username } = req.params;

    const deleted = await User.findOneAndDelete({
      username,
      role: "barber",
    });

    if (!deleted) {
      return res.status(404).json({ message: "Barber not found" });
    }

    res.json({ message: "Barber deleted successfully" });
  } catch (err) {
    //@ts-ignore
    res.status(400).json({ message: err.message });
  }
}