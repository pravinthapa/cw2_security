import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import Log from "../models/Log.js";

const router = Router();

router.get("/", protect(), async (req, res) => {
  const logs = await Log.find({ user: req.user.userId })
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(logs);
});

export default router;
