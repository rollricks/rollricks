/* Compress all images in public/menu/ to web-friendly WebP.
   Original PNG/JPEG files are 1-3MB each; output ~80-150KB at 800w. */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "public", "menu");
const files = fs
  .readdirSync(dir)
  .filter((f) => /\.(png|jpg|jpeg)$/i.test(f));

(async () => {
  for (const file of files) {
    const src = path.join(dir, file);
    const name = path.parse(file).name;
    const out = path.join(dir, name + ".webp");
    const before = fs.statSync(src).size;
    await sharp(src)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out);
    const after = fs.statSync(out).size;
    console.log(
      `${file.padEnd(28)} ${(before / 1024).toFixed(0).padStart(5)}KB → ${name}.webp ${(after / 1024).toFixed(0).padStart(4)}KB`
    );
    // Remove the original PNG/JPEG so the bundle ships only webp.
    fs.unlinkSync(src);
  }
})();
