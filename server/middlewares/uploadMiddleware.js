import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lifelockr_uploads",
    allowed_formats: ["pdf", "jpg", "jpeg", "png"],
    transformation: [{ width: 1000, crop: "limit" }],
  },
});

export const upload = multer({ storage });
