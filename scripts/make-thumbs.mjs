// Creates a 480px-wide "-480.webp" next to every photo used in cards,
// the camera roll and the story collage, so phones download a photo
// sized for their screen (see lib/img.ts). Re-run after adding photos:
//   node scripts/make-thumbs.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const DIRS = ["public/menu", "public/images/food", "public/images/story"];
let made = 0, saved = 0;
for (const dir of DIRS) {
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".webp") || f.endsWith("-480.webp")) continue;
    const src = path.join(dir, f);
    const out = path.join(dir, f.replace(/\.webp$/, "-480.webp"));
    const meta = await sharp(src).metadata();
    const img = sharp(src);
    if ((meta.width ?? 0) > 480) img.resize({ width: 480 });
    await img.webp({ quality: 70 }).toFile(out);
    saved += fs.statSync(src).size - fs.statSync(out).size;
    made++;
  }
}
console.log(`made ${made} thumbnails, ${Math.round(saved / 1024)} KB smaller in total`);
