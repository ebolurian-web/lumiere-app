"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Badge } from "@/components/ui/badge";

/* ---------- Demo data ---------- */

const GRADE_DISTRIBUTION = [
  { grade: "A", count: 24, pct: 28, color: "bg-success" },
  { grade: "A-", count: 18, pct: 21, color: "bg-success/70" },
  { grade: "B+", count: 15, pct: 17, color: "bg-info" },
  { grade: "B", count: 12, pct: 14, color: "bg-info/70" },
  { grade: "B-", count: 8, pct: 9, color: "bg-warning" },
  { grade: "C+", count: 5, pct: 6, color: "bg-warning/70" },
  { grade: "C", count: 3, pct: 3, color: "bg-danger/70" },
  { grade: "D/F", count: 2, pct: 2, color: "bg-danger" },
];

const ATTENDANCE_WEEKS = [
  { week: "W1", rate: 96 },
  { week: "W2", rate: 94 },
  { week: "W3", rate: 92 },
  { week: "W4", rate: 95 },
  { week: "W5", rate: 88 },
  { week: "W6", rate: 91 },
  { week: "W7", rate: 87 },
  { week: "W8", rate: 90 },
  { week: "W9", rate: 85 },
  { week: "W10", rate: 89 },
];

const AT_RISK = [
  { name: "Sofia Almeida", gpa: 2.45, reason: "Below 2.5 GPA threshold", risk: "high" },
  { name: "Raj Patel", gpa: 3.30, reason: "Missing 2 consecutive assignments", risk: "medium" },
  { name: "Lucas Park", gpa: 3.88, reason: "Attendance dropped below 85%", risk: "low" },
];

const ASSIGNMENT_COMPLETION = [
  { name: "HW 1", submitted: 26, total: 28 },
  { name: "HW 2", submitted: 25, total: 28 },
  { name: "HW 3", submitted: 24, total: 28 },
  { name: "HW 4", submitted: 22, total: 28 },
  { name: "Midterm", submitted: 28, total: 28 },
  { name: "Project", submitted: 23, total: 28 },
];

export default function AnalyticsPage() {
  const avgGpa = 3.42;
  const totalStudents = 87;
  const avgAttendance = Math.round(
    ATTENDANCE_WEEKS.reduce((s, w) => s + w.rate, 0) / ATTENDANCE_WEEKS.length
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl font-light text-navy dark:text-foreground tracking-tight">
          Course Analytics
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          DS 310 Machine Learning · Spring 2026
        </p>
      </BlurFade>

      {/* KPI Row */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: "Total Students", value: totalStudents },
            { label: "Class Avg GPA", value: avgGpa, dec: 2 },
            { label: "Avg Attendance", value: avgAttendance, suffix: "%" },
            { label: "At-Risk Students", value: AT_RISK.length },
          ].map(({ label, value, dec, suffix }) => (
            <Card key={label} className="card-hover-glow">
              <CardContent className="pt-5 pb-4">
                <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
                  {label}
                </p>
                <div className="flex items-baseline gap-0.5">
                  <NumberTicker
                    value={value}
                    decimalPlaces={dec || 0}
                    delay={0.3}
                    className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
                  />
                  {suffix && (
                    <span className="text-foreground/30 text-lg font-mono">{suffix}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </BlurFade>

      <div className="grid grid-cols-12 gap-5">
        {/* Grade Distribution — col-span-8 */}
        <BlurFade delay={0.2} inView className="col-span-12 lg:col-span-8">
          <Card className="card-hover-glow h-full">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-48 mb-4">
                {GRADE_DISTRIBUTION.map(({ grade, pct, color }) => (
                  <div key={grade} className="flex-1 flex flex-col items-center gap-2">
                    <span className="font-mono text-[10px] text-foreground/40">{pct}%</span>
                    <div className="w-full relative" style={{ height: `${(pct / 30) * 100}%` }}>
                      <div className={`absolute inset-0 ${color} rounded-t-md`} />
                    </div>
                    <span className="font-mono text-xs text-foreground/50">{grade}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-border/30">
                <span className="text-xs text-foreground/40">Class average:</span>
                <span className="font-mono text-sm font-semibold">{avgGpa.toFixed(2)}</span>
                <span className="text-xs text-foreground/40">·</span>
                <span className="text-xs text-foreground/40">Median: B+</span>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* At-Risk Students — col-span-4 */}
        <BlurFade delay={0.25} inView className="col-span-12 lg:col-span-4">
          <Card className="card-hover-glow h-full">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">
                At-Risk Students
                <span className="ml-2 font-mono text-xs font-normal text-danger">{AT_RISK.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {AT_RISK.map((s) => (
                <div
                  key={s.name}
                  className={`p-3.5 rounded-lg cursor-pointer transition-colors ${
                    s.risk === "high" ? "bg-danger/[0.04] hover:bg-danger/[0.07]" : "bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className={`font-mono text-sm font-bold ${
                      s.gpa < 2.5 ? "text-danger" : s.gpa < 3.0 ? "text-warning" : "text-info"
                    }`}>
                      {s.gpa.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      s.risk === "high" ? "bg-danger" : s.risk === "medium" ? "bg-warning" : "bg-info"
                    }`} />
                    <span className="text-xs text-foreground/40">{s.reason}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </BlurFade>

        {/* Attendance Trend — col-span-8 */}
        <BlurFade delay={0.3} inView className="col-span-12 lg:col-span-8">
          <Card className="card-hover-glow">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32 mb-4">
                {ATTENDANCE_WEEKS.map(({ week, rate }) => (
                  <div key={week} className="flex-1 flex flex-col items-center gap-1.5">
                    <div
                      className={`w-full rounded-t-sm transition-all ${
                        rate >= 90 ? "bg-success/60" : rate >= 85 ? "bg-warning/60" : "bg-danger/60"
                      }`}
                      style={{ height: `${((rate - 80) / 20) * 100}%` }}
                    />
                    <span className="font-mono text-[9px] text-foreground/30">{week}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-3 border-t border-border/30">
                <span className="text-xs text-foreground/40">Average:</span>
                <span className="font-mono text-sm font-semibold">{avgAttendance}%</span>
                <span className="text-xs text-foreground/40">·</span>
                <span className="text-xs text-foreground/40">
                  Trend: <span className="text-warning">declining</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Assignment Completion — col-span-4 */}
        <BlurFade delay={0.35} inView className="col-span-12 lg:col-span-4">
          <Card className="card-hover-glow">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">Submission Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ASSIGNMENT_COMPLETION.map(({ name, submitted, total }) => {
                const pct = Math.round((submitted / total) * 100);
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{name}</span>
                      <span className="font-mono text-xs text-foreground/35">
                        {submitted}/{total}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${pct}%`, opacity: 0.4 + (pct / 100) * 0.6 }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </BlurFade>
      </div>
    </div>
  );
}
