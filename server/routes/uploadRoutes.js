import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { uploadFile } from "../controllers/uploadController.js";

const router = Router();

router.post("/", protect(), upload.single("file"), uploadFile);

export default router;
