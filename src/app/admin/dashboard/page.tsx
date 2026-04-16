"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";
import { useRole } from "@/lib/role-context";
import { ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useRole();
  const [approvals, setApprovals] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const [approvalsRes, programsRes] = await Promise.all([
        supabase.from("approvals").select("*, student:student_id(full_name)").eq("status", "pending").order("submitted_at", { ascending: false }),
        supabase.from("programs").select("*"),
      ]);
      if (approvalsRes.data) setApprovals(approvalsRes.data);
      if (programsRes.data) setPrograms(programsRes.data);
      setLoading(false);
    }
    fetch();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-64 animate-pulse" />
        <div className="grid grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          {greeting}, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </BlurFade>

      {/* KPIs */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Total Enrollment</p>
            <NumberTicker value={1247} delay={0.2} className="text-[1.7rem] font-mono font-semibold text-foreground leading-none" />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Active Courses</p>
            <NumberTicker value={42} delay={0.3} className="text-[1.7rem] font-mono font-semibold text-foreground leading-none" />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Pending Approvals</p>
            <NumberTicker value={approvals.length} delay={0.4} className="text-[1.7rem] font-mono font-semibold text-foreground leading-none" />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Revenue MTD</p>
            <p className="text-[1.7rem] font-mono font-semibold text-foreground leading-none">$2.1<span className="text-foreground/30">M</span></p>
          </div>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Approvals */}
        <div className="lg:col-span-2">
          <BlurFade delay={0.2} inView>
            <Card className="card-hover-glow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-lg">
                    Pending Approvals
                    <span className="ml-2 font-mono text-xs font-normal text-primary">{approvals.length}</span>
                  </CardTitle>
                  <Link href="/admin/approvals" className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1">
                    All approvals <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {approvals.map((a) => (
                  <div key={a.id} className="flex items-center gap-3.5 p-3.5 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${a.priority === "high" || a.priority === "urgent" ? "bg-danger" : "bg-warning"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.type}</p>
                      <p className="text-xs text-foreground/35">{a.student?.full_name} · {a.detail?.substring(0, 60)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(a.priority === "high" || a.priority === "urgent") && (
                        <Badge className="text-[10px] bg-danger/10 text-danger border-0">{a.priority}</Badge>
                      )}
                      <span className="font-mono text-[10px] text-foreground/25">
                        {new Date(a.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* Right — Enrollment by program */}
        <div>
          <BlurFade delay={0.3} inView>
            <Card className="card-hover-glow">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg">Enrollment by Program</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {programs.map((p) => {
                  const pct = Math.round((p.enrolled / p.capacity) * 100);
                  return (
                    <div key={p.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm">{p.name}</span>
                        <span className="font-mono text-xs text-foreground/35">
                          {p.enrolled}/{p.capacity}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-1000"
                          style={{ width: `${pct}%`, opacity: 0.4 + (pct / 100) * 0.6 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </BlurFade>

          <BlurFade delay={0.4} inView>
            <Card className="card-hover-glow mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Avg. approval time", value: "48h" },
                  { label: "Retention rate", value: "94%" },
                  { label: "Faculty count", value: "42" },
                  { label: "Graduation rate", value: "91%" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                    <span className="text-sm text-foreground/50">{label}</span>
                    <span className="font-mono text-sm font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
