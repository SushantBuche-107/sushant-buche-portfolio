import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const iconsDir = join(publicDir, "icons");

const initials = "SB";
const name = "Sushant Buche";
const role = "Full Stack .NET Developer";
const support = "Backend engineering · APIs · Data · Cloud";
const technologies = [".NET", "C#", "ASP.NET Core", "SQL Server", "React"];

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0B0F17"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.2" cy="0.05" r="0.7">
      <stop offset="0" stop-color="#6366F1" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#6366F1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.95" cy="0.9" r="0.6">
      <stop offset="0" stop-color="#06B6D4" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#06B6D4" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#94A3B8" stroke-opacity="0.07"/>
    </pattern>
    <linearGradient id="badge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6366F1"/>
      <stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glowA)"/>
  <rect width="1200" height="630" fill="url(#glowB)"/>
  <rect x="80" y="92" width="82" height="82" rx="22" fill="url(#badge)" fill-opacity="0.16" stroke="#818CF8" stroke-opacity="0.5"/>
  <text x="121" y="146" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700" fill="#C7D2FE">${initials}</text>
  <text x="184" y="130" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="600" letter-spacing="4" fill="#67E8F9">SOFTWARE ENGINEER</text>
  <text x="184" y="158" font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#7E889B">Chandrapur, Maharashtra, India</text>
  <text x="80" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="700" letter-spacing="-3" fill="#F8FAFC">${name}</text>
  <text x="82" y="356" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="500" fill="#A7B0C0">${role}</text>
  <text x="82" y="397" font-family="Segoe UI, Arial, sans-serif" font-size="19" fill="#7E889B">${support}</text>
  <g font-family="Segoe UI, Arial, sans-serif" font-size="16" fill="#C7D2FE">
    ${technologies
      .map((technology, index) => {
        const x = 82 + index * 158;
        return `<rect x="${x}" y="448" width="142" height="42" rx="21" fill="#151D2B" stroke="#94A3B8" stroke-opacity="0.22"/>
    <text x="${x + 71}" y="475" text-anchor="middle">${technology}</text>`;
      })
      .join("\n    ")}
  </g>
  <line x1="80" y1="540" x2="1120" y2="540" stroke="#94A3B8" stroke-opacity="0.18"/>
  <text x="80" y="578" font-family="Segoe UI, Arial, sans-serif" font-size="17" fill="#7E889B">Reliable applications, scalable APIs, and enterprise software.</text>
  <circle cx="1080" cy="570" r="6" fill="#34D399"/>
  <text x="1094" y="576" font-family="Segoe UI, Arial, sans-serif" font-size="15" fill="#A7B0C0">Portfolio</text>
</svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#111827"/>
      <stop offset="1" stop-color="#0B0F17"/>
    </linearGradient>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6366F1"/>
      <stop offset="1" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="116" fill="url(#bg)"/>
  <rect x="72" y="72" width="368" height="368" rx="88" fill="url(#mark)" fill-opacity="0.14" stroke="#818CF8" stroke-opacity="0.45" stroke-width="4"/>
  <text x="256" y="302" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="154" font-weight="700" letter-spacing="-6" fill="#E0E7FF">${initials}</text>
  <circle cx="378" cy="132" r="14" fill="#34D399"/>
</svg>`;

await mkdir(iconsDir, { recursive: true });

await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile(join(publicDir, "og-image.png"));

for (const size of [180, 192, 512]) {
  const name = size === 180 ? "apple-touch-icon.png" : `icon-${size}.png`;
  await sharp(Buffer.from(iconSvg))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(join(iconsDir, name));
}

await sharp(Buffer.from(iconSvg))
  .resize(32, 32)
  .png({ compressionLevel: 9 })
  .toFile(join(publicDir, "favicon-32.png"));

console.log("Generated og-image.png and icon assets.");
