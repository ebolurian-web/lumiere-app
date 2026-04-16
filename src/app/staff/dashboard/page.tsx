"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { supabase } from "@/lib/supabase";
import { useRole } from "@/lib/role-context";
import { ArrowRight } from "lucide-react";

const KIM_ID = "c1000000-0000-0000-0000-000000000001";

interface GradingItem {
  id: string; title: string; type: string; course: { code: string };
  submission_count: number;
}

export default function StaffDashboard() {
  const { user } = useRole();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("courses")
        .select("id, code, title, schedule, room, color")
        .eq("instructor_id", KIM_ID);
      if (data) setCourses(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Demo grading queue
  const gradingQueue = [
    { title: "Neural Network Implementation", course: "DS 310", type: "Project", submissions: 23, urgent: false },
    { title: "Midterm Exam", course: "DS 310", type: "Exam", submissions: 28, urgent: true },
    { title: "Weekly Problem Set 7", course: "DS 310", type: "Homework", submissions: 18, urgent: false },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-64 animate-pulse" />
        <div className="grid grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          {greeting}, {user?.name.split(" ").slice(0, 2).join(" ")}
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </BlurFade>

      {/* Stat cards */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Active Courses</p>
            <NumberTicker value={courses.length || 1} delay={0.2} className="text-[1.7rem] font-mono font-semibold text-foreground leading-none" />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Total Students</p>
            <NumberTicker value={87} delay={0.3} className="text-[1.7rem] font-mono font-semibold text-foreground leading-none" />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Pending Grading</p>
            <NumberTicker value={69} delay={0.4} className="text-[1.7rem] font-mono font-semibold text-foreground leading-none" />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Office Hours</p>
            <p className="text-[1.7rem] font-mono font-semibold text-foreground leading-none">Wed 2p</p>
          </div>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — grading queue */}
        <div className="lg:col-span-2">
          <BlurFade delay={0.2} inView>
            <Card className="card-hover-glow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-lg">Grading Queue</CardTitle>
                  <Link href="/staff/gradebook" className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1">
                    Gradebook <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {gradingQueue.map((item) => (
                  <div key={item.title} className="flex items-center gap-3.5 p-3.5 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${item.urgent ? "bg-danger" : "bg-warning"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-foreground/35">
                        <span className="font-mono">{item.course}</span> · {item.type}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono text-sm font-medium">{item.submissions}</p>
                      <p className="text-[10px] text-foreground/30">submissions</p>
                    </div>
                    {item.urgent && <Badge className="text-[10px] bg-danger/10 text-danger border-0">Urgent</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        {/* Right — today's teaching */}
        <div>
          <BlurFade delay={0.3} inView>
            <Card className="card-hover-glow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-lg">Today</CardTitle>
                  <Link href="/staff/schedule" className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1">
                    Schedule <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { time: "10:00 – 10:50", title: "DS 310 Lecture", room: "Turing Hall 204" },
                  { time: "14:00 – 16:00", title: "Office Hours", room: "Turing Hall 206" },
                ].map((event) => (
                  <div key={event.title} className="flex items-center gap-3.5 p-3.5 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 rounded-full bg-info" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-foreground/35">{event.room}</p>
                    </div>
                    <span className="font-mono text-[11px] text-foreground/30">{event.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </BlurFade>

          <BlurFade delay={0.4} inView>
            <Card className="card-hover-glow mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-lg">At-Risk Students</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: "Sofia Almeida", grade: "C+", note: "Below 80% threshold" },
                  { name: "Raj Patel", grade: "B-", note: "Missing 2 assignments" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-3.5 p-3.5 rounded-lg bg-danger/[0.03] cursor-pointer hover:bg-danger/[0.06] transition-colors">
                    <div className="w-2 h-2 rounded-full bg-danger" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-foreground/35">{s.note}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-warning">{s.grade}</span>
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
