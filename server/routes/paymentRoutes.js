import { Router } from "express";
import { createCheckoutSession } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();
router.post("/create-checkout-session", protect(), createCheckoutSession);
export default router;
