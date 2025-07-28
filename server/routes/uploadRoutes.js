import express from "express";
import multer from "multer";
import {
  uploadFile,
  getFiles,
  deleteFile,
} from "../controllers/uploadController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadFile);
router.get("/", getFiles);
router.delete("/:id/", deleteFile);

export default router;
