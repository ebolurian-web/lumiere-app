"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  FileText,
  Play,
  ExternalLink,
  File,
  Presentation,
  Pin,
  ChevronDown,
  BookOpen,
  Clock,
  MapPin,
} from "lucide-react";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-info",
  green: "bg-success",
  purple: "bg-purple-600",
  amber: "bg-warning",
  pink: "bg-pink-600",
};
const TEXT_COLOR: Record<string, string> = {
  blue: "text-info",
  green: "text-success",
  purple: "text-purple-600",
  amber: "text-warning",
  pink: "text-pink-600",
};
const GRADIENT_FROM: Record<string, string> = {
  blue: "from-info/80",
  green: "from-success/80",
  purple: "from-purple-600/80",
  amber: "from-warning/80",
  pink: "from-pink-600/80",
};
const GRADIENT_TO: Record<string, string> = {
  blue: "to-info/40",
  green: "to-success/40",
  purple: "to-purple-600/40",
  amber: "to-warning/40",
  pink: "to-pink-600/40",
};
const GRADE_COLORS: Record<string, string> = {
  "A+": "text-success",
  A: "text-success",
  "A-": "text-success",
  "B+": "text-info",
  B: "text-info",
  "B-": "text-info",
  "C+": "text-warning",
  C: "text-warning",
  "C-": "text-warning",
  D: "text-danger",
  F: "text-danger",
};

interface Course {
  id: string;
  code: string;
  title: string;
  instructor_name: string;
  instructor_email: string;
  instructor_office_hours: string;
  color: string;
  schedule: string;
  room: string;
  credits: number;
  description: string;
  syllabus: string;
}

interface Enrollment {
  grade: string;
  percentage: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  week_number: number;
  status: string;
}

interface Assignment {
  id: string;
  title: string;
  type: string;
  due_date: string;
  points: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  created_at: string;
  posted_by: { full_name: string } | null;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
  module_id: string | null;
}

function relativeTime(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays <= 7) return `in ${diffDays}d`;
  if (diffDays <= 30) return `in ${Math.ceil(diffDays / 7)}w`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const RESOURCE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  video: Play,
  link: ExternalLink,
  document: File,
  slides: Presentation,
};

