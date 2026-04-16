"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";

const MONTHLY_DATA = [
  { month: "Sep", revenue: 180000 },
  { month: "Oct", revenue: 195000 },
  { month: "Nov", revenue: 210000 },
  { month: "Dec", revenue: 165000 },
  { month: "Jan", revenue: 220000 },
  { month: "Feb", revenue: 205000 },
  { month: "Mar", revenue: 215000 },
  { month: "Apr", revenue: 190000 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
  { month: "Jul", revenue: 0 },
  { month: "Aug", revenue: 0 },
];

const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue));

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

const TUITION_BREAKDOWN = [
  { program: "Computer Science", amount: "$620,000", pct: "34%" },
  { program: "Business Administration", amount: "$450,000", pct: "25%" },
  { program: "Data Science", amount: "$380,000", pct: "21%" },
  { program: "Liberal Arts", amount: "$350,000", pct: "20%" },
];

const COLLECTION_METRICS = [
  { label: "Current semester rate", value: "94.2%" },
  { label: "30-day delinquent", value: "3.8%" },
  { label: "60-day delinquent", value: "1.4%" },
  { label: "Payment plans active", value: "67" },
];

export default function FinancePage() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl font-light text-navy dark:text-foreground tracking-tight">
          Financial Overview
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          Fiscal Year 2025-2026
        </p>
      </BlurFade>

      {/* KPI cards */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="card-hover-glow">
            <CardContent className="p-6">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
                Revenue YTD
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-[1.7rem] font-mono font-semibold text-foreground leading-none">
                  $
                </span>
                <NumberTicker
                  value={2.1}
                  decimalPlaces={1}
                  delay={0.2}
                  className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
                />
                <span className="text-[1.7rem] font-mono font-semibold text-foreground/30 leading-none">
                  M
                </span>
              </div>
              <p className="text-xs text-success mt-2 font-medium">
                +12.3% vs prior year
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover-glow">
            <CardContent className="p-6">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
                Tuition Collected
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-[1.7rem] font-mono font-semibold text-foreground leading-none">
                  $
                </span>
                <NumberTicker
                  value={1.8}
                  decimalPlaces={1}
                  delay={0.3}
                  className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
                />
                <span className="text-[1.7rem] font-mono font-semibold text-foreground/30 leading-none">
                  M
                </span>
              </div>
              <p className="text-xs text-foreground/35 mt-2">
                86% collection rate
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover-glow">
            <CardContent className="p-6">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
                Outstanding Balance
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-[1.7rem] font-mono font-semibold text-foreground leading-none">
                  $
                </span>
                <NumberTicker
                  value={340}
                  delay={0.4}
                  className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
                />
                <span className="text-[1.7rem] font-mono font-semibold text-foreground/30 leading-none">
                  K
                </span>
              </div>
              <p className="text-xs text-warning mt-2 font-medium">
                42 accounts pending
              </p>
            </CardContent>
          </Card>
        </div>
      </BlurFade>

      {/* Monthly Revenue Bar Chart */}
      <BlurFade delay={0.2}>
        <Card className="card-hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-52">
              {MONTHLY_DATA.map((d, i) => {
                const pct =
                  d.revenue > 0
                    ? Math.max((d.revenue / maxRevenue) * 100, 4)
                    : 0;
                const isHovered = hoveredBar === i;
                const isFuture = d.revenue === 0;

                return (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center justify-end h-full relative"
                    onMouseEnter={() => !isFuture && setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Value label on hover */}
                    {isHovered && d.revenue > 0 && (
                      <div className="absolute -top-1 font-mono text-[10px] text-foreground/70 font-medium whitespace-nowrap">
                        {formatCurrency(d.revenue)}
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      className={`w-full rounded-t transition-all duration-500 ${
                        isFuture
                          ? "bg-muted/20 border border-dashed border-border/30"
                          : isHovered
                            ? "bg-primary"
                            : "bg-primary/70"
                      }`}
                      style={{
                        height: isFuture ? "8%" : `${pct}%`,
                      }}
                    />

                    {/* Month label */}
                    <span
                      className={`font-mono text-[10px] mt-2 ${
                        isFuture ? "text-foreground/20" : "text-foreground/40"
                      }`}
                    >
                      {d.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Revenue Breakdown */}
      <BlurFade delay={0.3}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="card-hover-glow">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">
                Tuition by Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {TUITION_BREAKDOWN.map(({ program, amount, pct }) => (
                <div
                  key={program}
                  className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
                >
                  <span className="text-sm text-foreground/50">{program}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-foreground/30">
                      {pct}
                    </span>
                    <span className="font-mono text-sm font-medium">
                      {amount}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-hover-glow">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">
                Collection Rate Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {COLLECTION_METRICS.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
                >
                  <span className="text-sm text-foreground/50">{label}</span>
                  <span className="font-mono text-sm font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </BlurFade>
    </div>
  );
}
