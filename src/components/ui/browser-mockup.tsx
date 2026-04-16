"use client";

import { cn } from "@/lib/utils";

interface BrowserMockupProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

export function BrowserMockup({
  url = "app.lumiere.edu",
  children,
  className,
}: BrowserMockupProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-card overflow-hidden shadow-lg dark:shadow-2xl",
        className
      )}
    >
      {/* Chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/30">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-background/60 border border-border/30 text-[11px] text-foreground/35 font-mono">
            <svg
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              className="text-success"
            >
              <path
                d="M8 1a5 5 0 0 0-5 5v1H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V6a5 5 0 0 0-5-5z"
                fill="currentColor"
                opacity="0.5"
              />
            </svg>
            {url}
          </div>
        </div>
        <div className="w-14" />
      </div>
      {/* Content */}
      <div className="bg-background">{children}</div>
    </div>
  );
}
