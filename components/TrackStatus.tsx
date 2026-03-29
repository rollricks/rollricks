"use client";

import { motion } from "framer-motion";

interface TrackStatusProps {
  status: "new" | "confirmed" | "preparing" | "ready" | "done";
}

const steps: { key: string; label: string; icon: string }[] = [
  { key: "new", label: "Received", icon: "📩" },
  { key: "confirmed", label: "Confirmed", icon: "✅" },
  { key: "preparing", label: "Preparing", icon: "🔥" },
  { key: "ready", label: "Ready", icon: "🛎️" },
  { key: "done", label: "Done", icon: "🎉" },
];

const statusOrder = ["new", "confirmed", "preparing", "ready", "done"];

export default function TrackStatus({ status }: TrackStatusProps) {
  const currentIdx = statusOrder.indexOf(status);

  return (
    <div className="w-full">
      {/* Desktop / horizontal */}
      <div className="flex items-start justify-between gap-1">
        {steps.map((step, idx) => {
          const isActive = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.35 }}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Connector line (before each step except first) */}
              {idx > 0 && (
                <div className="absolute top-5 -left-1/2 w-full h-0.5 -z-10">
                  <div
                    className={`h-full transition-colors duration-500 ${
                      idx <= currentIdx ? "bg-[#FFD600]" : "bg-[#27272a]"
                    }`}
                  />
                </div>
              )}

              {/* Icon circle */}
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-colors duration-500 ${
                  isActive
                    ? "border-[#FFD600] bg-[#FFD600]/10"
                    : "border-[#27272a] bg-[#111]"
                }`}
              >
                {step.icon}
                {/* Pulse ring on current step */}
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full border-2 border-[#FFD600] animate-ping opacity-30" />
                )}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-[11px] font-medium text-center leading-tight transition-colors duration-500 ${
                  isActive ? "text-[#FFD600]" : "text-[#71717a]"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
