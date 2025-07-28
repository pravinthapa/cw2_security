import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    originalName: { type: String },
    format: { type: String },
    size: { type: Number },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional
    },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
