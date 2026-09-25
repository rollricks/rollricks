// The circular "RR · Sealed with Taste" seal from the RollRicks logo.
export default function Seal({ size = 40, className = "" }: { size?: number; className?: string }) {
  const src = size <= 96 ? "/images/brand/seal-96.webp" : size <= 256 ? "/images/brand/seal-256.webp" : "/images/brand/seal-512.webp";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="RollRicks — Sealed with Taste"
      width={size}
      height={size}
      className={`rounded-full select-none ${className}`}
      draggable={false}
    />
  );
}
