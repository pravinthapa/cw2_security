import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { validatePassword } from "../utils/passwordValidator.js";
import { sendOTP } from "../utils/sendOTP.js";
import cryptoRandomString from "crypto-random-string";
import crypto from "crypto";

const saltRounds = 12;
const otpSaltRounds = 6; // lighter hash for short code
const hashOTP = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

// ── POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // enforce strong password
    const { valid, message } = validatePassword(password);
    if (!valid) return res.status(400).json({ message });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ email, password: hashed });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};
// ── POST /api/auth/register
export const verifyOtp = async (req, res, next) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId).select(
      "+otpHash +otpExpires +role"
    );

    if (
      !user ||
      !user.otpHash ||
      user.otpExpires < Date.now() ||
      user.otpHash !== hashOTP(code)
    )
      return res.status(401).json({ message: "Invalid or expired code" });

    // clear otp
    user.otpHash = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    if (user.mfaEnabled) {
      // generate 6‑digit numeric OTP
      const code = cryptoRandomString({ length: 6, type: "numeric" });
      user.otpHash = hashOTP(code);
      user.otpExpires = Date.now() + 5 * 60 * 1000;
      await user.save({ validateBeforeSave: false });
      await sendOTP(user.email, code);
      return res.json({ status: "MFA_REQUIRED", userId: user._id });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};
export const logout = (req, res) => {
  // Simply clear cookie if you set token in a cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out" });
};
