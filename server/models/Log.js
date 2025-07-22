import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
    meta: { type: Object }, // optional: more detail (IP, label, etc.)
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);
