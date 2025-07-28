import fs from "fs";
import path from "path";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);
import File from "../models/uploadModel.js";

const UPLOAD_DIR = path.join("uploads");

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { path: url, originalname, filename, mimetype, size } = req.file;

    const newFile = new File({
      url,
      public_id: req.file.filename,
      originalName: originalname,
      format: mimetype,
      size,
    });

    const saved = await newFile.save();

    res.status(201).json({
      message: "File uploaded and saved",
      file: saved,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Files retrieved",
      count: files.length,
      files,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

export const deleteFile = async (req, res) => {
  const { id } = req.query;

  try {
    const result = await cloudinary.uploader.destroy(id);

    // if (result.result !== "ok") {
    //   return res
    //     .status(404)
    //     .json({ message: "File not found or already deleted" });
    // }
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Cloudinary Delete Error:", err);
    res.status(500).json({ message: "Failed to delete file" });
  }
};
