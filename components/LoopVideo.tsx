"use client";

import { useEffect, useRef, useState } from "react";

// Muted, looping, inline clip that only plays while on screen.
// Falls back to the poster image for prefers-reduced-motion and for
// Data Saver / 2G connections, so nobody pays for video they didn't ask for.
export default function LoopVideo({
  src,
  poster,
  className = "",
  label,
  eager = false,
}: {
  src: string;
  poster: string;
  className?: string;
  label: string;
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
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
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
      preload={eager ? "auto" : "none"}
      aria-label={label}
      disablePictureInPicture
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
