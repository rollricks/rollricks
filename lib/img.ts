// Responsive photo helper. Every .webp in /menu, /images/food and
// /images/story has a 480px "-480.webp" sibling (scripts/make-thumbs.mjs),
// so the browser can pick the smaller file on phones.
const THUMB_DIRS = /^\/(menu|images\/food|images\/story)\/[^/]+\.webp$/;

export function srcSetFor(src: string | undefined): string | undefined {
  if (!src || !THUMB_DIRS.test(src) || src.endsWith("-480.webp")) return undefined;
  return `${src.replace(/\.webp$/, "-480.webp")} 480w, ${src} 800w`;
}
