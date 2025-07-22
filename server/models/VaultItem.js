import mongoose from "mongoose";

const vaultItemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    label: { type: String, required: true }, // e.g., 'Blood Type'
    type: { type: String, required: true },
    notes: { type: String },
    tags: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("VaultItem", vaultItemSchema);
