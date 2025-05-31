import { Router } from "express";
import multer from "multer";
import { Userauth } from "../auth";
import { UploadToCloudinary } from "../services/CloudinaryUpload";
const storage = multer.memoryStorage(); // Stores the file in memory as a Buffer
const upload = multer({ storage });

export const uploadVideo = Router();
uploadVideo.post(
  "/",
  Userauth,
  upload.single("video"),
  async (req: any, res: any) => {
    const userId = req.user._id;

    const file = req.file; 

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // Convert buffer to base64 Data URI
      const base64Video = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;

      await UploadToCloudinary(base64Video, userId);

      res.json({ message: "Video stored in DB" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error while storing video", error });
    }
  }
);
