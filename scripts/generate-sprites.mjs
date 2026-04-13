import fs from "fs";
import path from "path";
import { PNG } from "pngjs";

const baseDir = "/root/ai_oche";
const charDir = path.join(baseDir, "assets", "characters");
const labDir = path.join(baseDir, "assets", "lab-characters");
const sheetDir = path.join(baseDir, "assets", "spritesheet");
const paletteDir = path.join(baseDir, "assets", "palettes");

fs.mkdirSync(charDir, { recursive: true });
fs.mkdirSync(labDir, { recursive: true });
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
const labCanvas = { width: 104, height: 144 };

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

function drawCircle(png, cx, cy, radius, color) {
  const [r, g, b, a] = hexToRgba(color);
  for (let y = cy - radius; y <= cy + radius; y += 1) {
    for (let x = cx - radius; x <= cx + radius; x += 1) {
      if (x < 0 || y < 0 || x >= png.width || y >= png.height) continue;
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= radius * radius) {
        const idx = (y * png.width + x) * 4;
        png.data[idx] = r;
        png.data[idx + 1] = g;
        png.data[idx + 2] = b;
        png.data[idx + 3] = a;
      }
    }
  }
}

function drawLabCharacter(role) {
  const png = new PNG({ width: labCanvas.width, height: labCanvas.height });
  png.data.fill(0);

  const skin = "#f7d8b6";
  const outline = "#2d2241";
  const white = "#f7f3ef";
  const shadow = "#eadfd6";

  drawRect(png, 28, 136, 48, 4, shadow);

  if (role.key === "cto") {
    drawRect(png, 35, 16, 36, 28, outline);
    drawRect(png, 37, 18, 32, 24, skin);
    drawRect(png, 33, 10, 40, 14, "#1f224d");
    drawRect(png, 31, 20, 10, 26, "#283472");
    drawRect(png, 65, 20, 10, 26, "#283472");
    drawRect(png, 27, 28, 14, 34, "#2f78d9");
    drawRect(png, 25, 38, 9, 4, "#111c46");
    drawRect(png, 37, 43, 11, 4, "#111c46");
    drawRect(png, 44, 28, 5, 18, outline);
    drawRect(png, 47, 28, 5, 18, outline);
    drawRect(png, 48, 29, 4, 16, outline);
    drawRect(png, 58, 30, 4, 16, outline);
    drawRect(png, 51, 49, 6, 4, "#ee9a84");
    drawRect(png, 37, 52, 32, 34, outline);
    drawRect(png, 39, 54, 28, 30, "#24346c");
    drawRect(png, 49, 54, 8, 30, white);
    drawRect(png, 35, 60, 12, 12, skin);
    drawRect(png, 30, 63, 6, 10, skin);
    drawRect(png, 26, 58, 6, 8, skin);
    drawRect(png, 69, 58, 10, 12, skin);
    drawRect(png, 76, 52, 18, 38, "#2f78d9");
    drawRect(png, 79, 56, 12, 28, "#ffffff40");
    drawRect(png, 41, 86, 10, 16, "#24346c");
    drawRect(png, 57, 86, 10, 16, "#24346c");
    drawRect(png, 39, 102, 12, 28, "#24346c");
    drawRect(png, 57, 102, 12, 28, "#24346c");
    drawRect(png, 37, 130, 16, 8, "#1a244f");
    drawRect(png, 57, 130, 16, 8, "#1a244f");
  } else if (role.key === "pm") {
    drawRect(png, 36, 18, 34, 27, outline);
    drawRect(png, 38, 20, 30, 23, skin);
    drawRect(png, 34, 12, 38, 13, "#6b4936");
    drawRect(png, 36, 24, 8, 12, "#7d5640");
    drawRect(png, 64, 22, 8, 28, "#6b4936");
    drawRect(png, 48, 29, 4, 15, outline);
    drawRect(png, 58, 30, 4, 15, outline);
    drawRect(png, 52, 48, 6, 4, "#ee9a84");
    drawRect(png, 39, 52, 28, 34, outline);
    drawRect(png, 41, 54, 24, 30, "#6d8e48");
    drawRect(png, 48, 54, 10, 10, "#d9efb0");
    drawRect(png, 45, 57, 4, 28, "#9b6a45");
    drawRect(png, 58, 56, 4, 28, "#9b6a45");
    drawRect(png, 28, 62, 16, 30, "#8e6142");
    drawRect(png, 31, 64, 10, 24, "#d3b08d");
    drawRect(png, 32, 67, 8, 4, "#6cad77");
    drawRect(png, 34, 75, 6, 4, "#f2a15c");
    drawRect(png, 29, 56, 10, 12, skin);
    drawRect(png, 69, 58, 10, 12, skin);
    drawRect(png, 74, 53, 18, 32, "#d7d9df");
    drawRect(png, 77, 56, 12, 24, "#ffffff40");
    drawRect(png, 42, 86, 10, 16, "#6d8e48");
    drawRect(png, 56, 86, 10, 16, "#6d8e48");
    drawRect(png, 40, 102, 12, 30, "#6d8e48");
    drawRect(png, 56, 102, 12, 30, "#6d8e48");
    drawRect(png, 38, 132, 16, 8, "#584130");
    drawRect(png, 56, 132, 16, 8, "#584130");
  } else if (role.key === "frontend") {
    drawRect(png, 37, 18, 34, 27, outline);
    drawRect(png, 39, 20, 30, 23, skin);
    drawRect(png, 35, 12, 38, 13, "#704a38");
    drawRect(png, 37, 24, 8, 9, "#5e3928");
    drawRect(png, 48, 29, 4, 15, outline);
    drawRect(png, 58, 29, 4, 15, outline);
    drawRect(png, 52, 48, 6, 4, "#ee9a84");
    drawRect(png, 26, 48, 20, 40, "#1fb6f2");
    drawRect(png, 62, 48, 20, 40, "#1fb6f2");
    drawRect(png, 39, 52, 30, 34, "#29b8f3");
    drawRect(png, 47, 54, 14, 8, "#dff8ff");
    drawRect(png, 49, 60, 3, 14, "#dff8ff");
    drawRect(png, 56, 60, 3, 14, "#dff8ff");
    drawRect(png, 29, 64, 10, 12, skin);
    drawRect(png, 22, 58, 13, 20, "#182a59");
    drawRect(png, 25, 61, 8, 13, skin);
    drawRect(png, 69, 59, 11, 13, skin);
    drawRect(png, 76, 52, 20, 33, "#17264d");
    drawRect(png, 79, 55, 14, 24, "#87e9ff");
    drawRect(png, 82, 58, 10, 3, "#ffffff70");
    drawRect(png, 81, 65, 3, 6, "#ff90ac");
    drawRect(png, 86, 65, 4, 6, "#ffd26f");
    drawRect(png, 91, 65, 3, 6, white);
    drawRect(png, 42, 86, 10, 16, "#2950a5");
    drawRect(png, 56, 86, 10, 16, "#2950a5");
    drawRect(png, 40, 102, 12, 30, "#2950a5");
    drawRect(png, 56, 102, 12, 30, "#2950a5");
    drawRect(png, 38, 132, 16, 8, "#4cbefe");
    drawRect(png, 56, 132, 16, 8, "#4cbefe");
  } else if (role.key === "backend") {
    drawRect(png, 35, 18, 34, 27, outline);
    drawRect(png, 37, 20, 30, 23, skin);
    drawRect(png, 33, 12, 38, 14, "#273055");
    drawRect(png, 35, 24, 10, 10, "#1d2443");
    drawRect(png, 44, 18, 20, 18, "#273055");
    drawRect(png, 44, 31, 7, 15, outline);
    drawRect(png, 56, 31, 7, 15, outline);
    drawRect(png, 51, 48, 6, 4, "#ee9a84");
    drawRect(png, 38, 52, 30, 34, "#145c7f");
    drawRect(png, 46, 55, 14, 8, "#6fd0db");
    drawRect(png, 27, 60, 10, 12, skin);
    drawRect(png, 21, 54, 13, 34, "#5a9865");
    drawRect(png, 24, 58, 7, 24, "#f0d06d");
    drawRect(png, 69, 59, 11, 13, skin);
    drawRect(png, 72, 54, 25, 34, "#243a67");
    drawRect(png, 75, 58, 19, 24, "#334c84");
    drawRect(png, 79, 60, 9, 3, "#ffffff60");
    drawRect(png, 42, 86, 10, 16, "#233a7a");
    drawRect(png, 56, 86, 10, 16, "#233a7a");
    drawRect(png, 40, 102, 12, 31, "#233a7a");
    drawRect(png, 56, 102, 12, 31, "#233a7a");
    drawRect(png, 38, 133, 16, 8, "#5fd0d1");
    drawRect(png, 56, 133, 16, 8, "#5fd0d1");
  } else if (role.key === "qa") {
    drawRect(png, 37, 18, 34, 27, outline);
    drawRect(png, 39, 20, 30, 23, skin);
    drawRect(png, 35, 12, 38, 12, "#7a49bf");
    drawRect(png, 35, 22, 9, 31, "#7a49bf");
    drawRect(png, 63, 22, 10, 32, "#9355dd");
    drawRect(png, 48, 29, 4, 15, outline);
    drawRect(png, 58, 29, 4, 15, outline);
    drawRect(png, 52, 48, 6, 4, "#da6a86");
    drawRect(png, 39, 52, 30, 35, "#b955d8");
    drawRect(png, 41, 60, 26, 4, "#d889f5");
    drawRect(png, 41, 69, 26, 4, "#d889f5");
    drawRect(png, 29, 58, 10, 12, skin);
    drawRect(png, 20, 51, 18, 36, white);
    drawRect(png, 23, 54, 10, 5, "#26376f");
    drawRect(png, 23, 64, 12, 3, "#ff8ea6");
    drawRect(png, 23, 70, 12, 3, "#71b0ff");
    drawRect(png, 23, 76, 9, 3, "#81cc7f");
    drawRect(png, 69, 58, 10, 12, skin);
    drawCircle(png, 88, 61, 10, "#9ac9ff");
    drawCircle(png, 88, 61, 6, "#dff7ff");
    drawRect(png, 79, 72, 12, 4, "#9ac9ff");
    drawRect(png, 42, 87, 10, 16, "#5d4f95");
    drawRect(png, 56, 87, 10, 16, "#5d4f95");
    drawRect(png, 40, 103, 12, 31, "#5d4f95");
    drawRect(png, 56, 103, 12, 31, "#5d4f95");
    drawRect(png, 38, 134, 16, 8, "#ff86c2");
    drawRect(png, 56, 134, 16, 8, "#ff86c2");
  } else if (role.key === "designer") {
    drawRect(png, 37, 18, 34, 27, outline);
    drawRect(png, 39, 20, 30, 23, skin);
    drawRect(png, 35, 12, 38, 12, "#f05f8e");
    drawRect(png, 36, 24, 10, 10, "#d84e79");
    drawRect(png, 64, 22, 12, 29, "#f05f8e");
    drawRect(png, 48, 29, 4, 15, outline);
    drawRect(png, 58, 29, 4, 15, outline);
    drawRect(png, 52, 48, 6, 4, "#da6a86");
    drawRect(png, 40, 52, 28, 34, "#ff7b8f");
    drawRect(png, 43, 60, 22, 4, "#ff9d7d");
    drawRect(png, 43, 69, 22, 4, "#ff9d7d");
    drawRect(png, 29, 59, 10, 12, skin);
    drawCircle(png, 24, 63, 12, "#f4c057");
    drawCircle(png, 24, 63, 8, "#fdf6ea");
    drawCircle(png, 18, 62, 3, "#ff986a");
    drawCircle(png, 25, 57, 3, "#7cd2ff");
    drawCircle(png, 29, 68, 3, "#83ca77");
    drawCircle(png, 17, 69, 3, "#ff7b8f");
    drawRect(png, 69, 59, 10, 12, skin);
    drawRect(png, 85, 53, 5, 28, "#414657");
    drawRect(png, 80, 50, 14, 12, "#414657");
    drawRect(png, 43, 86, 9, 16, "#ff7b8f");
    drawRect(png, 56, 86, 9, 16, "#ff7b8f");
    drawRect(png, 41, 102, 11, 30, "#ff7b8f");
    drawRect(png, 56, 102, 11, 30, "#ff7b8f");
    drawRect(png, 40, 132, 13, 8, "#6a4035");
    drawRect(png, 56, 132, 13, 8, "#6a4035");
  }

  return png;
}

const palettes = {};
const sprites = [];

roles.forEach((role) => {
  const { png, palette } = drawSprite(role);
  const outPath = path.join(charDir, `${role.key}.png`);
  fs.writeFileSync(outPath, PNG.sync.write(png));
  const labPng = drawLabCharacter(role);
  fs.writeFileSync(path.join(labDir, `${role.key}.png`), PNG.sync.write(labPng));
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
