import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { downloadSection, clipWithFfmpeg } from "../services/videoService";
import cloudinary from "../config/cloudinary";
import { VideoModel } from "../DB";
import { UploadToCloudinary } from "../services/CloudinaryUpload";
const unlinkAsync = promisify(fs.unlink);
const uploadsDir = path.join(__dirname, "../../uploads");

export async function ClipVideo(req: any, res: any) {
  // console.log((req.user as any).sub);
  console.log(req.user._id)

  // const userId = (req.user as any).sub;

  const userId = req.user._id;
  console.log("Clip Video Request:", req.body);
  const { url, startTime, endTime } = req.body as {
    url: string;
    startTime: string;
    endTime: string;
  };

  if (!url || !startTime || !endTime) {
    return res.status(400).json({ error: "url, startTime, endTime required" });
  }

  const ts = Date.now();
  const base = path.join(uploadsDir, `temp-${ts}`);
  const final = path.join(uploadsDir, `clip-${ts}.mp4`);

  try {
    console.log(`Downloading section from ${url}: ${startTime} to ${endTime}`);
    const downloaded = await downloadSection(
      url,
      startTime,
      endTime,
      base,
      uploadsDir
    );
    console.log(`Downloaded file: ${downloaded}`);

    const toSec = (hms: string) => {
      const [h = 0, m = 0, s = 0] = hms.split(":").map(Number);
      return h * 3600 + m * 60 + s;
    };

    const durationSec = toSec(endTime) - toSec(startTime);
    if (durationSec <= 0) throw new Error("endTime must be after startTime");

    console.log(`Clipping video: start=${startTime}, duration=${durationSec}`);
    await clipWithFfmpeg(downloaded, startTime, `${durationSec}`, final);

    console.log(`Final clip created: ${final}`);
    // res.download(final, "clip.mp4");

    // Uploading to Cloudinary and storing to DB
    await UploadToCloudinary(final, userId);

    res.download(final, "clip.mp4", async () => {
      await unlinkAsync(final).catch(() => {});
      await unlinkAsync(downloaded).catch(() => {});
    });
  } catch (err) {
    console.error("ClipVideo error:", err);
    res.status(500).json({
      error: (err as Error).message,
      stack: (err as Error).stack,
    });
  }
}