function getResourceIcon(type: string) {
  const Icon = RESOURCE_ICONS[type.toLowerCase()] || File;
  return <Icon className="size-5" />;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<
    Map<string, { status: string; score: number | null }>
  >(new Map());
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    async function fetchData() {
      const [
        courseRes,
        enrollmentRes,
        modulesRes,
        assignmentsRes,
        announcementsRes,
        resourcesRes,
      ] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId).single(),
        supabase
          .from("enrollments")
          .select("grade, percentage")
          .eq("user_id", MAYA_ID)
          .eq("course_id", courseId)
          .single(),
        supabase
          .from("course_modules")
          .select("*")
          .eq("course_id", courseId)
          .order("week_number"),
        supabase
          .from("assignments")
          .select("id, title, type, due_date, points")
          .eq("course_id", courseId)
          .order("due_date"),
        supabase
          .from("course_announcements")
          .select("*, posted_by:posted_by(full_name)")
          .eq("course_id", courseId)
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false }),
        supabase
          .from("course_resources")
          .select("*")
          .eq("course_id", courseId),
      ]);

      if (courseRes.data) setCourse(courseRes.data);
      if (enrollmentRes.data) setEnrollment(enrollmentRes.data);
      if (modulesRes.data) setModules(modulesRes.data);
      if (assignmentsRes.data) setAssignments(assignmentsRes.data);
      if (announcementsRes.data) setAnnouncements(announcementsRes.data);
      if (resourcesRes.data) setResources(resourcesRes.data);

      // Fetch submissions for assignment status
      if (assignmentsRes.data && assignmentsRes.data.length > 0) {
        const assignmentIds = assignmentsRes.data.map((a: any) => a.id);
        const { data: subData } = await supabase
          .from("submissions")
          .select("assignment_id, status, score")
          .eq("user_id", MAYA_ID)
          .in("assignment_id", assignmentIds);

        if (subData) {
          const map = new Map<
            string,
            { status: string; score: number | null }
          >();
          subData.forEach((s: any) => {
            map.set(s.assignment_id, { status: s.status, score: s.score });
          });
          setSubmissions(map);
        }
      }

      setLoading(false);
    }

    fetchData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Back link skeleton */}
        <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-2 bg-muted rounded-full w-full animate-pulse" />
          <div className="h-8 bg-muted rounded-lg w-72 animate-pulse" />
          <div className="h-4 bg-muted rounded w-96 animate-pulse" />
        </div>
        {/* Tabs skeleton */}
        <div className="h-9 bg-muted rounded-lg w-[28rem] animate-pulse" />
        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-4">
        <Link
          href="/student/courses"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to courses
        </Link>
        <p className="text-foreground/50 text-sm">Course not found.</p>
      </div>
    );
  }

  const color = course.color || "blue";
  const grade = enrollment?.grade || "--";
  const percentage = enrollment?.percentage ?? 0;

  // Derive assignment statuses
  const now = new Date();
  const assignmentsWithStatus = assignments.map((a) => {
    const sub = submissions.get(a.id);
    let status: "upcoming" | "submitted" | "graded" = "upcoming";
    if (sub?.status === "graded") status = "graded";
    else if (sub?.status === "submitted") status = "submitted";
    return { ...a, status, score: sub?.score ?? null };
  });

  const upcoming = assignmentsWithStatus.filter(
    (a) => a.status === "upcoming"
  );
  const submitted = assignmentsWithStatus.filter(
    (a) => a.status === "submitted"
  );
  const graded = assignmentsWithStatus.filter((a) => a.status === "graded");

  const statusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-success/10 text-success border-0";
      case "draft":
        return "bg-warning/10 text-warning border-0";
      case "locked":
        return "bg-muted text-foreground/40 border-0";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8">
      {/* Back link */}
      <BlurFade delay={0}>
        <Link
          href="/student/courses"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/40 hover:text-foreground/60 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to courses
        </Link>
      </BlurFade>

      {/* Header */}
      <BlurFade delay={0.05}>
        <div className="space-y-4">
          {/* Gradient color bar */}
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${GRADIENT_FROM[color] || "from-primary/80"} ${GRADIENT_TO[color] || "to-primary/40"}`}
          />

          <div className="flex items-start justify-between gap-6">
            {/* Left: course info */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono text-sm font-medium ${TEXT_COLOR[color] || "text-primary"}`}
                >
                  {course.code}
                </span>
              </div>
              <h1 className="font-display text-3xl font-light tracking-tight">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                {/* Instructor */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      className={`text-[9px] font-medium ${TEXT_COLOR[color] || "text-primary"} bg-muted`}
                    >
                      {getInitials(course.instructor_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground/50">
                    {course.instructor_name}
                  </span>
                </div>
                {/* Schedule */}
                <div className="flex items-center gap-1.5 text-sm text-foreground/35">
                  <Clock className="size-3.5" />
                  <span className="font-mono text-xs">{course.schedule}</span>
                </div>
                {/* Room */}
                <div className="flex items-center gap-1.5 text-sm text-foreground/35">
                  <MapPin className="size-3.5" />
                  <span className="font-mono text-xs">{course.room}</span>
                </div>
                {/* Credits */}
                <Badge variant="outline" className="text-[10px]">
                  {course.credits} credits
                </Badge>
              </div>
            </div>

            {/* Right: grade card */}
            <Card className="flex-shrink-0 w-36">
              <CardContent className="p-4 text-center">
                <p className="text-[10px] font-medium uppercase tracking-widest text-foreground/35 mb-1">
                  Current Grade
                </p>
                <span
                  className={`text-4xl font-mono font-bold ${GRADE_COLORS[grade] || "text-foreground/40"}`}
                >
                  {grade}
                </span>
                <p className="font-mono text-sm text-foreground/45 mt-1">
                  {percentage.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </BlurFade>

      {/* Tabs */}
      <BlurFade delay={0.1}>
        <Tabs defaultValue={0}>
          <TabsList variant="line" className="mb-6">
            <TabsTrigger value={0}>Overview</TabsTrigger>
            <TabsTrigger value={1}>Modules</TabsTrigger>
            <TabsTrigger value={2}>Assignments</TabsTrigger>
            <TabsTrigger value={3}>Announcements</TabsTrigger>
            <TabsTrigger value={4}>Resources</TabsTrigger>
          </TabsList>

          {/* ── Tab 1: Overview ── */}
          <TabsContent value={0}>
            <BlurFade delay={0.12}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Description */}
                <Card className="lg:col-span-2 card-hover-glow">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-medium tracking-tight mb-3">
                      Course Description
                    </h3>
                    <p className="text-sm text-foreground/50 leading-relaxed">
                      {course.syllabus || course.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Instructor info */}
                <Card className="card-hover-glow">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-display text-lg font-medium tracking-tight">
                      Instructor
                    </h3>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback
                          className={`text-sm font-medium ${TEXT_COLOR[color] || "text-primary"} bg-muted`}
                        >
                          {getInitials(course.instructor_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {course.instructor_name}
                        </p>
                        <p className="text-xs text-foreground/40">
                          {course.instructor_email || "No email listed"}
                        </p>
                      </div>
                    </div>
                    {course.instructor_office_hours && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-1">
                          Office Hours
                        </p>
                        <p className="text-sm text-foreground/50">
                          {course.instructor_office_hours}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Schedule + Standing */}
                <Card className="card-hover-glow">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-display text-lg font-medium tracking-tight">
                      Schedule & Standing
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Clock className="size-4 text-foreground/30" />
                        <div>
                          <p className="text-sm">{course.schedule}</p>
                          <p className="text-xs text-foreground/35">
                            Day & Time
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="size-4 text-foreground/30" />
                        <div>
                          <p className="text-sm">{course.room}</p>
                          <p className="text-xs text-foreground/35">Room</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="size-4 text-foreground/30" />
                        <div>
                          <p className="text-sm">{course.credits} credits</p>
                          <p className="text-xs text-foreground/35">
                            Credit Hours
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground/45">
                          Current Grade
                        </span>
                        <span
                          className={`font-mono font-bold text-lg ${GRADE_COLORS[grade] || "text-foreground"}`}
                        >
                          {grade}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-foreground/45">
                          Percentage
                        </span>
                        <span className="font-mono text-sm text-foreground/60">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Tab 2: Modules ── */}
          <TabsContent value={1}>
            <BlurFade delay={0.12}>
              <div className="space-y-3">
                {modules.length === 0 ? (
                  <p className="text-sm text-foreground/30">
                    No modules available yet.
                  </p>
                ) : (
                  modules.map((mod, i) => {
                    // Gather resources for this module
                    const moduleResources = resources.filter(
                      (r) => r.module_id === mod.id
                    );

                    return (
                      <BlurFade
                        key={mod.id}
                        delay={0.14 + i * 0.04}
                        inView
                      >
                        <Collapsible>
                          <Card className="card-hover-glow">
                            <CollapsibleTrigger className="w-full text-left">
                              <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs text-foreground/30 w-14">
                                    Week {mod.week_number}
                                  </span>
                                  <h3 className="font-serif font-semibold text-sm">
                                    {mod.title}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={`text-[10px] capitalize ${statusBadgeClass(mod.status)}`}
                                  >
                                    {mod.status}
                                  </Badge>
                                  <ChevronDown className="size-4 text-foreground/30 transition-transform [[data-panel-open]_&]:rotate-180" />
                                </div>
                              </CardContent>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="px-5 pb-5 pt-0 space-y-3 border-t border-border/40 mt-0 pt-4">
                                {mod.description && (
                                  <p className="text-sm text-foreground/45 leading-relaxed">
                                    {mod.description}
                                  </p>
                                )}
                                {moduleResources.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35">
                                      Resources
                                    </p>
                                    {moduleResources.map((r) => (
                                      <div
                                        key={r.id}
                                        className="flex items-center gap-2 text-sm text-foreground/50"
                                      >
                                        {getResourceIcon(r.type)}
                                        <span>{r.title}</span>
                                        <Badge
                                          variant="outline"
                                          className="text-[9px] capitalize ml-auto"
                                        >
                                          {r.type}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Card>
                        </Collapsible>
                      </BlurFade>
                    );
                  })
                )}
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Tab 3: Assignments ── */}
          <TabsContent value={2}>
            <BlurFade delay={0.12}>
              <div className="space-y-8">
                {[
                  {
                    key: "upcoming",
                    label: "Upcoming",
                    items: upcoming,
                    emptyMsg: "No upcoming assignments",
                  },
                  {
                    key: "submitted",
                    label: "Submitted",
                    items: submitted,
                    emptyMsg: "Nothing awaiting review",
                  },
                  {
                    key: "graded",
                    label: "Graded",
                    items: graded,
                    emptyMsg: "No graded assignments yet",
                  },
                ].map((section, sectionIdx) => (
                  <div key={section.key} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-lg font-medium tracking-tight text-foreground/70">
                        {section.label}
                      </h3>
                      <span className="font-mono text-xs text-foreground/25">
                        {section.items.length}
                      </span>
                    </div>

                    {section.items.length === 0 ? (
                      <p className="text-sm text-foreground/30 pl-1">
                        {section.emptyMsg}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.items.map((a, i) => {
                          const due = new Date(a.due_date);
                          const diffDays = Math.ceil(
                            (due.getTime() - now.getTime()) /
                              (1000 * 60 * 60 * 24)
                          );
                          const isUrgent =
                            a.status === "upcoming" &&
                            diffDays >= 0 &&
                            diffDays <= 2;
                          const pct =
                            a.score !== null
                              ? Math.round((a.score / a.points) * 100)
                              : null;

                          return (
                            <BlurFade
                              key={a.id}
                              delay={
                                0.14 + sectionIdx * 0.06 + i * 0.03
                              }
                              inView
                            >
                              <Card
                                className={`card-hover-glow cursor-pointer h-full ${
                                  isUrgent
                                    ? "border-l-[3px] border-l-danger"
                                    : ""
                                }`}
                              >
                                <CardContent className="p-5">
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <h4 className="font-medium text-sm leading-snug">
                                      {a.title}
                                    </h4>
                                    <span className="font-mono text-xs text-foreground/35 flex-shrink-0">
                                      {a.points} pts
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] capitalize"
                                    >
                                      {a.type}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs text-foreground/35">
                                      {due.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}{" "}
                                      <span className="text-foreground/20">
                                        &middot;
                                      </span>{" "}
                                      {relativeTime(due)}
                                    </span>

                                    {isUrgent && (
                                      <span className="text-[10px] font-medium text-danger">
                                        Due soon
                                      </span>
                                    )}

                                    {a.status === "graded" &&
                                      a.score !== null && (
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`font-mono text-sm font-semibold ${pct! >= 90 ? "text-success" : pct! >= 80 ? "text-info" : pct! >= 70 ? "text-warning" : "text-danger"}`}
                                          >
                                            {a.score}/{a.points}
                                          </span>
                                          <span
                                            className={`font-mono text-[10px] ${pct! >= 90 ? "text-success" : pct! >= 80 ? "text-info" : pct! >= 70 ? "text-warning" : "text-danger"}`}
                                          >
                                            {pct}%
                                          </span>
                                        </div>
                                      )}

                                    {a.status === "submitted" && (
                                      <Badge className="text-[10px] border-0 bg-info/10 text-info">
                                        Submitted
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </BlurFade>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Tab 4: Announcements ── */}
          <TabsContent value={3}>
            <BlurFade delay={0.12}>
              <div className="space-y-3">
                {announcements.length === 0 ? (
                  <p className="text-sm text-foreground/30">
                    No announcements yet.
                  </p>
                ) : (
                  announcements.map((a, i) => (
                    <BlurFade key={a.id} delay={0.14 + i * 0.04} inView>
                      <Card
                        className={`card-hover-glow ${
                          a.pinned
                            ? "border-l-[3px] border-l-danger"
                            : ""
                        }`}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-serif font-semibold text-sm leading-snug">
                              {a.title}
                            </h3>
                            {a.pinned && (
                              <Badge className="text-[10px] border-0 bg-danger/10 text-danger flex items-center gap-1 flex-shrink-0">
                                <Pin className="size-3" />
                                Pinned
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground/45 leading-relaxed mb-3">
                            {a.content}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-foreground/30">
                            <span>
                              {a.posted_by?.full_name || "Instructor"}
                            </span>
                            <span className="text-border">&middot;</span>
                            <span className="font-mono">
                              {new Date(a.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </BlurFade>
                  ))
                )}
              </div>
            </BlurFade>
          </TabsContent>

          {/* ── Tab 5: Resources ── */}
          <TabsContent value={4}>
            <BlurFade delay={0.12}>
              {resources.length === 0 ? (
                <p className="text-sm text-foreground/30">
                  No resources available yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((r, i) => (
                    <BlurFade key={r.id} delay={0.14 + i * 0.04} inView>
                      <Card className="card-hover-glow cursor-pointer h-full">
                        <CardContent className="p-5 flex items-start gap-4">
                          <div
                            className={`flex-shrink-0 rounded-lg p-2.5 ${COLOR_MAP[color] || "bg-primary"}/10`}
                          >
                            <span
                              className={`${TEXT_COLOR[color] || "text-primary"}`}
                            >
                              {getResourceIcon(r.type)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm leading-snug mb-1 truncate">
                              {r.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className="text-[10px] capitalize"
                            >
                              {r.type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </BlurFade>
                  ))}
                </div>
              )}
            </BlurFade>
          </TabsContent>
        </Tabs>
      </BlurFade>
    </div>
  );
}
