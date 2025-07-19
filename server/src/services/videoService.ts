import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Creates a video clip in a memory-efficient way for constrained environments.
 * 1. Downloads ONLY the required small section of the video without re-encoding.
 * 2. Re-encodes that small section just ONCE with ffmpeg.
 * @param url The YouTube video URL.
 * @param start The start time of the clip (e.g., "00:01:23").
 * @param duration The duration of the clip in seconds (e.g., "10").
 * @param outputPath The final path for the clipped and re-encoded video.
 */
export async function createClip(
  url: string,
  start: string,
  duration: string,
  outputPath: string
): Promise<void> {
  const tempDir = os.tmpdir();
  const tempFileBase = path.join(tempDir, `temp-clip-${Date.now()}`);
  
  // --- STEP 1: Download ONLY the required section (Low Memory Usage) ---
  const downloadedSection = await new Promise<string>((resolve, reject) => {
    const outputTemplate = `${tempFileBase}.%(ext)s`;
    const expectedFinalPath = `${tempFileBase}.mp4`;
    // yt-dlp needs start and end time for sections. We need to parse start time and add duration.
    const startTimeInSeconds = start.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
    const endTimeInSeconds = startTimeInSeconds + parseFloat(duration);
    const sectionArg = `*${start}-${endTimeInSeconds}`;

    const COOKIE_PATH = fs.existsSync("./cookies.txt") ? "./cookies.txt" : "";

    const args = [
      url,
      "-f", "bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/best[ext=mp4]/best",
      // CRITICAL: Download only the small section.
      "--download-sections", sectionArg,
      // CRITICAL: DO NOT re-encode here. Just merge the original streams.
      "--merge-output-format", "mp4",
      "-o", outputTemplate,
      "--force-ipv4",
      "--no-warnings",
      // Add user-agent to mimic a real browser request
      "--user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      ...(COOKIE_PATH ? ["--cookies", COOKIE_PATH] : []),
    ];

    console.log("Running yt-dlp to download section:", args.join(" "));
    const proc = spawn("yt-dlp", args);
    let stderr = "";
    proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    proc.stdout.on("data", (chunk) => console.log(chunk.toString()));

    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`yt-dlp exited with code ${code}. Stderr: ${stderr}`));
      }
      if (fs.existsSync(expectedFinalPath)) {
        resolve(expectedFinalPath);
      } else {
        reject(new Error("yt-dlp finished, but the section file was not found."));
      }
    });
  });

  // --- STEP 2: Re-encode the small, downloaded section ONCE (Fast & Low Memory) ---
  await new Promise<void>((resolve, reject) => {
    const ffmpegArgs = [
      "-i", downloadedSection,
      // No -ss or -t needed, as we already have the exact clip.
      "-c:v", "libx264",
      "-preset", "fast",
      "-profile:v", "baseline",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "128k",
      "-ac", "2",
      "-movflags", "+faststart",
      "-y",
      outputPath,
    ];

    console.log("Running ffmpeg to re-encode section:", ffmpegArgs.join(" "));
    const proc = spawn("ffmpeg", ffmpegArgs);
    let stderr = "";
    proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    proc.on("close", (code) => {
      // Clean up the temporary section file
      fs.unlink(downloadedSection, (err) => {
        if (err) console.error("Failed to delete temp section file:", err);
      });
      
      if (code !== 0) {
        return reject(new Error(`ffmpeg exited with code ${code}. Stderr: ${stderr}`));
      }
      if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
        return reject(new Error("ffmpeg finished, but the output file is missing or empty."));
      }
      resolve();
    });
  });
}
