// One-off import of RollRicks brand + Zomato food photography from
// E:\Personal into web-sized WebP under public/. Re-runnable.
import sharp from "sharp";
import path from "node:path";

const P = "E:/Personal";
const Z = `${P}/Images/Zomato`;
const OUT = "E:/Roll/rollricks/public";

const food = [
  ["All mix.png", "menu/all-mix.webp"],
  ["chilli chicken.png", "menu/chilli-chicken.webp"],
  ["Fried Chicken.png", "menu/fried-chicken.webp"],
  ["chicken Hakka Noodles.png", "menu/chicken-hakka-noodles.webp"],
  ["chicken fried rice.png", "menu/chicken-fried-rice.webp"],
  ["chickken fried rice.png", "menu/chicken-all-mix.webp"],
  ["Malai Chicken Tikka.png", "menu/malai-chicken-tikka.webp"],
  ["Hakka Noodles.png", "menu/hakka-noodles.webp"],
  ["Manchurian Noodles.png", "menu/manchurian-noodles.webp"],
  ["Panner noodles.png", "menu/paneer-noodles.webp"],
  ["panner fried rice.png", "menu/paneer-fried-rice.webp"],
  ["Chilli panner.png", "menu/chilli-paneer-box.webp"],
  ["chilli mushroom.png", "menu/chilli-mushroom-box.webp"],
  ["malai soya chaap.png", "menu/malai-soya-chaap.webp"],
  ["panner tikka.png", "menu/paneer-tikka-skewers.webp"],
  ["Tandoor.png", "menu/tandoor.webp"],
  ["Achhhari roll.png", "menu/achari-roll.webp"],
  ["STudent Combo.png", "images/food/combo-roll-coffee.webp"],
  ["Date night combo.png", "images/food/combo-rolls-mojitos.webp"],
  ["chicken feast combo.png", "images/food/combo-chicken-feast.webp"],
];

for (const [src, dst] of food) {
  const info = await sharp(path.join(Z, src))
    .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(path.join(OUT, dst));
  console.log(dst, Math.round(info.size / 1024) + "KB");
}

// Brand seal (transparent PNG) → webp + png favicons
const seal = `${P}/cropped_circle_image.png`;
for (const size of [96, 256, 512]) {
  await sharp(seal).resize(size, size).webp({ quality: 88 }).toFile(`${OUT}/images/brand/seal-${size}.webp`);
}
await sharp(seal).resize(180, 180).png().toFile(`${OUT}/apple-touch-icon.png`);
await sharp(seal).resize(512, 512).png().toFile(`${OUT}/icon-512.png`);
await sharp(seal).resize(192, 192).png().toFile(`${OUT}/icon-192.png`);
await sharp(seal).resize(48, 48).png().toFile(`${OUT}/favicon.png`);

// Hero: the night-cart creative, cropped to the cart + food spread
// (the poster's own headline is cropped out; the site sets its own).
const hero = `${P}/1.png`; // 1024x1536
await sharp(hero).extract({ left: 0, top: 520, width: 1024, height: 720 })
  .webp({ quality: 74 }).toFile(`${OUT}/images/cart/hero-night.webp`);
await sharp(hero).extract({ left: 150, top: 520, width: 724, height: 690 })
  .resize({ width: 640 }).webp({ quality: 72 }).toFile(`${OUT}/images/cart/hero-night-mobile.webp`);

// Story collage: the four polaroids from the "Our Story" creative
const story = `${P}/2.png`; // 1055x1491
const s = 1055 / 778;
const crops = [
  ["first-cart", 30, 405, 322, 207],
  ["freshly-prepared", 380, 408, 364, 168],
  ["rolls-memories", 32, 670, 292, 112],
  ["happier-people", 354, 642, 286, 140],
];
for (const [name, x, y, w, h] of crops) {
  await sharp(story)
    .extract({ left: Math.round(x * s), top: Math.round(y * s), width: Math.round(w * s), height: Math.round(h * s) })
    .webp({ quality: 76 }).toFile(`${OUT}/images/story/${name}.webp`);
}

// Night food shots for the dark sections / camera roll
await sharp(`${P}/Roll.png`).resize(900).webp({ quality: 72 }).toFile(`${OUT}/images/food/roll-night.webp`);
await sharp(`${P}/image (3).png`).resize(900).webp({ quality: 72 }).toFile(`${OUT}/images/food/tikka-fire.webp`);

// Open Graph share image 1200x630 (JPEG — best WhatsApp support)
await sharp(hero).extract({ left: 0, top: 500, width: 1024, height: 538 }).resize(1200, 630)
  .jpeg({ quality: 78 }).toFile(`${OUT}/og.jpg`);
console.log("done");

// HD night food photography (dark, fire-lit) for "after dark" + Find Us
const night = [
  ["Chinese tandoor and mojito.png", "images/food/chinese-tandoor-mojito.webp", 1000, 62],
  ["Fried chicken.png", "images/food/fried-chicken-night.webp", 640, 70],
  ["Malai tikka HD.png", "images/food/malai-tikka-night.webp", 640, 70],
  ["ROll HD.png", "images/food/roll-hd-night.webp", 640, 70],
];
for (const [src, dst, width, quality] of night) {
  await sharp(`${P}/${src}`).resize({ width }).webp({ quality }).toFile(`${OUT}/${dst}`);
}
