
import { ChildProcess, spawn } from "child_process";
import fs from "fs";
import path from "path";

interface DownloadOptions {
  useProxy?: boolean;
  proxyUrl?: string;
  userAgent?: string;
  maxRetries?: number;
  skipUnavailable?: boolean;
  format?: string;
  timeout?: number;
}

interface VideoInfo {
  available: boolean;
  error?: string;
  title?: string;
  duration?: string;
}

export class YtDlpDownloader {
  private defaultOptions: DownloadOptions = {
    useProxy: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    maxRetries: 3,
    skipUnavailable: true,
    format: 'bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    timeout: 10 * 60 * 1000 // 10 minutes
  };

  constructor(private uploadsDir: string) {
    this.ensureUploadsDir();
  }

  private ensureUploadsDir(): void {
    const resolvedDir = path.resolve(this.uploadsDir);
    try {
      if (!fs.existsSync(resolvedDir)) {
        fs.mkdirSync(resolvedDir, { recursive: true });
        console.log(`Created uploads directory: ${resolvedDir}`);
      }
    } catch (error) {
      throw new Error(`Cannot create uploads directory: ${(error as Error).message}`);
    }
  }

  async downloadSection(
    url: string,
    start: string,
    end: string,
    outputBase: string,
    options: DownloadOptions = {}
  ): Promise<string> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    for (let attempt = 1; attempt <= mergedOptions.maxRetries!; attempt++) {
      try {
        console.log(`Download attempt ${attempt}/${mergedOptions.maxRetries} for ${url}`);
        
        return await this.attemptDownload(url, start, end, outputBase, {
          ...mergedOptions,
          // Toggle proxy on retry to try different approaches
          useProxy: attempt > 1 ? !mergedOptions.useProxy : mergedOptions.useProxy,
        });
      } catch (error) {
        const errorMessage = (error as Error).message;
        console.error(`Attempt ${attempt} failed:`, errorMessage);
        
        // Don't retry for certain permanent errors
        if (this.isPermanentError(errorMessage)) {
          throw error;
        }
        
        if (attempt === mergedOptions.maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await this.sleep(delay);
      }
    }
    
    throw new Error('All download attempts failed');
  }

  private async attemptDownload(
    url: string,
    start: string,
    end: string,
    outputBase: string,
    options: DownloadOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const resolvedUploadsDir = path.resolve(this.uploadsDir);
      const sectionArg = `*${start}-${end}`;
      const template = path.join(resolvedUploadsDir, `${outputBase}.%(ext)s`);
      
      // Check for cookies file
      const cookiePath = this.findCookiesFile();
      console.log(`Cookies file: ${cookiePath || 'Not found'}`);

      const args = this.buildArgs(url, sectionArg, template, cookiePath, options);
      console.log('yt-dlp command:', 'yt-dlp', args.join(' '));

      const proc: ChildProcess = spawn('yt-dlp', args, {
        cwd: resolvedUploadsDir,
        env: this.buildEnvironment(options)
      });

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (chunk: Buffer) => {
        const str = chunk.toString();
        stdout += str;
        console.log(`[yt-dlp] ${str.trim()}`);
      });

      proc.stderr?.on('data', (chunk: Buffer) => {
        const str = chunk.toString();
        stderr += str;
        console.error(`[yt-dlp ERROR] ${str.trim()}`);
      });

      proc.on('error', (err: Error) => {
        reject(new Error(`yt-dlp spawn failed: ${err.message}`));
      });

      proc.on('close', (code: number | null) => {
        console.log(`yt-dlp process exited with code: ${code}`);
        
        if (code !== 0) {
          const errorMessage = this.parseYtDlpError(stderr, stdout);
          return reject(new Error(errorMessage));
        }

        try {
          const outputPath = this.findOutputFile(stdout, resolvedUploadsDir, outputBase);
          resolve(outputPath);
        } catch (error) {
          reject(error);
        }
      });

      // Set timeout
      const timeout = setTimeout(() => {
        proc.kill('SIGTERM');
        reject(new Error(`Download timed out after ${options.timeout! / 1000} seconds`));
      }, options.timeout);

