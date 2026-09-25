"use client";

import { useEffect, useRef, useState } from "react";

// Muted, looping, inline clip that only plays while on screen.
// Falls back to the poster image for prefers-reduced-motion and for
// Data Saver / 2G connections, so nobody pays for video they didn't ask for.
// Nothing is downloaded until the element is actually on screen
// (preload="none" + IntersectionObserver), so a clip hidden with
// md:hidden / hidden md:block never costs the other device any data.
// `src` is the MP4 (plays everywhere); a same-named .webm is offered
// first for browsers that support VP9.
export default function LoopVideo({
  src,
  poster,
  className = "",
  label,
  webm = true,
}: {
  src: string;
  poster: string;
  className?: string;
  label: string;
  webm?: boolean;
  /** @deprecated kept for call-site compatibility; loading is always on-view */
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [stillOnly, setStillOnly] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = !!conn && (conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType ?? ""));
    if (reduce || slow) {
      setStillOnly(true);
      return;
    }
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.readyState === 0) v.load();
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (stillOnly) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt={label} className={className} />;
  }

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      disablePictureInPicture
    >
      {webm && <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
