// src/services/videoService.ts
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export async function downloadSection(
  url: string,
  start: string,
  end: string,
  outputBase: string,
  uploadsDir: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const sectionArg = `*${start}-${end}`;
    const template = `${outputBase}.%(ext)s`;

    const COOKIE_PATH = fs.existsSync("./cookies.txt") ? "./cookies.txt" : "";

    console.log("Cookie path here", COOKIE_PATH);
    const args = [
      url,
      "-f",
      "bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/best",
      "--download-sections",
      sectionArg,
      "--merge-output-format",
      "mp4",
      "--recode-video",
      "mp4",
      "-o",
      template,
      "--no-check-certificates",
      "--no-warnings",
      // only add cookies if present
      ...(COOKIE_PATH ? ["--cookies", COOKIE_PATH] : []),
      // verbose helps debug
      "--verbose",
    ];

    console.log("args Log here", args);
    const proc = spawn("yt-dlp", args);
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk) => {
      const str = chunk.toString();
      stdout += str;
      console.log(`[yt-dlp] ${str.trim()}`);
    });
    proc.stderr.on("data", (chunk) => {
      const str = chunk.toString();
      stderr += str;
      console.error(`[yt-dlp ERROR] ${str.trim()}`);
    });
    proc.on("error", (err) =>
      reject(new Error(`yt-dlp spawn failed: ${err.message}`))
    );
    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(`yt-dlp exited ${code}
${stderr}`)
        );
      }
      // parse the Destination line
      const m = stdout.match(/\[download\] Destination: (.+)$/m);
      if (m && fs.existsSync(m[1])) {
        return resolve(m[1]);
      }
      // fallback: search uploadsDir
      const base = path.basename(outputBase);
      const found = fs.readdirSync(uploadsDir).find((f) => f.startsWith(base));
      if (found) return resolve(path.join(uploadsDir, found));
      reject(new Error("yt-dlp succeeded but no output file found."));
    });
  });
}

/**
 * Uses ffmpeg to re-encode (frame-accurate) the downloaded segment.
 */

export async function clipWithFfmpeg(
  inputPath: string,
  start: string,
  duration: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    let stderrAll = "";

    // Since inputPath is already the desired section (downloadSection used),
    // just remux with faststart to ensure proper headers and include audio.
    const args = [
      // source file
      "-i",
      inputPath,
      // video: re-encode to H.264 baseline
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-profile:v",
      "baseline",
      "-pix_fmt",
      "yuv420p",
      // audio: re-encode to AAC
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-ac",
      "2",
      // Web optimization
      "-movflags",
      "+faststart",
      // overwrite
      "-y",
      outputPath,
    ];

    console.log("Running ffmpeg remux with args:", args.join(" "));
    const proc = spawn("ffmpeg", args);
    proc.stderr.on("data", (chunk) => {
      stderrAll += chunk.toString();
      console.error(chunk.toString());
    });
    proc.on("error", (err) =>
      reject(new Error(`ffmpeg failed: ${err.message}`))
    );

    proc.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`ffmpeg exited ${code}\nstderr: ${stderrAll}`));
      }
      if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
        return reject(
          new Error(`Output file not found or empty. stderr: ${stderrAll}`)
        );
      }
      console.log("Clip remuxed successfully:", outputPath);
      resolve();
    });
  });
}
