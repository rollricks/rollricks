"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

// Section reveal: short fade + rise when scrolled into view, once.
// MotionConfig reducedMotion="user" (LayoutShell) drops the movement
// for visitors who prefer reduced motion.
export default function Reveal({
  delay = 0,
  y = 24,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
