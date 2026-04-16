"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";

const MONTHLY_DATA = [
  { month: "Sep", revenue: 380000 },
  { month: "Oct", revenue: 345000 },
  { month: "Nov", revenue: 310000 },
  { month: "Dec", revenue: 290000 },
  { month: "Jan", revenue: 420000 },
  { month: "Feb", revenue: 395000 },
  { month: "Mar", revenue: 410000 },
  { month: "Apr", revenue: 185000 },
];

const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue));

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export default function FinancePage() {
  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          Financial Overview
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          Academic year 2025-2026
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
                Outstanding
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

      {/* Monthly revenue chart */}
      <BlurFade delay={0.2}>
        <Card className="card-hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MONTHLY_DATA.map((d) => {
                const pct = Math.round((d.revenue / maxRevenue) * 100);
                return (
                  <div key={d.month} className="flex items-center gap-4">
                    <span className="font-mono text-xs text-foreground/40 w-8">
                      {d.month}
                    </span>
                    <div className="flex-1 h-6 rounded bg-muted/30 overflow-hidden">
                      <div
                        className="h-full rounded bg-primary/70 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-foreground/50 w-16 text-right">
                      {formatCurrency(d.revenue)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Bottom stats */}
      <BlurFade delay={0.3}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="card-hover-glow">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Tuition & Fees", value: "$1,800,000", pct: "86%" },
                { label: "Housing & Dining", value: "$180,000", pct: "8%" },
                { label: "Lab & Material Fees", value: "$72,000", pct: "3%" },
                { label: "Other Revenue", value: "$48,000", pct: "3%" },
              ].map(({ label, value, pct }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2 border-b border-border/20 last:border-0"
                >
                  <span className="text-sm text-foreground/50">{label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-foreground/30">
                      {pct}
                    </span>
                    <span className="font-mono text-sm font-medium">{value}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-hover-glow">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-lg">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Avg. tuition per student", value: "$18,500" },
                { label: "Financial aid distributed", value: "$420K" },
                { label: "Scholarship fund balance", value: "$1.2M" },
                { label: "Operating margin", value: "14.2%" },
              ].map(({ label, value }) => (
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
