import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import os from "os";
import { promisify } from "util";
import { createClip } from "../services/videoService";
import { UploadToCloudinary } from "../services/CloudinaryUpload";

const unlinkAsync = promisify(fs.unlink);
const uploadsDir = os.tmpdir();

export async function ClipVideo(req: any, res: any) {
  const userId = req.user._id;
  console.log("Clip Video Request for user:", userId, req.body);

  const { url, startTime, endTime } = req.body as {
    url: string;
    startTime: string;
    endTime: string;
  };

  if (!url || !startTime || !endTime) {
    return res
      .status(400)
      .json({ error: "url, startTime, and endTime are required" });
  }

  const finalClipPath = path.join(uploadsDir, `clip-${Date.now()}.mp4`);

  try {
    const toSec = (hms: string) => {
      const parts = hms.split(":").map(Number);
      const h = parts[0] || 0;
      const m = parts[1] || 0;
      const s = parts[2] || 0;
      return h * 3600 + m * 60 + s;
    };

    const durationSec = toSec(endTime) - toSec(startTime);
    if (durationSec <= 0) {
      throw new Error("End time must be after start time.");
    }

    console.log(
      `Creating clip from ${url}: start=${startTime}, duration=${durationSec}s`
    );

    await createClip(url, startTime, `${durationSec}`, finalClipPath);

    console.log(`Final clip created: ${finalClipPath}`);

    // Upload to Cloudinary
    await UploadToCloudinary(finalClipPath, userId);

    // Send the file to the user and clean up afterward
    res.download(finalClipPath, "clip.mp4", async (err: any) => {
      if (err) {
        console.error("Error sending file to user:", err);
      }
      // The final clip is the only file that needs to be deleted here
      await unlinkAsync(finalClipPath).catch((e) =>
        console.error("Failed to clean up final clip:", e)
      );
    });
  } catch (err) {
    console.error("ClipVideo error:", err);
    res.status(500).json({
      error: (err as Error).message,
    });
  }
}
