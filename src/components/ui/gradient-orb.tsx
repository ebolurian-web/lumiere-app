"use client";

import { cn } from "@/lib/utils";

interface GradientOrbProps {
  className?: string;
  color?: string;
  size?: number;
}

export function GradientOrb({
  className,
  color = "rgba(184,148,31,0.15)",
  size = 400,
}: GradientOrbProps) {
  return (
    <div
      className={cn(
        "absolute rounded-full pointer-events-none animate-[ambientFloat_20s_ease-in-out_infinite]",
        className
      )}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(60px)",
      }}
    />
  );
}
