import { Router } from "express";
import { issueEmergencyToken } from "../controllers/accessController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/request", protect(), issueEmergencyToken);

export default router;
