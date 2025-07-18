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

    console.log("Using cookies file:", COOKIE_PATH || "None");

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

      // --- CHANGES START HERE ---

      // 1. Force IPv4. Sometimes helps bypass stricter IPv6 checks on servers.
      "--force-ipv4",

      // 2. Clear cache directory. This prevents issues with stale session data.
      "--rm-cache-dir",

      // 3. Add a standard User-Agent. This makes the request look like it's from a real browser.
      "--user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      
      // 4. Don't set the file modification time from the server response.
      "--no-mtime",

      // --- CHANGES END HERE ---

      // only add cookies if present
      ...(COOKIE_PATH ? ["--cookies", COOKIE_PATH] : []),
      // verbose helps debug
      "--verbose",
    ];

    console.log("Running yt-dlp with args:", args.join(" "));
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
        // --- IMPROVED ERROR HANDLING ---
        if (stderr.includes("Sign in to confirm you’re not a bot")) {
            return reject(new Error(
                "YouTube is blocking the download (bot detection). " +
                "This is common on servers and with proxies. " +
                "The cookies.txt file may be invalid, expired, or not matching the server's IP address. " +
                "Please try generating a fresh cookies.txt file and redeploying."
            ));
        }
        if (stderr.includes("Video unavailable")) {
             return reject(new Error("The requested video is unavailable. It may be private, deleted, or region-locked."));
        }
        // Generic fallback error for other issues
        return reject(
          new Error(`yt-dlp exited with code ${code}. Full error: ${stderr}`)
        );
      }
      
      // The rest of your logic for finding the file remains the same.
      const m = stdout.match(/\[Merger\] Merging formats into "([^"]+)"/m) || stdout.match(/\[download\] Destination: (.+)/m);
      if (m && m[1]) {
        const finalPath = m[1];
        if (fs.existsSync(finalPath)) {
            console.log("Successfully found downloaded file at:", finalPath);
            return resolve(finalPath);
        }
      }
      
      // Fallback search if the primary parsing fails
      const base = path.basename(outputBase);
      const found = fs.readdirSync(uploadsDir).find((f) => f.startsWith(base) && f.endsWith('.mp4'));
      if (found) {
        console.log("Found file via fallback search:", found);
        return resolve(path.join(uploadsDir, found));
      }

      reject(new Error("yt-dlp seemed to succeed but the output file could not be found."));
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
