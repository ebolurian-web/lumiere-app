"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";
import { useRole } from "@/lib/role-context";
import { ArrowRight, Shield } from "lucide-react";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-info",
  green: "bg-success",
  purple: "bg-purple-600",
  amber: "bg-warning",
  pink: "bg-pink-600",
};

const TEXT_COLOR_MAP: Record<string, string> = {
  blue: "text-info",
  green: "text-success",
  purple: "text-purple-600",
  amber: "text-warning",
  pink: "text-pink-600",
};

const BORDER_COLOR_MAP: Record<string, string> = {
  blue: "border-l-info",
  green: "border-l-success",
  purple: "border-l-purple-600",
  amber: "border-l-warning",
  pink: "border-l-pink-600",
};

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  staff: { bg: "bg-navy/8", text: "text-navy dark:text-foreground" },
  admin: { bg: "bg-gold/8", text: "text-gold" },
  student: { bg: "bg-info/8", text: "text-info" },
};

interface Course {
  id: string;
  code: string;
  title: string;
  instructor_name: string;
  color: string;
  percentage?: number;
}

interface ScheduleEvent {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  course: { code: string; title: string; color: string };
}

interface Assignment {
  id: string;
  title: string;
  type: string;
  due_date: string;
  points: number;
  course: { code: string };
}

interface MessageRow {
  id: string;
  subject: string;
  from_user: { full_name: string; role?: string };
  read: boolean;
  created_at: string;
}

interface DegreeReq {
  category: string;
  credits_required: number;
  credits_completed: number;
}

// Extra schedule items so the list isn't sparse
const EXTRA_SCHEDULE = [
  {
    id: "extra-1",
    start_time: "14:00",
    end_time: "15:00",
    title: "Office Hours — Dr. Kim",
    subtitle: "Turing Hall 206",
    type: "Office Hours",
    color: "gold",
    days: [3],
  },
  {
    id: "extra-2",
    start_time: "16:30",
    end_time: "17:30",
    title: "DS Study Group",
    subtitle: "Library Room 3B",
    type: "Study Group",
    color: "blue",
    days: [1, 3],
  },
  {
    id: "extra-3",
    start_time: "11:00",
    end_time: "11:30",
    title: "Advisor Check-in",
    subtitle: "Virtual — Zoom",
    type: "Advising",
    color: "green",
    days: [2, 4],
  },
];

