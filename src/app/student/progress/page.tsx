"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

interface DegreeReq {
  category: string; credits_required: number; credits_completed: number;
}

export default function ProgressPage() {
  const [reqs, setReqs] = useState<DegreeReq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("degree_requirements")
        .select("category, credits_required, credits_completed")
        .eq("user_id", MAYA_ID);
      if (data) setReqs(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const totalRequired = reqs.reduce((s, r) => s + r.credits_required, 0);
  const totalCompleted = reqs.reduce((s, r) => s + r.credits_completed, 0);
  const overallPct = totalRequired ? Math.round((totalCompleted / totalRequired) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">Degree Progress</h1>
        <p className="text-foreground/40 text-sm mt-1">B.S. Data Science · Junior Standing</p>
      </BlurFade>

      {/* Overall progress */}
      <BlurFade delay={0.1}>
        <Card className="card-hover-glow">
          <CardContent className="p-8">
            <div className="flex items-center gap-8">
              {/* Large progress ring */}
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg width="112" height="112" className="-rotate-90">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/60" />
                  <circle
                    cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 - (overallPct / 100) * 2 * Math.PI * 48}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-2xl font-bold text-foreground">{overallPct}%</span>
                  <span className="text-[10px] text-foreground/30">complete</span>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="font-serif text-xl font-semibold mb-2">Overall Degree Completion</h2>
                <p className="text-foreground/45 text-sm leading-relaxed mb-4">
                  You have completed <span className="font-mono font-medium text-foreground">{totalCompleted}</span> of{" "}
                  <span className="font-mono font-medium text-foreground">{totalRequired}</span> required credits.
                  At current pace, you are on track to graduate in Spring 2027.
                </p>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="font-mono text-2xl font-bold text-foreground">
                      <NumberTicker value={totalCompleted} delay={0.3} />
                    </p>
                    <p className="text-xs text-foreground/30 uppercase tracking-wider">Credits earned</p>
                  </div>
                  <div className="w-px h-8 bg-border/40" />
                  <div>
                    <p className="font-mono text-2xl font-bold text-foreground">
                      <NumberTicker value={totalRequired - totalCompleted} delay={0.5} />
                    </p>
                    <p className="text-xs text-foreground/30 uppercase tracking-wider">Remaining</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Category breakdown */}
      <BlurFade delay={0.2}>
        <h3 className="font-serif text-lg font-semibold mb-4">Requirement Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reqs.map((req, i) => {
            const pct = Math.round((req.credits_completed / req.credits_required) * 100);
            return (
              <BlurFade key={req.category} delay={0.25 + i * 0.06} inView>
                <Card className="card-hover-glow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm">{req.category}</p>
                        <p className="font-mono text-xs text-foreground/30 mt-0.5">
                          {req.credits_completed} / {req.credits_required} credits
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold text-primary">{pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-1000"
                        style={{ width: `${pct}%`, opacity: 0.4 + (pct / 100) * 0.6 }}
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
