"use client";

import { useEffect, useRef, useState } from "react";

// Muted, looping, inline clip that only plays while on screen.
//
// Loading is deliberately lazy so video never slows the page down:
//  • nothing is fetched until the element is (nearly) on screen —
//    clips hidden with md:hidden / hidden md:block never cost data;
//  • the video itself only starts downloading after the page's own
//    load event, so it never competes with HTML, CSS, JS and images;
//  • the poster is fetched early only for `priority` clips (the hero);
//  • prefers-reduced-motion and Data Saver / 2G get the poster only.
// `src` is the MP4 (plays everywhere); a same-named .webm is offered
// first for browsers that support VP9.
export default function LoopVideo({
  src,
  poster,
  className = "",
  label,
  webm = true,
  priority = false,
}: {
  src: string;
  poster: string;
  className?: string;
  label: string;
  webm?: boolean;
  /** Above-the-fold clip: show its poster immediately. */
  priority?: boolean;
  /** @deprecated kept for call-site compatibility */
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [stillOnly, setStillOnly] = useState(false);
  const [near, setNear] = useState(priority); // poster requested
  const [go, setGo] = useState(false); // video sources attached

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slow = !!conn && (conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType ?? ""));
    if (reduce || slow) setStillOnly(true);
  }, []);

  // Poster: request it once the clip is within ~1.5 screens.
  useEffect(() => {
    if (near || stillOnly) return;
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "150% 0px" });
    io.observe(v);
    return () => io.disconnect();
  }, [near, stillOnly]);

  // Video: attach sources only when visible AND the page has loaded.
  useEffect(() => {
    if (stillOnly) return;
    const v = ref.current;
    if (!v) return;
    let visible = false;
    let loaded = document.readyState === "complete";
    const start = () => {
      if (visible && loaded) setGo(true);
    };
    const onLoad = () => {
      // small pause so first paint / hydration finish first
      setTimeout(() => {
        loaded = true;
        start();
      }, 400);
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) {
          start();
          if (!v.paused || v.readyState > 0) v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.15 }
    );
    io.observe(v);
    return () => {
      io.disconnect();
      window.removeEventListener("load", onLoad);
    };
  }, [stillOnly]);

  useEffect(() => {
    if (!go) return;
    const v = ref.current;
    if (!v) return;
    v.load();
    v.play().catch(() => {});
  }, [go]);

  if (stillOnly) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt={label} loading={priority ? "eager" : "lazy"} className={className} />;
  }

  return (
    <video
      ref={ref}
      className={className}
      poster={near ? poster : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      disablePictureInPicture
    >
      {go && webm && <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />}
      {go && <source src={src} type="video/mp4" />}
    </video>
  );
}
