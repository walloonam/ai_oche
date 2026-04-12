import fs from "fs";
import path from "path";
import { PNG } from "pngjs";

const baseDir = "/root/ai_oche";
const charDir = path.join(baseDir, "assets", "characters");
const sheetDir = path.join(baseDir, "assets", "spritesheet");
const paletteDir = path.join(baseDir, "assets", "palettes");

fs.mkdirSync(charDir, { recursive: true });
fs.mkdirSync(sheetDir, { recursive: true });
fs.mkdirSync(paletteDir, { recursive: true });

const roles = [
  {
    key: "cto",
    label: "CTO / Coordinator",
    primary: "#2b375e",
    accent: "#f1b867",
    prop: "tablet",
  },
  {
    key: "pm",
    label: "Planner / PM",
    primary: "#6e8a59",
    accent: "#f29c6b",
    prop: "notebook",
  },
  {
    key: "frontend",
    label: "Frontend Engineer",
    primary: "#59b6e3",
    accent: "#f6c453",
    prop: "ui",
  },
  {
    key: "backend",
    label: "Backend Engineer",
    primary: "#3b4f7a",
    accent: "#53d1c5",
    prop: "server",
  },
  {
    key: "qa",
    label: "QA Engineer",
    primary: "#8b78a7",
    accent: "#f05c5c",
    prop: "magnifier",
  },
  {
    key: "designer",
    label: "Designer",
    primary: "#f0a3b0",
    accent: "#f5c06d",
    prop: "palette",
  },
];

const paletteBase = {
  outline: "#2a1c16",
  skin: "#f6d1a9",
  hair: "#7a5645",
  hairShadow: "#5c4034",
  shirtShadow: "#d9b58d",
  white: "#f9f4ef",
};

const canvas = 64;

function hexToRgba(hex) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return [r, g, b, 255];
}

function drawRect(png, x, y, w, h, color) {
  const [r, g, b, a] = hexToRgba(color);
  for (let iy = y; iy < y + h; iy += 1) {
    for (let ix = x; ix < x + w; ix += 1) {
      const idx = (iy * png.width + ix) * 4;
      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }
}

function drawSprite(role) {
  const png = new PNG({ width: canvas, height: canvas });
  png.data.fill(0);

  const palette = {
    ...paletteBase,
    primary: role.primary,
    accent: role.accent,
  };

  // Head base
  drawRect(png, 20, 6, 24, 24, palette.outline);
  drawRect(png, 21, 7, 22, 22, palette.skin);

  // Hair
  drawRect(png, 19, 4, 26, 12, palette.hair);
  drawRect(png, 18, 14, 8, 10, palette.hairShadow);
  drawRect(png, 38, 14, 8, 10, palette.hairShadow);

  // Eyes + mouth
  drawRect(png, 26, 16, 3, 6, palette.outline);
  drawRect(png, 35, 16, 3, 6, palette.outline);
  drawRect(png, 30, 25, 4, 2, palette.accent);

  // Body
  drawRect(png, 22, 30, 20, 18, palette.outline);
  drawRect(png, 23, 31, 18, 16, palette.primary);
  drawRect(png, 24, 32, 16, 4, palette.accent);
  drawRect(png, 24, 40, 16, 6, palette.shirtShadow);

  // Arms
  drawRect(png, 17, 32, 4, 12, palette.outline);
  drawRect(png, 18, 33, 2, 10, palette.skin);
  drawRect(png, 43, 32, 4, 12, palette.outline);
  drawRect(png, 44, 33, 2, 10, palette.skin);

  // Legs
  drawRect(png, 25, 48, 6, 10, palette.outline);
  drawRect(png, 26, 49, 4, 8, palette.primary);
  drawRect(png, 33, 48, 6, 10, palette.outline);
  drawRect(png, 34, 49, 4, 8, palette.primary);
  drawRect(png, 25, 58, 6, 3, palette.outline);
  drawRect(png, 33, 58, 6, 3, palette.outline);

  // Role-specific props
  if (role.prop === "tablet") {
    drawRect(png, 40, 34, 8, 6, palette.outline);
    drawRect(png, 41, 35, 6, 4, palette.white);
  } else if (role.prop === "notebook") {
    drawRect(png, 16, 34, 8, 6, palette.outline);
    drawRect(png, 17, 35, 6, 4, palette.white);
  } else if (role.prop === "ui") {
    drawRect(png, 40, 28, 10, 8, palette.outline);
    drawRect(png, 41, 29, 8, 6, palette.accent);
  } else if (role.prop === "server") {
    drawRect(png, 40, 36, 8, 8, palette.outline);
    drawRect(png, 41, 37, 6, 6, palette.accent);
  } else if (role.prop === "magnifier") {
    drawRect(png, 42, 34, 6, 6, palette.outline);
    drawRect(png, 44, 40, 2, 6, palette.outline);
  } else if (role.prop === "palette") {
    drawRect(png, 42, 34, 6, 6, palette.outline);
    drawRect(png, 43, 35, 4, 4, palette.accent);
  }

  return { png, palette };
}

const palettes = {};
const sprites = [];

roles.forEach((role) => {
  const { png, palette } = drawSprite(role);
  const outPath = path.join(charDir, `${role.key}.png`);
  fs.writeFileSync(outPath, PNG.sync.write(png));
  palettes[role.key] = palette;
  sprites.push(png);
});

const sheet = new PNG({ width: 64 * 3, height: 64 * 2 });
sheet.data.fill(0);

sprites.forEach((sprite, index) => {
  const col = index % 3;
  const row = Math.floor(index / 3);
  for (let y = 0; y < 64; y += 1) {
    for (let x = 0; x < 64; x += 1) {
      const srcIdx = (y * 64 + x) * 4;
      const destX = col * 64 + x;
      const destY = row * 64 + y;
      const dstIdx = (destY * sheet.width + destX) * 4;
      sheet.data[dstIdx] = sprite.data[srcIdx];
      sheet.data[dstIdx + 1] = sprite.data[srcIdx + 1];
      sheet.data[dstIdx + 2] = sprite.data[srcIdx + 2];
      sheet.data[dstIdx + 3] = sprite.data[srcIdx + 3];
    }
  }
});

fs.writeFileSync(path.join(sheetDir, "agents-sheet.png"), PNG.sync.write(sheet));
fs.writeFileSync(
  path.join(paletteDir, "palettes.json"),
  JSON.stringify(palettes, null, 2),
  "utf8",
);

roles.forEach((role) => {
  const palettePath = path.join(paletteDir, `${role.key}.json`);
  fs.writeFileSync(palettePath, JSON.stringify(palettes[role.key], null, 2), "utf8");
});

console.log("Sprites generated.");
