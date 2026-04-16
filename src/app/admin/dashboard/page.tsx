"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";
import { useRole } from "@/lib/role-context";
import { ArrowRight, Shield } from "lucide-react";

const RECENT_ACTIVITY = [
  {
    id: "ra-1",
    description: "Course override approved for Maya Rodriguez",
    time: "2h ago",
    type: "approval",
  },
  {
    id: "ra-2",
    description: "New enrollment: Raj Patel \u2192 DS 310",
    time: "5h ago",
    type: "enrollment",
  },
  {
    id: "ra-3",
    description: "Grade appeal submitted by Sofia Almeida",
    time: "1d ago",
    type: "appeal",
  },
  {
    id: "ra-4",
    description: "Transfer credit evaluated for Amara Okonkwo",
    time: "2d ago",
    type: "transfer",
  },
];

const ACTIVITY_COLORS: Record<string, string> = {
  approval: "bg-success",
  enrollment: "bg-info",
  appeal: "bg-warning",
  transfer: "bg-purple-600",
};

export default function AdminDashboard() {
  const { user } = useRole();
  const [approvals, setApprovals] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [approvalsRes, programsRes] = await Promise.all([
        supabase
          .from("approvals")
          .select("*, student:student_id(full_name)")
          .eq("status", "pending")
          .order("submitted_at", { ascending: false }),
        supabase.from("programs").select("*"),
      ]);
      if (approvalsRes.data) setApprovals(approvalsRes.data);
      if (programsRes.data) setPrograms(programsRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const totalEnrolled = programs.reduce((s, p) => s + (p.enrolled || 0), 0);
  const totalCapacity = programs.reduce((s, p) => s + (p.capacity || 0), 0);
  const capacityPercent = totalCapacity
    ? Math.round((totalEnrolled / totalCapacity) * 100)
    : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-5">
        {/* Welcome banner skeleton */}
        <div className="col-span-12 h-44 bg-muted rounded-xl animate-pulse" />
        {/* KPI row skeleton */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        {/* Approvals skeleton */}
        <div className="col-span-12 lg:col-span-8 h-72 bg-muted rounded-xl animate-pulse" />
        {/* Enrollment skeleton */}
        <div className="col-span-12 lg:col-span-4 h-72 bg-muted rounded-xl animate-pulse" />
        {/* Activity skeleton */}
        <div className="col-span-12 lg:col-span-8 h-64 bg-muted rounded-xl animate-pulse" />
        {/* Quick metrics skeleton */}
        <div className="col-span-12 lg:col-span-4 h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* -- Welcome Banner -- col-span-12 */}
      <BlurFade delay={0} className="col-span-12">
        <div className="relative overflow-hidden rounded-2xl bg-[#A41034] p-8 md:p-10">
          {/* Decorative Shield */}
          <Shield
            className="absolute -right-8 -bottom-8 w-56 h-56 text-white/[0.06] rotate-12 pointer-events-none"
            strokeWidth={0.7}
          />

          <p className="text-sm font-medium text-white/60 mb-1">Welcome Back</p>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-tight">
            {greeting}, {user?.name?.split(" ")[0] || "Victoria"}.
          </h1>
          <p className="text-white/50 text-sm mt-3 max-w-lg">
            {approvals.length} pending approval{approvals.length !== 1 ? "s" : ""}{" "}
            require attention. Enrollment is at {capacityPercent}% capacity.
          </p>

          <div className="flex items-center gap-3 mt-6">
            <Link href="/admin/approvals">
              <Button className="bg-white text-[#A41034] hover:bg-white/90 font-medium text-sm px-5 h-9 rounded-lg">
                Review Approvals
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white font-medium text-sm px-5 h-9 rounded-lg"
              >
                View Reports
              </Button>
            </Link>
          </div>
        </div>
      </BlurFade>

      {/* -- KPI Row -- col-span-12 */}
      <BlurFade delay={0.1} className="col-span-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Card className="card-hover-glow">
            <CardContent className="pt-5 pb-4">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
                Total Enrollment
              </p>
              <NumberTicker
                value={1247}
                delay={0.2}
                className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
              />
            </CardContent>
          </Card>
          <Card className="card-hover-glow">
            <CardContent className="pt-5 pb-4">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
                Active Courses
              </p>
              <NumberTicker
                value={42}
                delay={0.3}
                className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
              />
            </CardContent>
          </Card>
          <Card className="card-hover-glow">
            <CardContent className="pt-5 pb-4">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
                Pending Approvals
              </p>
              <NumberTicker
                value={approvals.length}
                delay={0.4}
                className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
              />
            </CardContent>
          </Card>
          <Card className="card-hover-glow">
            <CardContent className="pt-5 pb-4">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
                Revenue MTD
              </p>
              <p className="text-[1.7rem] font-mono font-semibold text-foreground leading-none">
                $<NumberTicker value={2.1} decimalPlaces={1} delay={0.5} className="inline" />
                <span className="text-foreground/30">M</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </BlurFade>

      {/* -- Pending Approvals -- col-span-8 */}
      <BlurFade delay={0.2} inView className="col-span-12 lg:col-span-8">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">
                Pending Approvals
                <span className="ml-2 font-mono text-xs font-normal text-primary">
                  {approvals.length}
                </span>
              </CardTitle>
              <Link
                href="/admin/approvals"
                className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1"
              >
                All approvals <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {approvals.length === 0 ? (
              <p className="text-sm text-foreground/40 py-6 text-center">
                No pending approvals
              </p>
            ) : (
              approvals.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3.5 p-3.5 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      a.priority === "high" || a.priority === "urgent"
                        ? "bg-danger"
                        : "bg-warning"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.type}</p>
                    <p className="text-xs text-foreground/35 truncate">
                      {a.student?.full_name} &middot;{" "}
                      {a.detail?.substring(0, 60)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {(a.priority === "high" || a.priority === "urgent") && (
                      <Badge className="text-[10px] bg-danger/10 text-danger border-0">
                        {a.priority}
                      </Badge>
                    )}
                    <span className="font-mono text-[10px] text-foreground/25">
                      {new Date(a.submitted_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </BlurFade>

      {/* -- Enrollment by Program -- col-span-4 */}
      <BlurFade delay={0.25} inView className="col-span-12 lg:col-span-4">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg">
              Enrollment by Program
            </CardTitle>
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
                      style={{
                        width: `${pct}%`,
                        opacity: 0.4 + (pct / 100) * 0.6,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </BlurFade>

      {/* -- Recent Activity -- col-span-8 */}
      <BlurFade delay={0.3} inView className="col-span-12 lg:col-span-8">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {RECENT_ACTIVITY.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3.5 p-3.5 rounded-lg bg-muted/30"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    ACTIVITY_COLORS[event.type] || "bg-gold"
                  }`}
                />
                <p className="text-sm flex-1 min-w-0 truncate">
                  {event.description}
                </p>
                <span className="font-mono text-[10px] text-foreground/25 flex-shrink-0">
                  {event.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </BlurFade>

      {/* -- Quick Metrics -- col-span-4 */}
      <BlurFade delay={0.35} inView className="col-span-12 lg:col-span-4">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg">Quick Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Avg. approval time", value: "48h" },
              { label: "Retention rate", value: "94%" },
              { label: "Faculty count", value: "42" },
              { label: "Graduation rate", value: "91%" },
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
      </BlurFade>
    </div>
  );
}
