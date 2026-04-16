"use client";

import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  numericValue?: number;
  decimalPlaces?: number;
  className?: string;
  ring?: { value: number; max: number };
}

function ProgressRing({ value, max }: { value: number; max: number }) {
  const percentage = (value / max) * 100;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg width="48" height="48" className="-rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted/60"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-gold transition-all duration-1000"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-medium text-foreground/60">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

export function StatCard({
  label,
  value,
  numericValue,
  decimalPlaces = 0,
  className,
  ring,
}: StatCardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-border/60 bg-card p-5",
      className
    )}>
      <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
        {label}
      </p>
      <div className="flex items-end justify-between">
        {numericValue !== undefined ? (
          <NumberTicker
            value={numericValue}
            decimalPlaces={decimalPlaces}
            delay={0.2}
            className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
          />
        ) : (
          <span className="text-[1.7rem] font-mono font-semibold text-foreground leading-none">
            {value}
          </span>
        )}
        {ring && <ProgressRing value={ring.value} max={ring.max} />}
      </div>
    </div>
  );
}
