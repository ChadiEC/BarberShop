import { Router } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/requireAdmin";
import { requireStaff } from "../middlewares/requireStaff";
import { requireSelf } from "../middlewares/requireSelf";

const router = Router();

// ADMIN ONLY — Create user
router.post("/", authMiddleware, requireAdmin, createUser);

// ALL USERS — Read
router.get("/", requireStaff,getUsers);
router.get("/:username", authMiddleware,requireSelf, getUser);

// ADMIN OR USER ITSELF — Update
router.put("/:username", authMiddleware,requireSelf, updateUser);

// ADMIN ONLY — Delete
router.delete("/:username", authMiddleware, requireAdmin, deleteUser);

export default router;
