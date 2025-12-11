import { Request, Response } from "express";
import * as userService from "../services/userService";

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const {username} = req.params
  const user = await userService.getUserByUsername(username!);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

export async function createUser(req: Request, res: Response) {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateUser(req: Request, res: Response) {
  const {username} = req.params
  const updated = await userService.updateUser(username!, req.body);
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json(updated);
}

export async function deleteUser(req: Request, res: Response) {
  const {username} = req.params  
  const deleted = await userService.deleteUser(username!);
  if (!deleted) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
}
