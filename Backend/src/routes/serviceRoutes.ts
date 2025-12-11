import { Router } from "express";
import {getServices,getService,createServiceController,updateServiceController,deleteServiceController } from "../controllers/serviceController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireStaff } from "../middlewares/requireStaff";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

router.post("/",authMiddleware,requireStaff,createServiceController)
router.put("/:name",authMiddleware,requireStaff,updateServiceController)
router.delete("/:name",authMiddleware,requireStaff,deleteServiceController)

router.get("/",getServices)
router.get("/:name",getService)

export default router;