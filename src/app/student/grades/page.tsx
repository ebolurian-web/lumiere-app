"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";
import { Printer, Award, CalendarClock } from "lucide-react";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-info",
  green: "bg-success",
  purple: "bg-purple-600",
  amber: "bg-warning",
  pink: "bg-pink-600",
};

const GRADE_COLORS: Record<string, string> = {
  "A+": "text-success",
  A: "text-success",
  "A-": "text-success",
  "B+": "text-info",
  B: "text-info",
  "B-": "text-info",
  "C+": "text-warning",
  C: "text-warning",
  "C-": "text-warning",
  D: "text-danger",
  F: "text-danger",
};

interface Enrollment {
  grade: string;
  percentage: number;
  course: {
    code: string;
    title: string;
    credits: number;
    color: string;
    instructor_name: string;
  };
}

/* ---------- SVG circular progress ring ---------- */
function GpaRing({
  gpa,
  maxGpa = 4.0,
  size = 192,
  stroke = 10,
}: {
  gpa: number;
  maxGpa?: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = gpa / maxGpa;
  const offset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="w-48 h-48"
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
        className="text-navy dark:text-primary transition-all duration-1000"
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
        className="fill-foreground font-mono text-5xl font-bold"
        fontSize="48"
      >
        {gpa.toFixed(2)}
      </text>
      <text
        x="50%"
        y="64%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground/40 text-xs uppercase tracking-widest"
        fontSize="11"
      >
        Cumulative
      </text>
    </svg>
  );
}

export default function GradesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("enrollments")
        .select(
          "grade, percentage, courses(code, title, credits, color, instructor_name)"
        )
        .eq("user_id", MAYA_ID);
      if (data) {
        setEnrollments(
          data.map((e: any) => ({ ...e, course: e.courses }))
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  const totalCredits = enrollments.reduce(
    (s, e) => s + e.course.credits,
    0
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded-lg w-64 animate-pulse" />
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8 h-72 bg-muted rounded-xl animate-pulse" />
          <div className="col-span-4 space-y-5">
            <div className="h-[8.5rem] bg-muted rounded-xl animate-pulse" />
            <div className="h-[8.5rem] bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <BlurFade delay={0}>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-4xl font-light text-navy dark:text-foreground tracking-tight">
              Academic Performance
            </h1>
            <p className="text-foreground/40 text-sm mt-1">
              Spring Semester 2026 &middot; Undergraduate Year III
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="size-4" />
            Export Transcript
          </Button>
        </div>
      </BlurFade>

      {/* ── Hero GPA Section ── */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-12 gap-5">
          {/* Left: large GPA card */}
          <Card className="col-span-12 lg:col-span-8 card-hover-glow">
            <CardContent className="p-8 flex flex-col sm:flex-row items-center gap-8">
              {/* Ring */}
              <GpaRing gpa={3.68} />

              {/* Text block */}
              <div className="flex-1 space-y-5">
                <div>
                  <h2 className="font-display text-xl font-medium text-foreground tracking-tight">
                    Scholastic Standing
                  </h2>
                  <p className="text-foreground/45 text-sm mt-1 max-w-md leading-relaxed">
                    You are ranked in the top 15% of your cohort based on
                    cumulative grade-point average across all enrolled
                    semesters.
                  </p>
                </div>

                {/* Two metric tiles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-2">
                      Term GPA
                    </p>
                    <NumberTicker
                      value={3.72}
                      decimalPlaces={2}
                      delay={0.4}
                      className="text-3xl font-mono font-bold text-foreground"
                    />
                  </div>
                  <div className="rounded-lg border border-border/60 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-2">
                      Completed Credits
                    </p>
                    <div className="flex items-baseline gap-1">
                      <NumberTicker
                        value={66}
                        delay={0.6}
                        className="text-3xl font-mono font-bold text-foreground"
                      />
                      <span className="text-foreground/30 text-lg font-mono">
                        / 90
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: stacked cards */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
            {/* Dean's List card (dark) */}
            <Card className="card-hover-glow bg-navy text-white border-navy relative overflow-hidden flex-1">
              <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
                <div>
                  <Badge variant="secondary" className="mb-3 text-[10px]">
                    Honors
                  </Badge>
                  <h3 className="font-display text-lg font-medium tracking-tight">
                    Dean&apos;s List Eligible
                  </h3>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Progress</span>
                    <span className="font-mono">92%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/15">
                    <div
                      className="h-1.5 rounded-full bg-white/90 transition-all duration-700"
                      style={{ width: "92%" }}
                    />
                  </div>
                </div>
                {/* Watermark icon */}
                <Award className="absolute right-4 bottom-4 size-20 text-white/[0.06]" />
              </CardContent>
            </Card>

            {/* Next milestone card */}
            <Card className="card-hover-glow flex-1">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-2">
                    Next Milestone
                  </p>
                  <h3 className="font-display text-lg font-medium text-foreground tracking-tight">
                    Final Exams
                  </h3>
                  <p className="text-foreground/45 text-sm mt-1">
                    May 12, 2026
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 text-foreground/40">
                  <CalendarClock className="size-4" />
                  <span className="text-sm font-mono">14 days remaining</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </BlurFade>

      {/* ── Course Cards ── */}
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollments.map((e, idx) => (
            <BlurFade key={e.course.code} delay={0.25 + idx * 0.06}>
              <Card className="card-hover-glow h-64 flex flex-col">
                <CardContent className="p-6 flex flex-col justify-between flex-1">
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          COLOR_MAP[e.course.color] || "bg-muted-foreground"
                        }`}
                      />
                      <span className="font-mono text-sm font-medium text-foreground/60">
                        {e.course.code}
                      </span>
                    </div>
                    <span
                      className={`text-3xl font-mono font-bold ${
                        GRADE_COLORS[e.grade] || "text-foreground"
                      }`}
                    >
                      {e.grade}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg text-foreground mt-3 leading-snug">
                    {e.course.title}
                  </h3>

                  {/* Bottom: gauge + instructor */}
                  <div className="mt-auto space-y-3 pt-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-foreground/40">
                        <span>Score</span>
                        <span className="font-mono">
                          {e.percentage?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            COLOR_MAP[e.course.color] || "bg-foreground/30"
                          }`}
                          style={{ width: `${e.percentage}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-foreground/35">
                      {e.course.instructor_name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      </BlurFade>
    </div>
  );
}
