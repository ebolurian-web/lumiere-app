"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";
import { CheckCircle2 } from "lucide-react";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

interface DegreeReq {
  category: string;
  credits_required: number;
  credits_completed: number;
}

/* ---------- Semester roadmap data ---------- */
const SEMESTERS = [
  { label: "Fall 2024", status: "completed" as const },
  { label: "Spring 2025", status: "completed" as const },
  { label: "Fall 2025", status: "completed" as const },
  { label: "Spring 2026", status: "current" as const, note: "(current)" },
  { label: "Fall 2026", status: "future" as const },
  { label: "Spring 2027", status: "future" as const, note: "(projected)" },
];

/* ---------- SVG circular progress ring ---------- */
function ProgressRing({
  percent,
  size = 128,
  stroke = 8,
}: {
  percent: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="flex-shrink-0"
    >
      {/* track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-muted/40"
        strokeWidth={stroke}
      />
      {/* progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-primary transition-all duration-1000"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* center text */}
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground font-mono text-4xl font-bold"
        fontSize="36"
      >
        {percent}%
      </text>
      <text
        x="50%"
        y="64%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground/40 text-xs uppercase tracking-widest"
        fontSize="10"
      >
        complete
      </text>
    </svg>
  );
}

export default function ProgressPage() {
  const [reqs, setReqs] = useState<DegreeReq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("degree_requirements")
        .select("category, credits_required, credits_completed")
        .eq("user_id", MAYA_ID);
      if (data) setReqs(data);
      setLoading(false);
    }
    load();
  }, []);

  const totalRequired = reqs.reduce((s, r) => s + r.credits_required, 0);
  const totalCompleted = reqs.reduce((s, r) => s + r.credits_completed, 0);
  const overallPct = totalRequired
    ? Math.round((totalCompleted / totalRequired) * 100)
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-10 bg-muted rounded-lg w-64 animate-pulse" />
          <div className="h-4 bg-muted rounded w-52 mt-2 animate-pulse" />
        </div>
        <div className="h-52 bg-muted rounded-xl animate-pulse" />
        <div className="h-20 bg-muted rounded-xl animate-pulse" />
        <div className="h-12 bg-muted rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <BlurFade delay={0}>
        <h1 className="font-display text-4xl font-light text-navy dark:text-foreground tracking-tight">
          Degree Progress
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          B.S. Data Science &middot; Junior Standing
        </p>
      </BlurFade>

      {/* ── Hero card: overall progress ── */}
      <BlurFade delay={0.1}>
        <Card className="card-hover-glow">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* SVG progress ring */}
              <ProgressRing percent={overallPct} />

              {/* Text block */}
              <div className="flex-1 space-y-5">
                <div>
                  <h2 className="font-display text-xl font-medium text-foreground tracking-tight">
                    Overall Degree Completion
                  </h2>
                  <p className="text-foreground/45 text-sm mt-1 max-w-md leading-relaxed">
                    You have completed{" "}
                    <span className="font-mono font-medium text-foreground">
                      {totalCompleted}
                    </span>{" "}
                    of{" "}
                    <span className="font-mono font-medium text-foreground">
                      {totalRequired}
                    </span>{" "}
                    required credits. On track to graduate Spring 2027.
                  </p>
                </div>

                {/* Metric tiles */}
                <div className="flex items-center gap-4">
                  <div className="rounded-lg border border-border/60 p-4 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-2">
                      Credits Earned
                    </p>
                    <NumberTicker
                      value={totalCompleted}
                      delay={0.3}
                      className="text-3xl font-mono font-bold text-foreground"
                    />
                  </div>
                  <div className="rounded-lg border border-border/60 p-4 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-2">
                      Remaining
                    </p>
                    <NumberTicker
                      value={totalRequired - totalCompleted}
                      delay={0.5}
                      className="text-3xl font-mono font-bold text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* ── Semester roadmap ── */}
      <BlurFade delay={0.2}>
        <Card className="card-hover-glow">
          <CardContent className="px-8 py-6">
            <h3 className="font-display text-sm font-medium uppercase tracking-widest text-foreground/30 mb-6">
              Semester Roadmap
            </h3>
            <div className="relative flex items-center justify-between">
              {/* Connecting line */}
              <div className="absolute top-3 left-0 right-0 h-px bg-border/60" />

              {SEMESTERS.map((sem, i) => (
                <div
                  key={sem.label}
                  className="relative flex flex-col items-center z-10"
                >
                  {/* Dot */}
                  {sem.status === "completed" ? (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                  ) : sem.status === "current" ? (
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                      {/* Pulse ring */}
                      <div className="absolute inset-0 w-8 h-8 rounded-full bg-primary/30 animate-ping" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-border/60 bg-card" />
                  )}

                  {/* Label */}
                  <p
                    className={`mt-3 text-xs text-center whitespace-nowrap ${
                      sem.status === "current"
                        ? "font-medium text-primary"
                        : sem.status === "completed"
                        ? "text-foreground/50"
                        : "text-foreground/30"
                    }`}
                  >
                    {sem.label}
                  </p>
                  {sem.note && (
                    <p className="text-[10px] text-foreground/25 font-mono">
                      {sem.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* ── On Track banner ── */}
      <BlurFade delay={0.25}>
        <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-success/5 px-5 py-3.5">
          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
          <p className="text-sm text-success font-medium">
            On track to graduate: Spring 2027
          </p>
        </div>
      </BlurFade>

      {/* ── Category cards (2-col grid) ── */}
      <BlurFade delay={0.3}>
        <h3 className="font-display text-sm font-medium uppercase tracking-widest text-foreground/30 mb-4">
          Requirement Categories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reqs.map((req, i) => {
            const pct = Math.round(
              (req.credits_completed / req.credits_required) * 100
            );
            return (
              <BlurFade key={req.category} delay={0.35 + i * 0.06} inView>
                <Card className="card-hover-glow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">{req.category}</p>
                        <p className="font-mono text-xs text-foreground/30 mt-0.5">
                          {req.credits_completed} / {req.credits_required}{" "}
                          credits
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold text-primary">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-1000"
                        style={{
                          width: `${pct}%`,
                          opacity: 0.4 + (pct / 100) * 0.6,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            );
          })}
        </div>
      </BlurFade>
    </div>
  );
}