      proc.on('close', () => clearTimeout(timeout));
    });
  }

  private findCookiesFile(): string | null {
    const possiblePaths = [
      './cookies.txt',
      path.join(process.cwd(), 'cookies.txt'),
      path.join(__dirname, 'cookies.txt'),
      path.join(__dirname, '..', 'cookies.txt'),
      path.join(__dirname, '../..', 'cookies.txt')
    ];

    for (const cookiePath of possiblePaths) {
      const resolvedPath = path.resolve(cookiePath);
      if (fs.existsSync(resolvedPath)) {
        return resolvedPath;
      }
    }

    return null;
  }

  private buildArgs(
    url: string,
    sectionArg: string,
    template: string,
    cookiePath: string | null,
    options: DownloadOptions
  ): string[] {
    return [
      url,
      '-f', options.format!,
      '--download-sections', sectionArg,
      '--merge-output-format', 'mp4',
      '--recode-video', 'mp4',
      '-o', template,
      '--no-check-certificates',
      '--no-warnings',
      '--no-playlist',
      '--user-agent', options.userAgent!,
      // Geo-bypass options
      '--geo-bypass',
      '--geo-bypass-country', 'US',
      // Network options
      '--socket-timeout', '30',
      '--retries', '3',
      '--fragment-retries', '3',
      // Handle restrictions
      '--age-limit', '99',
      // Error handling
      ...(options.skipUnavailable ? ['--ignore-errors'] : []),
      // Cookies
      ...(cookiePath ? ['--cookies', cookiePath] : []),
      // Proxy
      ...(options.useProxy && options.proxyUrl ? ['--proxy', options.proxyUrl] : []),
      // Debug
      '--verbose'
    ];
  }

  private buildEnvironment(options: DownloadOptions): NodeJS.ProcessEnv {
    const env = { ...process.env };

    // Clear proxy environment variables if not using proxy
    if (!options.useProxy) {
      delete env.HTTP_PROXY;
      delete env.HTTPS_PROXY;
      delete env.http_proxy;
      delete env.https_proxy;
    }

    // Ensure PATH includes common locations for yt-dlp
    const additionalPaths = ['/usr/local/bin', '/usr/bin', '/bin'];
    const currentPath = env.PATH || '';
    const newPaths = additionalPaths.filter(p => !currentPath.includes(p));
    if (newPaths.length > 0) {
      env.PATH = `${currentPath}:${newPaths.join(':')}`;
    }

    return env;
  }

  private isPermanentError(errorMessage: string): boolean {
    const permanentErrors = [
      'Video is private',
      'Video unavailable',
      'Video blocked due to copyright',
      'yt-dlp not found',
      'yt-dlp spawn failed'
    ];

    return permanentErrors.some(error => errorMessage.includes(error));
  }

  private parseYtDlpError(stderr: string, stdout: string): string {
    const combinedOutput = stderr + stdout;
    
    if (combinedOutput.includes('Video unavailable')) {
      if (combinedOutput.includes('Private video') || combinedOutput.includes('This video is private')) {
        return 'Video is private and cannot be downloaded';
      }
      if (combinedOutput.includes('age-restricted') || combinedOutput.includes('Sign in to confirm your age')) {
        return 'Video is age-restricted. Update cookies or use different account';
      }
      if (combinedOutput.includes('not available in your country') || combinedOutput.includes('geo-blocked')) {
        return 'Video is geo-blocked in your region. Try using VPN or proxy';
      }
      if (combinedOutput.includes('copyright')) {
        return 'Video blocked due to copyright restrictions';
      }
      return 'Video unavailable - may be deleted, private, or restricted';
    }
    
    if (combinedOutput.includes('HTTP Error 429')) {
      return 'Rate limited by YouTube. Wait and try again';
    }
    
    if (combinedOutput.includes('Sign in to confirm you\'re not a bot')) {
      return 'YouTube blocking requests. Update cookies or change IP';
    }
    
    if (combinedOutput.includes('Requested format is not available')) {
      return 'Requested video format/quality not available';
    }
    
    const errorLines = stderr.split('\n').filter(line => 
      line.includes('ERROR:') && !line.includes('[debug]')
    );
    
    return errorLines.length > 0 
      ? `yt-dlp failed: ${errorLines.join('; ')}`
      : 'yt-dlp failed with unknown error';
  }

  private findOutputFile(stdout: string, uploadsDir: string, outputBase: string): string {
    const methods: (() => string | null)[] = [
      // Method 1: Parse destination
      () => {
        const match = stdout.match(/\[download\] Destination: (.+?)$/m);
        return match ? match[1].trim() : null;
      },
      
      // Method 2: Parse merger output
      () => {
        const match = stdout.match(/\[Merger\] Merging formats into "(.+?)"$/m);
        return match ? match[1].trim() : null;
      },
      
      // Method 3: Search directory for matching files
      () => {
        const baseFileName = path.basename(outputBase);
        const files = fs.readdirSync(uploadsDir);
        const matchingFile = files.find(f => 
          f.startsWith(baseFileName) && /\.(mp4|webm|mkv)$/i.test(f)
        );
        return matchingFile ? path.join(uploadsDir, matchingFile) : null;
      },
      
      // Method 4: Most recent video file
      () => {
        const files = fs.readdirSync(uploadsDir);
        const videoFiles = files.filter(f => /\.(mp4|webm|mkv)$/i.test(f));
        
        if (videoFiles.length === 0) return null;
        
        const mostRecent = videoFiles
          .map(f => ({
            path: path.join(uploadsDir, f),
            mtime: fs.statSync(path.join(uploadsDir, f)).mtime
          }))
          .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())[0];
          
        return mostRecent.path;
      }
    ];

    for (const method of methods) {
      try {
        const filePath = method();
        if (filePath && fs.existsSync(filePath)) {
          console.log('Found output file:', filePath);
          return filePath;
        }
      } catch (error) {
        console.warn('Error in file finding method:', (error as Error).message);
      }
    }

    throw new Error('Download completed but output file not found');
  }

  async checkVideoAvailability(url: string): Promise<VideoInfo> {
    return new Promise((resolve) => {
      const proc = spawn('yt-dlp', [
        url,
        '--no-download',
        '--print', 'title,duration',
        '--no-warnings',
        '--geo-bypass',
        '--geo-bypass-country', 'US'
      ]);

      let stdout = '';
      let stderr = '';

      proc.stdout?.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });

      proc.stderr?.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });

      proc.on('close', (code: number | null) => {
        if (code === 0) {
          const lines = stdout.trim().split('\n');
          resolve({
            available: true,
            title: lines[0] || 'Unknown',
            duration: lines[1] || 'Unknown'
          });
        } else {
          resolve({
            available: false,
            error: this.parseYtDlpError(stderr, stdout)
          });
        }
      });

      proc.on('error', () => {
        resolve({
          available: false,
          error: 'yt-dlp not available'
        });
      });
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Legacy function to maintain compatibility with your existing code
export async function downloadSection(
  url: string,
  start: string,
  end: string,
  outputBase: string,
  uploadsDir: string
): Promise<string> {
  const downloader = new YtDlpDownloader(uploadsDir);
  return await downloader.downloadSection(url, start, end, outputBase);
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
