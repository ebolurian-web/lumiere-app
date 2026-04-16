"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NumberTicker } from "@/components/ui/number-ticker";

const SCHEDULE_ITEMS = [
  { time: "10:00", title: "Machine Learning Foundations", room: "Turing Hall 204", code: "DS 310", color: "bg-info" },
  { time: "14:00", title: "Office Hours — Dr. Kim", room: "Turing Hall 206", color: "bg-gold" },
  { time: "16:30", title: "DS Study Group", room: "Library Room 3B", color: "bg-success" },
];

const FEED_ITEMS = [
  { text: "Neural Network Implementation due Apr 18", type: "assignment" },
  { text: "Dr. Kim sent you a message", type: "message" },
  { text: "Merit Scholarship renewed for Fall 2026", type: "document" },
  { text: "GLM Analysis Report due Apr 20", type: "assignment" },
  { text: "Grade posted: DS 425 Problem Set 7 — 46/50", type: "grade" },
];

const TYPE_COLORS: Record<string, string> = {
  assignment: "text-warning",
  message: "text-info",
  document: "text-success",
  grade: "text-gold",
};

export function HeroDashboard() {
  const [visibleFeed, setVisibleFeed] = useState<number[]>([0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setVisibleFeed((prev) => {
        if (prev.length >= FEED_ITEMS.length) return prev;
        return [...prev, prev.length];
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="h-[340px]" />;

  return (
    <div className="p-4 md:p-6 min-h-[340px]">
      {/* Top bar — greeting + date */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-display text-lg text-navy dark:text-foreground">Good afternoon, Maya</p>
          <p className="text-xs text-foreground/35">Wednesday, April 15, 2026</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-foreground/30 font-mono">Online</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Left — stats + schedule */}
        <div className="col-span-3 space-y-4">
          {/* Stat row */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: "ENROLLED", value: 4 },
              { label: "PENDING", value: 6 },
              { label: "GPA", value: 3.72, dec: 2 },
              { label: "DEGREE", value: 73, suffix: "%" },
            ].map(({ label, value, dec, suffix }) => (
              <div key={label} className="rounded-lg border border-border/40 bg-background/50 p-2.5">
                <p className="text-[8px] font-medium uppercase tracking-wider text-foreground/25 mb-1">{label}</p>
                <p className="font-mono text-sm font-semibold text-foreground leading-none">
                  <NumberTicker value={value} decimalPlaces={dec || 0} delay={0.5} className="text-sm font-mono font-semibold text-foreground" />
                  {suffix && <span className="text-foreground/40">{suffix}</span>}
                </p>
              </div>
            ))}
          </div>

          {/* Schedule */}
          <div className="rounded-lg border border-border/40 bg-background/50 p-3">
            <p className="text-[9px] font-medium uppercase tracking-wider text-foreground/25 mb-2">Today</p>
            <div className="space-y-1.5">
              {SCHEDULE_ITEMS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.2, duration: 0.4 }}
                  className="flex items-center gap-2 py-1"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color} flex-shrink-0`} />
                  <span className="font-mono text-[10px] text-foreground/30 w-10 flex-shrink-0">{item.time}</span>
                  <span className="text-[11px] text-foreground/70 truncate">{item.title}</span>
                  <span className="text-[9px] text-foreground/20 ml-auto flex-shrink-0">{item.room}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — live feed */}
        <div className="col-span-2">
          <div className="rounded-lg border border-border/40 bg-background/50 p-3 h-full">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-[livePulse_2s_ease-out_infinite]" />
              <p className="text-[9px] font-medium uppercase tracking-wider text-foreground/25">Activity</p>
            </div>
            <div className="space-y-1.5 overflow-hidden">
              <AnimatePresence>
                {visibleFeed.map((idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex items-start gap-2 py-1"
                  >
                    <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                      TYPE_COLORS[FEED_ITEMS[idx].type] === "text-warning" ? "bg-warning" :
                      TYPE_COLORS[FEED_ITEMS[idx].type] === "text-info" ? "bg-info" :
                      TYPE_COLORS[FEED_ITEMS[idx].type] === "text-success" ? "bg-success" :
                      "bg-gold"
                    }`} />
                    <p className="text-[10px] text-foreground/50 leading-tight">
                      {FEED_ITEMS[idx].text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
