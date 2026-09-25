/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — produces an `out/` folder you can drop on any
  // dumb file host (Hostinger shared hosting, S3, GitHub Pages, etc).
  // No Node.js server required at runtime.
  output: "export",

  // Run the dev server in its own folder so a production build (which
  // must use the default .next → out/) can run at the same time without
  // breaking it:  NEXT_DIST_DIR=.next-dev npm run dev
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // Hostinger / Apache serves /menu/index.html when the URL is /menu/
  // (with trailing slash). Without this, hard-loads to /menu would 404.
  trailingSlash: true,

  images: {
    // Next.js Image Optimization needs a Node.js runtime; static export
    // can't do it. Use the raw <img> behavior instead.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
