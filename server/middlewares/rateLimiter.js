import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts in window
  message: { message: "Too many login attempts, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  // key = IP + email so same IP can still attempt other accounts
  keyGenerator: (req) => `${req.ip}_${req.body?.email ?? ""}`,
});
