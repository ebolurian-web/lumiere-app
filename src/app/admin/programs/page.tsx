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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-56 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          Program Portfolio
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {programs.length} programs ·{" "}
          {programs.reduce((s, p) => s + p.enrolled, 0)} total enrolled
        </p>
      </BlurFade>

      {/* Summary */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
              Total Programs
            </p>
            <NumberTicker
              value={programs.length}
              delay={0.2}
              className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
            />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
              Total Enrolled
            </p>
            <NumberTicker
              value={programs.reduce((s, p) => s + p.enrolled, 0)}
              delay={0.3}
              className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
            />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
              Total Capacity
            </p>
            <NumberTicker
              value={programs.reduce((s, p) => s + p.capacity, 0)}
              delay={0.4}
              className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
            />
          </div>
        </div>
      </BlurFade>

      {/* Program cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programs.map((p, i) => {
          const pct = Math.round((p.enrolled / p.capacity) * 100);
          return (
            <BlurFade key={p.id} delay={0.15 + i * 0.06} inView>
              <Card className="card-hover-glow h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-mono text-xs font-medium text-primary">
                      {p.code}
                    </p>
                    <Badge variant="outline" className="text-[10px]">
                      {p.format}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-foreground/35 mb-3">{p.duration}</p>
                  <p className="text-sm text-foreground/45 leading-relaxed mb-5">
                    {p.description}
                  </p>

                  <div className="gradient-divider mb-4" />

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-foreground/35">Enrollment</span>
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
