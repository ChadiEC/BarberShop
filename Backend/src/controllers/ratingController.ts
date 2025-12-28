import { Request, Response } from "express";
import {
  createRatingService,
  getBarberAverageRating,
  getAllBarbers,
  deleteRating,
  getAllRatings
} from "../services/ratingService";
import { AuthRequest } from "../types/types";
import Rating from "../models/Rating";
import User from "../models/User";


export async function getAllRatingsController(req: Request, res: Response) {
  const ratings = await getAllRatings();
  res.json(ratings);
}


export async function createRating(req: AuthRequest, res: Response) {
  try {
    const clientUsername = req.user!.username;
    const barberUsername = req.params.barberUsername!;
    const { stars, comment } = req.body;

    if (stars === undefined || stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    const barberExists = await User.findOne({
      username: barberUsername,
      role: "barber",
    });

    if (!barberExists) {
      return res.status(400).json({ message: "Barber not found" });
    }

    const rating = await createRatingService({
      clientUsername,
      barberUsername,
      stars,
      comment,
    });

    res.status(201).json(rating);
  } catch (err: any) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You already rated this barber" });
    }

    res.status(400).json({ message: err.message });
  }
}

export async function getAllBarbersController(req: Request, res: Response) {
  try {
    const barbers = await getAllBarbers(); // ← celui qui calcule avgRating
    res.json(barbers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getBarberController(req: Request, res: Response) {
  try {
    const { username } = req.params;

    // Cherche le barber dans Users
    //@ts-ignore
    const barber = await User.findOne({ username, role: "barber" }).lean();
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    // Calcule rating + count
    const rating = await getBarberAverageRating(username!);

    return res.json({
      ...barber,
      avgRating: rating.avgRating,
      ratingCount: rating.ratingCount,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function getBarberRatings(req: Request, res: Response) {
  const { username } = req.params;

  try {
    const ratings = await Rating.find({ barberUsername: username }).sort({
      createdAt: -1,
    });
    res.json(ratings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

export async function deleteRatingController(req: Request, res: Response) {
  const {id} = req.params
  const deleted = await deleteRating(id!);
  if (!deleted) return res.status(404).json({ message: "Review not found" });
  res.json({ message: "Review deleted" });
}