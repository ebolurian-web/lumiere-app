"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";

interface Program {
  id: string;
  name: string;
  code: string;
  duration: string;
  format: string;
  description: string;
  enrolled: number;
  capacity: number;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("programs")
        .select("*")
        .order("name");
      if (data) setPrograms(data as Program[]);
      setLoading(false);
    }
    load();
  }, []);

  const totalEnrolled = programs.reduce((s, p) => s + p.enrolled, 0);
  const totalCapacity = programs.reduce((s, p) => s + p.capacity, 0);
  const avgFillRate =
    totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const summaryCards = [
    { label: "Total Enrolled", value: totalEnrolled, delay: 0.15 },
    { label: "Total Capacity", value: totalCapacity, delay: 0.2 },
    { label: "Avg Fill Rate", value: avgFillRate, delay: 0.25, suffix: "%" },
    { label: "Programs", value: programs.length, delay: 0.3 },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-56 animate-pulse" />
        <div className="h-5 bg-muted rounded w-40 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl font-light tracking-tight">
          Programs
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {programs.length} programs &middot; {totalEnrolled} total enrolled
        </p>
      </BlurFade>

      {/* Summary row */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-0.5">
                  <NumberTicker
                    value={stat.value}
                    delay={stat.delay}
                    className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
                  />
                  {stat.suffix && (
                    <span className="text-lg font-mono font-semibold text-foreground/50">
                      {stat.suffix}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </BlurFade>

      {/* Program cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {programs.map((p, i) => {
          const pct = p.capacity > 0 ? Math.round((p.enrolled / p.capacity) * 100) : 0;
          return (
            <BlurFade key={p.id} delay={0.2 + i * 0.06} inView>
              <Card className="card-hover-glow h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="font-mono text-xs">
                      {p.code}
                    </Badge>
                  </div>

                  <h3 className="font-serif text-xl font-semibold mb-1.5">
                    {p.name}
                  </h3>
                  <p className="text-sm text-foreground/45 leading-relaxed mb-4">
                    {p.description}
                  </p>

                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-xs text-foreground/40">
                      {p.duration}
                    </span>
                    <span className="text-foreground/15">&middot;</span>
                    <span className="font-mono text-xs text-foreground/40">
                      {p.format}
                    </span>
                  </div>

                  <div className="gradient-divider mb-4" />

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-foreground/35">
                      Enrollment
                    </span>
                    <span className="font-mono text-xs text-foreground/50">
                      {p.enrolled}/{p.capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={pct} className="h-1.5 flex-1" />
                    <span className="font-mono text-xs text-foreground/40">
                      {pct}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          );
        })}
      </div>
    </div>
  );
}
