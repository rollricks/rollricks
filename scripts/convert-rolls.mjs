import sharp from "sharp";
import path from "node:path";

const SRC = "E:/Personal/Images/Zomato";
const OUT = "E:/Roll/rollricks/public/menu";

const map = [
  ["Veg roll.png", "veg-roll.webp"],
  ["Panner Kathi Roll.png", "paneer-khati-roll.webp"],
  ["Panner kathiii juicy.png", "paneer-tikka-roll.webp"],
  ["soya chaap roll.png", "soya-chaap-roll.webp"],
  ["Cheese bread roll.png", "cheese-bread-roll.webp"],
  ["egg roll.png", "egg-roll.webp"],
  ["Chicken ROll.png", "chicken-roll.webp"],
  ["Double egg chicken Roll.png", "double-egg-chicken-roll.webp"],
  ["chicken bread roll.png", "chicken-bread-roll.webp"],
];

for (const [src, dst] of map) {
  const info = await sharp(path.join(SRC, src))
    .resize({ width: 600, height: 600, fit: "cover", position: "centre" })
    .webp({ quality: 72 })
    .toFile(path.join(OUT, dst));
  console.log(`${dst.padEnd(28)} ${(info.size / 1024).toFixed(0)} KB  ${info.width}x${info.height}`);
}
