const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

let isFfmpegAvailable = null;

function checkFfmpeg() {
  if (isFfmpegAvailable !== null) return Promise.resolve(isFfmpegAvailable);
  return new Promise((resolve) => {
    exec("ffmpeg -version", (error) => {
      isFfmpegAvailable = !error;
      resolve(isFfmpegAvailable);
    });
  });
}

/**
 * Get watermarked video path for download.
 * Generates an official WUDAO brand badge and stamps it onto the video using FFmpeg.
 * Caches the result in storage/watermarked/ for 0ms subsequent downloads.
 */
async function getWatermarkedVideo({ videoId, relativeVideoPath, userName }) {
  const cleanUser = (userName || "creator").replace(/[@\s]/g, "");
  const storageDir = path.join(__dirname, "../storage");
  const watermarkedDir = path.join(storageDir, "watermarked");

  if (!fs.existsSync(watermarkedDir)) {
    fs.mkdirSync(watermarkedDir, { recursive: true });
  }

  const cachedFile = path.join(watermarkedDir, `WUDAO_${cleanUser}_${videoId}.mp4`);
  if (fs.existsSync(cachedFile)) {
    return cachedFile;
  }

  let inputPath = path.join(__dirname, "..", relativeVideoPath);
  if (!fs.existsSync(inputPath)) {
    inputPath = path.join(storageDir, relativeVideoPath);
  }
  if (!fs.existsSync(inputPath)) {
    return null;
  }

  const hasFfmpeg = await checkFfmpeg();
  if (!hasFfmpeg) {
    return inputPath;
  }

  // Create official WUDAO watermark SVG overlay badge
  const watermarkSvgPath = path.join(watermarkedDir, `watermark_badge_${videoId}.svg`);

  const badgeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="70" viewBox="0 0 300 70">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF3CAC"/>
      <stop offset="50%" stop-color="#784BA0"/>
      <stop offset="100%" stop-color="#2B86C5"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="296" height="66" rx="33" fill="#0c0e14" fill-opacity="0.82" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
  <g transform="translate(14, 15) scale(1.2)">
    <rect width="32" height="32" rx="7" fill="#12131a"/>
    <path d="M5 8 L11 24 L16 13 L21 24 L27 8" stroke="url(#g)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>
  <text x="66" y="32" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-weight="900" font-size="18" fill="#ffffff" letter-spacing="1.5">WUDAO</text>
  <text x="66" y="52" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-weight="600" font-size="13" fill="#ff7043">@${cleanUser}</text>
</svg>`.trim();

  fs.writeFileSync(watermarkSvgPath, badgeSvg, "utf8");

  return new Promise((resolve) => {
    // Stamp the badge at bottom-right (W-w-24:H-h-36) with high quality and fast encoding
    const cmd = `ffmpeg -y -i "${inputPath}" -i "${watermarkSvgPath}" -filter_complex "[0:v][1:v]overlay=W-w-24:H-h-36:format=auto" -c:v libx264 -preset fast -crf 23 -c:a copy "${cachedFile}"`;
    exec(cmd, (err) => {
      try {
        fs.unlinkSync(watermarkSvgPath);
      } catch (_) {}
      if (err) {
        console.error("FFmpeg video watermarking error:", err);
        return resolve(inputPath);
      }
      resolve(cachedFile);
    });
  });
}

module.exports = {
  getWatermarkedVideo,
  checkFfmpeg,
};
