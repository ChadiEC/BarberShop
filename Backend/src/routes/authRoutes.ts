import { Router } from "express";
import { register, login, me,changePasswordController,requestPasswordResetController,resetPasswordController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/forgot-password", requestPasswordResetController);
router.post("/reset-password/:token", resetPasswordController);
router.post("/change-password", authMiddleware, changePasswordController);
export default router;
