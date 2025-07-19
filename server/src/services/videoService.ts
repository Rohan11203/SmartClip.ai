import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Downloads a full video and then uses ffmpeg to efficiently clip a section,
 * including necessary options for server deployment.
 * @param url The YouTube video URL.
 * @param start The start time of the clip (e.g., "00:01:23").
 * @param duration The duration of the clip in seconds (e.g., "10").
 * @param outputPath The final path for the clipped and re-encoded video.
 * @returns A promise that resolves when clipping is complete.
 */
export async function createClip(
  url: string,
  start: string,
  duration: string,
  outputPath: string
): Promise<void> {
  const tempDir = os.tmpdir();
  const tempFileBase = path.join(tempDir, `temp-${Date.now()}`);

  // STEP 1: Download the full video stream with yt-dlp ---
  const downloadedFile = await new Promise<string>((resolve, reject) => {
    const outputTemplate = `${tempFileBase}.%(ext)s`;
    const expectedFinalPath = `${tempFileBase}.mp4`;

    // Check for cookies.txt in the project root
    const COOKIE_PATH = fs.existsSync("./cookies.txt") ? "./cookies.txt" : "";
    console.log("Using cookies file:", COOKIE_PATH || "None");

    const args = [
      url,
      "-f",
      "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
      "--merge-output-format",
      "mp4",
      "-o",
      outputTemplate,
      "--no-check-certificates",
      "--no-warnings",
      "--force-ipv4",
      "--rm-cache-dir",
      "--user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      "--no-mtime",
      // Add cookies if the file exists
      ...(COOKIE_PATH ? ["--cookies", COOKIE_PATH] : []),
    ];

    console.log("Running yt-dlp with args:", args.join(" "));
    const proc = spawn("yt-dlp", args);

    proc.stdout.on("data", (chunk) =>
      console.log(`[yt-dlp] ${chunk.toString().trim()}`)
    );
    proc.stderr.on("data", (chunk) =>
      console.error(`[yt-dlp ERROR] ${chunk.toString().trim()}`)
    );

    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`yt-dlp exited with code ${code}`));
      }

      if (fs.existsSync(expectedFinalPath)) {
        console.log("Download successful, found file:", expectedFinalPath);
        resolve(expectedFinalPath);
      } else {
        reject(
          new Error(
            "yt-dlp finished, but the expected output file was not found."
          )
        );
      }
    });
  });

  // STEP 2: Use ffmpeg to clip and re-encode
  await new Promise<void>((resolve, reject) => {
    const ffmpegArgs = [
      "-ss",
      start,
      "-i",
      downloadedFile,
      "-t",
      duration,
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-profile:v",
      "baseline",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-ac",
      "2",
      "-movflags",
      "+faststart",
      "-y",
      outputPath,
    ];

    console.log("Running ffmpeg with args:", ffmpegArgs.join(" "));
    const proc = spawn("ffmpeg", ffmpegArgs);

    proc.stderr.on("data", (chunk) =>
      console.error(`[ffmpeg] ${chunk.toString().trim()}`)
    );

    proc.on("close", (code) => {
      fs.unlink(downloadedFile, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });

      if (code !== 0) {
        return reject(new Error(`ffmpeg exited with code ${code}`));
      }
      if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
        return reject(
          new Error("ffmpeg finished, but the output file is missing or empty.")
        );
      }
      console.log("Clip created successfully:", outputPath);
      resolve();
    });
  });
}
