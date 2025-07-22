import mongoose from "mongoose";

const rolesEnum = ["OWNER", "EMERGENCY_CONTACT", "VIEWER", "ADMIN"];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false, // never return by default
    },
    role: {
      type: String,
      enum: rolesEnum,
      default: "OWNER",
    },
    mfaEnabled: { type: Boolean, default: true },
    mfaSecret: String, // e.g., TOTP secret (encrypted later)
    otpHash: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
