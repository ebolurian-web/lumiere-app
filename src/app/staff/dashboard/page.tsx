"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";
import { useRole } from "@/lib/role-context";
import { ArrowRight, Shield } from "lucide-react";

const KIM_ID = "c1000000-0000-0000-0000-000000000001";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-info",
  green: "bg-success",
  purple: "bg-purple-600",
  amber: "bg-warning",
  pink: "bg-pink-600",
};

const GRADIENT_MAP: Record<string, string> = {
  blue: "from-info/80 to-info/40",
  green: "from-success/80 to-success/40",
  purple: "from-purple-600/80 to-purple-600/40",
  amber: "from-warning/80 to-warning/40",
  pink: "from-pink-600/80 to-pink-600/40",
};

const TEXT_COLOR_MAP: Record<string, string> = {
  blue: "text-info",
  green: "text-success",
  purple: "text-purple-600",
  amber: "text-warning",
  pink: "text-pink-600",
};

interface Course {
  id: string;
  code: string;
  title: string;
  schedule: string;
  room: string;
  color: string;
}

export default function StaffDashboard() {
  const { user } = useRole();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("courses")
        .select("id, code, title, schedule, room, color")
        .eq("instructor_id", KIM_ID);
      if (data) setCourses(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Demo grading queue
  const gradingQueue = [
    {
      title: "Neural Network Implementation",
      course: "DS 310",
      type: "Project",
      submissions: 23,
      urgent: false,
    },
    {
      title: "Midterm Exam",
      course: "DS 310",
      type: "Exam",
      submissions: 28,
      urgent: true,
    },
    {
      title: "Weekly Problem Set 7",
      course: "DS 310",
      type: "Homework",
      submissions: 18,
      urgent: false,
    },
  ];

  const totalSubmissions = gradingQueue.reduce((s, g) => s + g.submissions, 0);

  // Demo at-risk students
  const atRiskStudents = [
    { name: "Sofia Almeida", grade: "C+", note: "Below 80% threshold", color: "text-danger" },
    { name: "Raj Patel", grade: "B-", note: "Missing 2 assignments", color: "text-warning" },
  ];

  // Demo today's schedule
  const todaySchedule = [
    {
      time: "10:00 – 10:50",
      title: "DS 310 Lecture",
      room: "Turing Hall 204",
      dot: "bg-info",
    },
    {
      time: "14:00 – 16:00",
      title: "Office Hours",
      room: "Turing Hall 206",
      dot: "bg-gold",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-5">
        {/* Welcome banner skeleton */}
        <div className="col-span-12 h-44 bg-muted rounded-xl animate-pulse" />
        {/* Stat row skeleton */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        {/* Grading queue skeleton */}
        <div className="col-span-12 lg:col-span-8 h-72 bg-muted rounded-xl animate-pulse" />
        {/* Today skeleton */}
        <div className="col-span-12 lg:col-span-4 h-72 bg-muted rounded-xl animate-pulse" />
        {/* Course overview skeleton */}
        <div className="col-span-12 lg:col-span-8 h-64 bg-muted rounded-xl animate-pulse" />
        {/* At-risk skeleton */}
        <div className="col-span-12 lg:col-span-4 h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* ── Welcome Banner ── col-span-12 */}
      <BlurFade delay={0} className="col-span-12">
        <div className="relative overflow-hidden rounded-2xl bg-[#A41034] p-8 md:p-10">
          {/* Decorative Shield */}
          <Shield
            className="absolute -right-8 -bottom-8 w-56 h-56 text-white/[0.06] rotate-12 pointer-events-none"
            strokeWidth={0.7}
          />

          <p className="text-sm font-medium text-white/60 mb-1">Welcome Back</p>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-tight">
            {greeting}, Dr.&nbsp;{user?.name?.split(" ").pop() || "Kim"}.
          </h1>
          <p className="text-white/50 text-sm mt-3 max-w-lg">
            You have {totalSubmissions} submissions to grade and{" "}
            {todaySchedule.length} class{todaySchedule.length !== 1 ? "es" : ""}{" "}
            today.
          </p>

          <div className="flex items-center gap-3 mt-6">
            <Link href="/staff/gradebook">
              <Button className="bg-white text-[#A41034] hover:bg-white/90 font-medium text-sm px-5 h-9 rounded-lg">
                Grading Queue
              </Button>
            </Link>
            <Link href="/staff/schedule">
              <Button
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white font-medium text-sm px-5 h-9 rounded-lg"
              >
                My Schedule
              </Button>
            </Link>
          </div>
        </div>
      </BlurFade>

      {/* ── Stat Row ── col-span-12 */}
      <BlurFade delay={0.08} inView className="col-span-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Card className="card-hover-glow">
            <CardContent className="pt-5 pb-4 flex flex-col items-center justify-center">
              <p className="text-[10px] font-medium text-foreground/40 uppercase tracking-wider mb-1">
                Active Courses
              </p>
              <NumberTicker
                value={courses.length || 1}
                delay={0.2}
                className="font-serif text-3xl font-bold"
              />
            </CardContent>
          </Card>
          <Card className="card-hover-glow">
            <CardContent className="pt-5 pb-4 flex flex-col items-center justify-center">
              <p className="text-[10px] font-medium text-foreground/40 uppercase tracking-wider mb-1">
                Total Students
              </p>
              <NumberTicker
                value={87}
                delay={0.3}
                className="font-serif text-3xl font-bold"
              />
            </CardContent>
          </Card>
          <Card className="card-hover-glow">
            <CardContent className="pt-5 pb-4 flex flex-col items-center justify-center">
              <p className="text-[10px] font-medium text-foreground/40 uppercase tracking-wider mb-1">
                Pending Grading
              </p>
              <NumberTicker
                value={totalSubmissions}
                delay={0.4}
                className="font-serif text-3xl font-bold"
              />
            </CardContent>
          </Card>
          <Card className="card-hover-glow">
            <CardContent className="pt-5 pb-4 flex flex-col items-center justify-center">
              <p className="text-[10px] font-medium text-foreground/40 uppercase tracking-wider mb-1">
                Office Hours
              </p>
              <p className="font-serif text-3xl font-bold leading-none">Wed 2p</p>
            </CardContent>
          </Card>
        </div>
      </BlurFade>

      {/* ── Grading Queue ── col-span-8 */}
      <BlurFade delay={0.15} inView className="col-span-12 lg:col-span-8">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">Grading Queue</CardTitle>
              <Link
                href="/staff/gradebook"
                className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1"
              >
                Gradebook <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {gradingQueue.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3.5 p-3.5 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.urgent ? "bg-danger" : "bg-warning"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-foreground/35">
                    <span className="font-mono">{item.course}</span> &middot;{" "}
                    {item.type}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-sm font-medium">
                    {item.submissions}
                  </p>
                  <p className="text-[10px] text-foreground/30">submissions</p>
                </div>
                {item.urgent && (
                  <Badge className="text-[10px] bg-danger/10 text-danger border-0">
                    Urgent
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </BlurFade>

      {/* ── Today's Teaching ── col-span-4 */}
      <BlurFade delay={0.2} inView className="col-span-12 lg:col-span-4">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">
                Today&apos;s Teaching
              </CardTitle>
              <Link
                href="/staff/schedule"
                className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1"
              >
                Schedule <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {todaySchedule.map((event) => (
              <div
                key={event.title}
                className="flex items-center gap-3.5 p-3.5 rounded-lg bg-muted/30"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${event.dot}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-foreground/35">{event.room}</p>
                </div>
                <span className="font-mono text-[11px] text-foreground/30 flex-shrink-0">
                  {event.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </BlurFade>

      {/* ── Course Overview ── col-span-8 */}
      <BlurFade delay={0.25} inView className="col-span-12 lg:col-span-8">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">
                Course Overview
              </CardTitle>
              <Link
                href="/staff/courses"
                className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1"
              >
                All courses <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-border hover:border-border/80 hover:shadow-sm transition-all cursor-pointer overflow-hidden"
                >
                  <div
                    className={`h-2 w-full bg-gradient-to-r ${
                      GRADIENT_MAP[course.color] || "from-gold/80 to-gold/40"
                    }`}
                  />
                  <div className="p-4">
                    <p
                      className={`font-mono text-xs font-medium mb-1 ${
                        TEXT_COLOR_MAP[course.color] || "text-gold"
                      }`}
                    >
                      {course.code}
                    </p>
                    <p className="text-sm font-medium mb-0.5">{course.title}</p>
                    <p className="text-xs text-foreground/35">
                      {course.schedule} &middot; {course.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* ── At-Risk Students ── col-span-4 */}
      <BlurFade delay={0.3} inView className="col-span-12 lg:col-span-4">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-lg">
              At-Risk Students
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {atRiskStudents.map((s) => {
              const initials = s.name
                .split(" ")
                .map((n) => n[0])
                .join("");

              return (
                <div
                  key={s.name}
                  className="flex items-center gap-3.5 p-3.5 rounded-lg bg-danger/[0.03] cursor-pointer hover:bg-danger/[0.06] transition-colors"
                >
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarFallback className="text-[10px] bg-danger/8 text-danger">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-foreground/35">{s.note}</p>
                  </div>
                  <span className={`font-mono text-sm font-bold ${s.color}`}>
                    {s.grade}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  );
}