export default function StudentDashboard() {
  const { user } = useRole();
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [degreeReqs, setDegreeReqs] = useState<DegreeReq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [coursesRes, scheduleRes, assignmentsRes, messagesRes, degreeRes] =
        await Promise.all([
          supabase
            .from("enrollments")
            .select("course_id, percentage, courses(id, code, title, instructor_name, color)")
            .eq("user_id", MAYA_ID),
          supabase
            .from("schedule_events")
            .select("id, day_of_week, start_time, end_time, room, courses(code, title, color)")
            .in("course_id", [
              "e1000000-0000-0000-0000-000000000001",
              "e1000000-0000-0000-0000-000000000002",
              "e1000000-0000-0000-0000-000000000003",
              "e1000000-0000-0000-0000-000000000005",
            ]),
          supabase
            .from("assignments")
            .select("id, title, type, due_date, points, courses(code)")
            .in("course_id", [
              "e1000000-0000-0000-0000-000000000001",
              "e1000000-0000-0000-0000-000000000002",
              "e1000000-0000-0000-0000-000000000003",
              "e1000000-0000-0000-0000-000000000005",
            ])
            .order("due_date", { ascending: true })
            .limit(6),
          supabase
            .from("messages")
            .select("id, subject, read, created_at, from_user:from_user_id(full_name, role)")
            .eq("to_user_id", MAYA_ID)
            .order("created_at", { ascending: false })
            .limit(4),
          supabase
            .from("degree_requirements")
            .select("category, credits_required, credits_completed")
            .eq("user_id", MAYA_ID),
        ]);

      if (coursesRes.data) {
        setCourses(
          coursesRes.data.map((e: any) => ({
            id: e.courses.id,
            code: e.courses.code,
            title: e.courses.title,
            instructor_name: e.courses.instructor_name,
            color: e.courses.color,
            percentage: e.percentage,
          }))
        );
      }

      if (scheduleRes.data) {
        const today = new Date().getDay();
        const todayMapped = today === 0 ? 7 : today;
        const todayEvents = scheduleRes.data
          .filter((e: any) => e.day_of_week === todayMapped)
          .map((e: any) => ({ ...e, course: e.courses }))
          .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));
        setSchedule(todayEvents);
      }

      if (assignmentsRes.data) {
        setAssignments(assignmentsRes.data.map((a: any) => ({ ...a, course: a.courses })));
      }

      if (messagesRes.data) {
        setMessages(messagesRes.data.map((m: any) => ({ ...m, from_user: m.from_user })));
      }

      if (degreeRes.data) {
        setDegreeReqs(degreeRes.data);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const totalCreditsRequired = degreeReqs.reduce((s, r) => s + r.credits_required, 0);
  const totalCreditsCompleted = degreeReqs.reduce((s, r) => s + r.credits_completed, 0);
  const degreePercent = totalCreditsRequired
    ? Math.round((totalCreditsCompleted / totalCreditsRequired) * 100)
    : 0;

  const pendingAssignments = assignments.filter((a) => new Date(a.due_date) > new Date()).length;
  const unreadMessages = messages.filter((m) => !m.read).length;

  const today = new Date().getDay();
  const todayMapped = today === 0 ? 7 : today;
  const extraToday = EXTRA_SCHEDULE.filter((e) => e.days.includes(todayMapped));

  const todayClassCount = schedule.length + extraToday.length;

  if (loading) {
    return (
      <div className="grid grid-cols-12 gap-5">
        {/* Welcome banner skeleton */}
        <div className="col-span-12 h-44 bg-muted rounded-xl animate-pulse" />
        {/* Schedule skeleton */}
        <div className="col-span-12 lg:col-span-8 h-72 bg-muted rounded-xl animate-pulse" />
        {/* Stats skeleton */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <div className="h-32 bg-muted rounded-xl animate-pulse" />
          <div className="h-32 bg-muted rounded-xl animate-pulse" />
          <div className="grid grid-cols-2 gap-5">
            <div className="h-24 bg-muted rounded-xl animate-pulse" />
            <div className="h-24 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
        {/* Courses skeleton */}
        <div className="col-span-12 lg:col-span-8 h-64 bg-muted rounded-xl animate-pulse" />
        {/* Messages skeleton */}
        <div className="col-span-12 lg:col-span-4 h-64 bg-muted rounded-xl animate-pulse" />
        {/* Bottom row skeletons */}
        <div className="col-span-12 lg:col-span-6 h-56 bg-muted rounded-xl animate-pulse" />
        <div className="col-span-12 lg:col-span-6 h-56 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* ── Welcome Banner ── col-span-12 */}
      <BlurFade delay={0} className="col-span-12">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-8 md:p-10">
          {/* Decorative Shield */}
          <Shield
            className="absolute -right-8 -bottom-8 w-56 h-56 text-white/[0.06] rotate-12 pointer-events-none"
            strokeWidth={0.7}
          />

          <p className="text-sm font-medium text-white/60 mb-1">Welcome Back</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white tracking-tight">
            {greeting}, {user?.name?.split(" ")[0] || "Maya"}.
          </h1>
          <p className="text-white/50 text-sm mt-3 max-w-lg">
            You have {todayClassCount} class{todayClassCount !== 1 ? "es" : ""} today and{" "}
            {pendingAssignments} pending task{pendingAssignments !== 1 ? "s" : ""}.
          </p>

          <div className="flex items-center gap-3 mt-6">
            <Link href="/student/assignments">
              <Button className="bg-white text-primary hover:bg-white/90 font-medium text-sm px-5 h-9 rounded-lg">
                View Tasks
              </Button>
            </Link>
            <Link href="/student/schedule">
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

      {/* ── Today's Schedule ── col-span-8 */}
      <BlurFade delay={0.1} inView className="col-span-12 lg:col-span-8">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">Today&apos;s Schedule</CardTitle>
              <Link
                href="/student/schedule"
                className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1"
              >
                Full schedule <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {schedule.length === 0 && extraToday.length === 0 ? (
              <p className="text-sm text-foreground/40 py-6 text-center">Nothing scheduled today</p>
            ) : (
              <>
                {schedule.map((event) => {
                  const now = new Date();
                  const [startH, startM] = event.start_time.split(":").map(Number);
                  const [endH, endM] = event.end_time.split(":").map(Number);
                  const isNow =
                    now.getHours() * 60 + now.getMinutes() >= startH * 60 + startM &&
                    now.getHours() * 60 + now.getMinutes() < endH * 60 + endM;

                  return (
                    <div
                      key={event.id}
                      className={`flex items-center gap-3.5 p-3.5 rounded-lg ${isNow ? "bg-gold/[0.04]" : "bg-muted/30"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${COLOR_MAP[event.course.color] || "bg-gold"}`}
                      />
                      <div className="font-mono text-[13px] text-foreground/40 w-[100px] flex-shrink-0">
                        {event.start_time.slice(0, 5)} – {event.end_time.slice(0, 5)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.course.title}</p>
                        <p className="text-xs text-foreground/35">
                          {event.room} · <span className="font-mono">{event.course.code}</span>
                        </p>
                      </div>
                      {isNow && (
                        <span className="text-[10px] font-medium text-gold flex items-center gap-1.5">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-gold" />
                          </span>
                          Now
                        </span>
                      )}
                    </div>
                  );
                })}
                {extraToday.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3.5 p-3.5 rounded-lg bg-muted/20"
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        event.color === "gold"
                          ? "bg-gold"
                          : event.color === "blue"
                            ? "bg-info"
                            : "bg-success"
                      }`}
                    />
                    <div className="font-mono text-[13px] text-foreground/40 w-[100px] flex-shrink-0">
                      {event.start_time} – {event.end_time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-foreground/35">{event.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-foreground/30">{event.type}</span>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </BlurFade>

      {/* ── Stats Column ── col-span-4 */}
      <div className="col-span-12 lg:col-span-4 space-y-5">
        {/* GPA */}
        <BlurFade delay={0.15} inView>
          <Card className="card-hover-glow">
            <CardContent className="pt-6 pb-5 flex flex-col items-center justify-center">
              <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-1">
                GPA
              </p>
              <NumberTicker
                value={3.72}
                decimalPlaces={2}
                className="font-serif text-4xl font-bold"
              />
            </CardContent>
          </Card>
        </BlurFade>

        {/* Degree Progress Ring */}
        <BlurFade delay={0.2} inView>
          <Card className="card-hover-glow">
            <CardContent className="pt-6 pb-5 flex flex-col items-center justify-center">
              <p className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-3">
                Degree Progress
              </p>
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-muted"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(degreePercent / 100) * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                    className="text-gold transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <NumberTicker
                    value={degreePercent}
                    className="font-mono text-lg font-bold"
                  />
                  <span className="font-mono text-xs text-foreground/40 mt-0.5">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Enrolled + Pending sub-grid */}
        <BlurFade delay={0.25} inView>
          <div className="grid grid-cols-2 gap-5">
            <Card className="card-hover-glow">
              <CardContent className="pt-5 pb-4 flex flex-col items-center justify-center">
                <p className="text-[10px] font-medium text-foreground/40 uppercase tracking-wider mb-1">
                  Enrolled
                </p>
                <NumberTicker
                  value={courses.length}
                  className="font-serif text-3xl font-bold"
                />
              </CardContent>
            </Card>
            <Card className="card-hover-glow">
              <CardContent className="pt-5 pb-4 flex flex-col items-center justify-center">
                <p className="text-[10px] font-medium text-foreground/40 uppercase tracking-wider mb-1">
                  Pending
                </p>
                <NumberTicker
                  value={pendingAssignments}
                  className="font-serif text-3xl font-bold"
                />
              </CardContent>
            </Card>
          </div>
        </BlurFade>
      </div>

      {/* ── Courses ── col-span-8 */}
      <BlurFade delay={0.3} inView className="col-span-12 lg:col-span-8">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">Courses</CardTitle>
              <Link
                href="/student/courses"
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
                  className="p-4 rounded-xl border border-border hover:border-border/80 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div
                    className={`w-full h-0.5 rounded-full mb-3 ${COLOR_MAP[course.color] || "bg-gold"}`}
                  />
                  <p
                    className={`font-mono text-xs font-medium mb-1 ${TEXT_COLOR_MAP[course.color] || "text-gold"}`}
                  >
                    {course.code}
                  </p>
                  <p className="text-sm font-medium mb-0.5">{course.title}</p>
                  <p className="text-xs text-foreground/35 mb-3">{course.instructor_name}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={course.percentage || 0} className="h-1 flex-1" />
                    <span className="font-mono text-xs text-foreground/40">
                      {course.percentage?.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* ── Messages ── col-span-4 */}
      <BlurFade delay={0.35} inView className="col-span-12 lg:col-span-4">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">
                Messages
                {unreadMessages > 0 && (
                  <span className="ml-2 font-mono text-xs font-normal text-gold">
                    {unreadMessages}
                  </span>
                )}
              </CardTitle>
              <Link
                href="/student/messages"
                className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1"
              >
                Inbox <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {messages.map((msg) => {
              const initials =
                msg.from_user?.full_name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2) || "?";
              const senderRole = (msg.from_user as any)?.role || "staff";
              const avatarStyle = AVATAR_COLORS[senderRole] || AVATAR_COLORS.staff;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                    !msg.read ? "bg-gold/[0.04]" : ""
                  }`}
                >
                  <Avatar className="h-7 w-7 flex-shrink-0 mt-0.5">
                    <AvatarFallback className={`text-[10px] ${avatarStyle.bg} ${avatarStyle.text}`}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{msg.from_user?.full_name}</p>
                      {!msg.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-foreground/35 truncate">{msg.subject}</p>
                  </div>
                  <span className="font-mono text-[10px] text-foreground/25 flex-shrink-0 mt-1">
                    {new Date(msg.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </BlurFade>

      {/* ── Upcoming Assignments ── col-span-6 */}
      <BlurFade delay={0.4} inView className="col-span-12 lg:col-span-6">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">Upcoming Assignments</CardTitle>
              <Link
                href="/student/assignments"
                className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1"
              >
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {assignments.slice(0, 5).map((assignment) => {
              const due = new Date(assignment.due_date);
              const now = new Date();
              const daysUntil = Math.ceil(
                (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );
              const isUrgent = daysUntil <= 2 && daysUntil >= 0;

              return (
                <div key={assignment.id} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium truncate flex-1">{assignment.title}</p>
                    {isUrgent && (
                      <span className="text-[10px] font-medium text-danger flex-shrink-0 mt-0.5">
                        Due soon
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs text-foreground/35">
                      {assignment.course.code}
                    </span>
                    <span className="text-foreground/15">·</span>
                    <span className="text-xs text-foreground/35 capitalize">{assignment.type}</span>
                    <span className="text-foreground/15">·</span>
                    <span className="font-mono text-xs text-foreground/35">
                      {due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </BlurFade>

      {/* ── Degree Progress ── col-span-6 */}
      <BlurFade delay={0.45} inView className="col-span-12 lg:col-span-6">
        <Card className="card-hover-glow h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">Degree Progress</CardTitle>
              <Link
                href="/student/progress"
                className="text-xs text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-1"
              >
                Full audit <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {degreeReqs.map((req) => {
              const pct = Math.round((req.credits_completed / req.credits_required) * 100);
              return (
                <div key={req.category}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm">{req.category}</span>
                    <span className="font-mono text-xs text-foreground/35">
                      {req.credits_completed}/{req.credits_required}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold transition-all duration-1000"
                      style={{ width: `${pct}%`, opacity: 0.4 + (pct / 100) * 0.6 }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall</span>
                <span className="font-mono text-sm text-gold">{degreePercent}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  );
}
