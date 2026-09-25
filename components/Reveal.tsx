import type { HTMLAttributes } from "react";

// Section reveal with zero JavaScript: content is always rendered and
// visible; browsers that support CSS scroll-driven animations fade it
// in as it enters the viewport (see .reveal in globals.css). `delay`
// and `y` are accepted for backwards compatibility and ignored.
export default function Reveal({
  className = "",
  children,
  delay,
  y,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { delay?: number; y?: number; [k: `data-${string}`]: string | undefined }) {
  return (
    <div className={`reveal ${className}`} {...rest}>
      {children}
    </div>
  );
}
