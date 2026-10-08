/**
 * Generates binary PNG assets with zero dependencies (zlib + manual chunks):
 *  - public/images/sprites/wave-sprite.png  → EFFECT-31 stop-motion sheet, 12 frames @120×80
 *  - public/images/icons/icon-{192,512}.png, icon-maskable-512.png, apple-touch-icon.png
 * Run: npm run icons
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ── tiny PNG encoder ─────────────────────────────────────────────────────── */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0; // filter none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ── colour helpers ───────────────────────────────────────────────────────── */
const PRIMARY = [10, 168, 167, 255];
const DEEP = [8, 78, 77, 255];
const LIGHT = [237, 246, 245, 255];

function blend(bg, fg, t) {
  return [
    Math.round(bg[0] + (fg[0] - bg[0]) * t),
    Math.round(bg[1] + (fg[1] - bg[1]) * t),
    Math.round(bg[2] + (fg[2] - bg[2]) * t),
    255,
  ];
}

/* ── EFFECT-31 sprite sheet: 12 frames of a pulsing voice waveform ────────── */
const FRAME_W = 120;
const FRAME_H = 80;
const FRAMES = 12;
const sheet = Buffer.alloc(FRAME_W * FRAMES * FRAME_H * 4);

for (let f = 0; f < FRAMES; f += 1) {
  const phase = (f / FRAMES) * Math.PI * 2;
  for (let y = 0; y < FRAME_H; y += 1) {
    for (let x = 0; x < FRAME_W; x += 1) {
      const barIndex = Math.floor(x / 10); // 12 bars
      const inBar = x % 10 < 6;
      const amp =
        (Math.sin(phase + barIndex * 0.9) * 0.5 + 0.5) * 26 +
        (Math.sin(phase * 2 + barIndex * 1.7) * 0.5 + 0.5) * 8 +
        4;
      const dy = Math.abs(y - FRAME_H / 2);
      let col = [255, 255, 255, 255];
      if (inBar && dy <= amp) col = dy > amp - 3 ? PRIMARY : DEEP;
      const idx = (y * FRAME_W * FRAMES + f * FRAME_W + x) * 4;
      sheet[idx] = col[0];
      sheet[idx + 1] = col[1];
      sheet[idx + 2] = col[2];
      sheet[idx + 3] = col[3];
    }
  }
}
mkdirSync(join(root, "public/images/sprites"), { recursive: true });
writeFileSync(
  join(root, "public/images/sprites/wave-sprite.png"),
  encodePng(FRAME_W * FRAMES, FRAME_H, sheet)
);

/* ── PWA icons: rounded teal tile + three white speech bars ───────────────── */
function makeIcon(size, maskable = false) {
  const px = Buffer.alloc(size * size * 4);
  const corner = maskable ? 0 : size * 0.22;
  const barW = size * 0.12;
  const gap = size * 0.09;
  const heights = [0.34, 0.62, 0.46];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      // rounded-rect mask
      let inside = true;
      if (!maskable) {
        const cx = Math.min(Math.max(x, corner), size - 1 - corner);
        const cy = Math.min(Math.max(y, corner), size - 1 - corner);
        inside = (x - cx) ** 2 + (y - cy) ** 2 <= corner * corner;
      }
      let col = [0, 0, 0, 0];
      if (inside) {
        col = blend(LIGHT, PRIMARY, maskable ? 1 : 0.92);
        // three white speech bars
        const totalW = barW * 3 + gap * 2;
        const startX = (size - totalW) / 2;
        for (let b = 0; b < 3; b += 1) {
          const bx = startX + b * (barW + gap);
          const bh = size * heights[b];
          const by0 = (size - bh) / 2;
          if (x >= bx && x < bx + barW && y >= by0 && y < by0 + bh) col = [255, 255, 255, 255];
        }
      }
      const idx = (y * size + x) * 4;
      px[idx] = col[0];
      px[idx + 1] = col[1];
      px[idx + 2] = col[2];
      px[idx + 3] = col[3];
    }
  }
  return encodePng(size, size, px);
}

mkdirSync(join(root, "public/images/icons"), { recursive: true });
writeFileSync(join(root, "public/images/icons/icon-192.png"), makeIcon(192));
writeFileSync(join(root, "public/images/icons/icon-512.png"), makeIcon(512));
writeFileSync(join(root, "public/images/icons/icon-maskable-512.png"), makeIcon(512, true));
writeFileSync(join(root, "public/images/icons/apple-touch-icon.png"), makeIcon(180));

console.log("PNG assets written: sprite + 4 icons");
