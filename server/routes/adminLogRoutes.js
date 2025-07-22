import { Router } from "express";
import Log from "../models/Log.js";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", protect(), restrictTo("ADMIN"), async (req, res) => {
  const logs = await Log.find()
    .populate("user", "email")
    .sort({ createdAt: -1 })
    .limit(200);
  res.json(logs);
});

export default router;
