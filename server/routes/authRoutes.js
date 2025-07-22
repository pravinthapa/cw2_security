import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";
import { verifyOtp } from "../controllers/authController.js";
import { logout } from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);

export default router;
