"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Trash2, Search, Pin } from "lucide-react";

/* ---------- Constants ---------- */

const KIM_ID = "c1000000-0000-0000-0000-000000000001";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-info",
  green: "bg-success",
  purple: "bg-purple-600",
};

const GRADIENT_MAP: Record<string, string> = {
  blue: "from-info/80 to-info/40",
  green: "from-success/80 to-success/40",
  purple: "from-purple-600/80 to-purple-600/40",
};

const TEXT_COLOR: Record<string, string> = {
  blue: "text-info",
  green: "text-success",
  purple: "text-purple-600",
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

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-success/10", text: "text-success" },
  "At Risk": { bg: "bg-warning/10", text: "text-warning" },
  Probation: { bg: "bg-danger/10", text: "text-danger" },
};

const GRADE_DISTRIBUTION_COLORS: Record<string, string> = {
  A: "bg-success",
  "A-": "bg-success/70",
  "B+": "bg-info",
  B: "bg-info/70",
  "B-": "bg-warning",
  "C+": "bg-warning/70",
  C: "bg-danger/70",
  "D/F": "bg-danger",
};

/* ---------- Types ---------- */

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  color: string;
  schedule: string;
  room: string;
  credits: number;
}

interface Enrollment {
  grade: string;
  percentage: number;
  user_id: string;
  users: {
    id: string;
    full_name: string;
    email: string;
    status: string;
  };
}

interface Assignment {
  id: string;
  title: string;
  type: string;
  due_date: string;
  points: number;
  submission_count?: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  created_at: string;
  posted_by: string;
}

/* ---------- Demo Data ---------- */

const DEMO_COURSES: Record<string, Course> = {
  "e1000000-0000-0000-0000-000000000001": {
    id: "e1000000-0000-0000-0000-000000000001",
    code: "DS 310",
    title: "Machine Learning",
    description:
      "An introduction to the theory and practice of machine learning. Topics include supervised and unsupervised learning, neural networks, ensemble methods, and practical applications in data science.",
    color: "blue",
    schedule: "MWF 10:00-10:50",
    room: "Turing Hall 204",
    credits: 3,
  },
  "e1000000-0000-0000-0000-000000000002": {
    id: "e1000000-0000-0000-0000-000000000002",
    code: "DS 410",
    title: "Deep Learning",
    description:
      "Advanced deep learning architectures including CNNs, RNNs, transformers, and generative models. Emphasis on practical implementation and research applications.",
    color: "green",
    schedule: "TTh 13:00-14:20",
    room: "Babbage Lab 112",
    credits: 3,
  },
  "e1000000-0000-0000-0000-000000000003": {
    id: "e1000000-0000-0000-0000-000000000003",
    code: "DS 210",
    title: "Statistical Foundations",
    description:
      "Core statistical concepts for data science including probability, hypothesis testing, regression analysis, and Bayesian inference.",
    color: "purple",
    schedule: "MWF 11:00-11:50",
    room: "Turing Hall 108",
    credits: 3,
  },
};

const DEMO_ENROLLMENTS: Enrollment[] = [
  { grade: "A-", percentage: 91, user_id: "u1", users: { id: "u1", full_name: "Maya Rodriguez", email: "maya.rodriguez@lumiere.edu", status: "Active" } },
  { grade: "A", percentage: 95, user_id: "u2", users: { id: "u2", full_name: "James Chen", email: "james.chen@lumiere.edu", status: "Active" } },
  { grade: "B+", percentage: 87, user_id: "u3", users: { id: "u3", full_name: "Amara Okonkwo", email: "amara.okonkwo@lumiere.edu", status: "Active" } },
  { grade: "B", percentage: 83, user_id: "u4", users: { id: "u4", full_name: "Lucas Park", email: "lucas.park@lumiere.edu", status: "Active" } },
  { grade: "C+", percentage: 77, user_id: "u5", users: { id: "u5", full_name: "Sofia Almeida", email: "sofia.almeida@lumiere.edu", status: "At Risk" } },
  { grade: "B-", percentage: 80, user_id: "u6", users: { id: "u6", full_name: "Raj Patel", email: "raj.patel@lumiere.edu", status: "Active" } },
  { grade: "A", percentage: 96, user_id: "u7", users: { id: "u7", full_name: "Priya Sharma", email: "priya.sharma@lumiere.edu", status: "Active" } },
  { grade: "B+", percentage: 88, user_id: "u8", users: { id: "u8", full_name: "Daniel Kim", email: "daniel.kim@lumiere.edu", status: "Active" } },
];

const DEMO_ASSIGNMENTS: Assignment[] = [
  { id: "a1", title: "Homework 1: Linear Regression", type: "homework", due_date: "2026-02-10", points: 100, submission_count: 26 },
  { id: "a2", title: "Homework 2: Classification", type: "homework", due_date: "2026-02-24", points: 100, submission_count: 25 },
  { id: "a3", title: "Midterm Exam", type: "exam", due_date: "2026-03-10", points: 200, submission_count: 28 },
  { id: "a4", title: "Homework 3: Neural Networks", type: "homework", due_date: "2026-03-24", points: 100, submission_count: 24 },
  { id: "a5", title: "Project Proposal", type: "project", due_date: "2026-04-07", points: 50, submission_count: 23 },
  { id: "a6", title: "Homework 4: Ensemble Methods", type: "homework", due_date: "2026-04-14", points: 100, submission_count: 22 },
];

const DEMO_ANNOUNCEMENTS: Announcement[] = [
  { id: "an1", title: "Midterm Grades Posted", content: "Midterm grades are now available in the gradebook. The class average was 82%. Office hours this week are extended to discuss results.", pinned: true, created_at: "2026-03-15T14:00:00Z", posted_by: KIM_ID },
  { id: "an2", title: "Project Proposal Guidelines", content: "Please review the updated project proposal rubric on the course page. Proposals are due April 7th.", pinned: false, created_at: "2026-03-20T10:00:00Z", posted_by: KIM_ID },
  { id: "an3", title: "Guest Lecture: Dr. Sarah Lin", content: "We will have a guest lecture on reinforcement learning this Friday. Attendance is highly recommended.", pinned: false, created_at: "2026-04-01T09:00:00Z", posted_by: KIM_ID },
];

/* ---------- Helpers ---------- */

function getTypeColor(type: string): string {
  switch (type) {
    case "homework":
      return "bg-info/10 text-info";
    case "exam":
      return "bg-danger/10 text-danger";
    case "project":
      return "bg-purple-600/10 text-purple-600";
    case "quiz":
      return "bg-warning/10 text-warning";
    default:
      return "bg-muted text-foreground/60";
  }
}

function getStudentStatus(percentage: number): string {
  if (percentage < 70) return "At Risk";
  if (percentage < 75) return "Probation";
  return "Active";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ---------- Page Component ---------- */

export default function StaffCourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Roster search
  const [rosterSearch, setRosterSearch] = useState("");

  // Announcement compose
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [posting, setPosting] = useState(false);

  /* ---------- Data fetching ---------- */

  useEffect(() => {
    async function load() {
      const [courseRes, enrollRes, assignRes, announceRes] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId).single(),
        supabase
          .from("enrollments")
          .select(
            "grade, percentage, user_id, users:user_id(id, full_name, email, status)"
          )
          .eq("course_id", courseId),
        supabase
          .from("assignments")
          .select("id, title, type, due_date, points")
          .eq("course_id", courseId)
          .order("due_date", { ascending: true }),
        supabase
          .from("course_announcements")
          .select("*")
          .eq("course_id", courseId)
          .order("created_at", { ascending: false }),
      ]);

      // Course
      if (courseRes.data) {
        setCourse(courseRes.data as Course);
      } else {
        setCourse(DEMO_COURSES[courseId] || DEMO_COURSES["e1000000-0000-0000-0000-000000000001"]);
      }

      // Enrollments
      if (enrollRes.data && enrollRes.data.length > 0) {
        setEnrollments(enrollRes.data as unknown as Enrollment[]);
      } else {
        setEnrollments(DEMO_ENROLLMENTS);
      }

      // Assignments
      if (assignRes.data && assignRes.data.length > 0) {
        // Fetch submission counts per assignment
        const assignsWithCounts = await Promise.all(
          assignRes.data.map(async (a: any) => {
            const { count } = await supabase
              .from("submissions")
              .select("id", { count: "exact", head: true })
              .eq("assignment_id", a.id);
            return { ...a, submission_count: count || 0 };
          })
        );
        setAssignments(assignsWithCounts as Assignment[]);
      } else {
        setAssignments(DEMO_ASSIGNMENTS);
      }

      // Announcements
      if (announceRes.data && announceRes.data.length > 0) {
        setAnnouncements(announceRes.data as Announcement[]);
      } else {
        setAnnouncements(DEMO_ANNOUNCEMENTS);
      }

      setLoading(false);
    }
    load();
  }, [courseId]);

  /* ---------- Announcement handlers ---------- */

  async function handlePostAnnouncement() {
    if (!announcementTitle.trim() || !announcementContent.trim()) return;
    setPosting(true);

    const { data, error } = await supabase
      .from("course_announcements")
      .insert({
        course_id: courseId,
        posted_by: KIM_ID,
        title: announcementTitle.trim(),
        content: announcementContent.trim(),
      })
      .select()
      .single();

    if (data && !error) {
      setAnnouncements((prev) => [data as Announcement, ...prev]);
    } else {
      // Optimistic fallback
      const newAnnouncement: Announcement = {
        id: `temp-${Date.now()}`,
        title: announcementTitle.trim(),
        content: announcementContent.trim(),
        pinned: false,
        created_at: new Date().toISOString(),
        posted_by: KIM_ID,
      };
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    }

    setAnnouncementTitle("");
    setAnnouncementContent("");
    setPosting(false);
  }

  async function handleDeleteAnnouncement(id: string) {
    await supabase.from("course_announcements").delete().eq("id", id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  /* ---------- Derived data ---------- */

  const enrolledCount = enrollments.length;
  const totalAssignments = assignments.length;

  const avgGrade =
    enrollments.length > 0
      ? (
          enrollments.reduce((s, e) => s + (e.percentage || 0), 0) /
          enrollments.length
        ).toFixed(1)
      : "--";

  const completionRate =
    enrollments.length > 0
      ? Math.round(
          (enrollments.filter((e) => (e.percentage || 0) >= 60).length /
            enrollments.length) *
            100
        )
      : 0;

  // Roster filtering
  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.users.full_name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      e.users.email.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  // Sorted announcements (pinned first)
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  // Grade distribution for analytics
  const gradeDistribution = (() => {
    const buckets: Record<string, number> = {
      A: 0,
      "A-": 0,
      "B+": 0,
      B: 0,
      "B-": 0,
      "C+": 0,
      C: 0,
      "D/F": 0,
    };
    enrollments.forEach((e) => {
      const g = e.grade;
      if (g === "A+" || g === "A") buckets["A"]++;
      else if (g === "A-") buckets["A-"]++;
      else if (g === "B+") buckets["B+"]++;
      else if (g === "B") buckets["B"]++;
      else if (g === "B-") buckets["B-"]++;
      else if (g === "C+") buckets["C+"]++;
      else if (g === "C" || g === "C-") buckets["C"]++;
      else buckets["D/F"]++;
    });
    const total = enrollments.length || 1;
    return Object.entries(buckets).map(([grade, count]) => ({
      grade,
      count,
      pct: Math.round((count / total) * 100),
      color: GRADE_DISTRIBUTION_COLORS[grade] || "bg-muted",
    }));
  })();

  // At-risk students
  const atRiskStudents = enrollments.filter(
    (e) => (e.percentage || 0) < 75
  );

  /* ---------- Loading skeleton ---------- */

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-5 bg-muted rounded w-36 animate-pulse" />
        <div className="h-2 bg-muted rounded-full w-full animate-pulse" />
        <div className="space-y-2">
          <div className="h-9 bg-muted rounded-lg w-64 animate-pulse" />
          <div className="h-4 bg-muted rounded w-48 animate-pulse" />
        </div>
        <div className="h-10 bg-muted rounded-lg w-full animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-foreground/30 text-sm">Course not found.</p>
        <Link
          href="/staff/courses"
          className="text-primary text-sm mt-4 inline-block hover:underline"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  /* ---------- Render ---------- */

  return (
    <div className="space-y-6">
      {/* Back link */}
      <BlurFade delay={0}>
        <Link
          href="/staff/courses"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/40 hover:text-foreground/70 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to courses
        </Link>
      </BlurFade>

      {/* Color bar */}
      <BlurFade delay={0.04}>
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${
            GRADIENT_MAP[course.color] || "from-primary/80 to-primary/40"
          }`}
        />
      </BlurFade>

      {/* Header */}
      <BlurFade delay={0.08}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <p
              className={`font-mono text-xs font-medium mb-1 ${
                TEXT_COLOR[course.color] || "text-primary"
              }`}
            >
              {course.code}
            </p>
            <h1 className="font-display text-3xl font-light text-navy dark:text-foreground tracking-tight">
              {course.title}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-foreground/40">
              <span className="font-mono text-xs">{course.schedule}</span>
              <span className="text-border">|</span>
              <span className="font-mono text-xs">{course.room}</span>
              <span className="text-border">|</span>
              <Badge
                variant="outline"
                className="text-[10px] font-mono"
              >
                {course.credits} credits
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" disabled>
              Edit Course
            </Button>
            <Badge
              className={`text-xs font-mono ${
                COLOR_MAP[course.color] || "bg-primary"
              } text-white`}
            >
              {enrolledCount} enrolled
            </Badge>
          </div>
        </div>
      </BlurFade>

      {/* Tabs */}
      <BlurFade delay={0.12}>
        <Tabs defaultValue={0}>
          <TabsList variant="line">
            <TabsTrigger value={0}>Overview</TabsTrigger>
            <TabsTrigger value={1}>Roster</TabsTrigger>
            <TabsTrigger value={2}>Assignments</TabsTrigger>
            <TabsTrigger value={3}>Announcements</TabsTrigger>
            <TabsTrigger value={4}>Analytics</TabsTrigger>
          </TabsList>

          {/* ===== Tab 1: Overview ===== */}
          <TabsContent value={0} className="mt-6 space-y-6">
            {/* Description */}
            <BlurFade delay={0.14}>
              <Card className="card-hover-glow">
                <CardContent className="pt-5">
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {course.description ||
                      "No course description available."}
                  </p>
                </CardContent>
              </Card>
            </BlurFade>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  label: "Enrolled Students",
                  value: enrolledCount,
                  ticker: true,
                },
                {
                  label: "Avg Grade",
                  value: avgGrade,
                  suffix: "%",
                  ticker: true,
                  dec: 1,
                },
                {
                  label: "Completion Rate",
                  value: completionRate,
                  suffix: "%",
                  ticker: true,
                },
              ].map(({ label, value, suffix, ticker, dec }, i) => (
                <BlurFade key={label} delay={0.16 + i * 0.04} inView>
                  <Card className="card-hover-glow">
                    <CardContent className="pt-5 pb-4">
                      <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
                        {label}
                      </p>
                      <div className="flex items-baseline gap-0.5">
                        {ticker && typeof value === "number" ? (
                          <NumberTicker
                            value={value}
                            decimalPlaces={dec || 0}
                            delay={0.3}
                            className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
                          />
                        ) : (
                          <span className="text-[1.7rem] font-mono font-semibold text-foreground leading-none">
                            {value}
                          </span>
                        )}
                        {suffix && (
                          <span className="text-foreground/30 text-lg font-mono">
                            {suffix}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>

            {/* Schedule info */}
            <BlurFade delay={0.28} inView>
              <Card className="card-hover-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-lg">
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-foreground/35 mb-1">
                        Days & Time
                      </p>
                      <p className="font-mono text-xs">{course.schedule}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-foreground/35 mb-1">
                        Room
                      </p>
                      <p className="font-mono text-xs">{course.room}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-foreground/35 mb-1">
                        Credits
                      </p>
                      <p className="font-mono text-xs">{course.credits}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>

            {/* Quick actions */}
            <BlurFade delay={0.32} inView>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Post Announcement
                </Button>
                <Button variant="outline" size="sm">
                  View Gradebook
                </Button>
                <Button variant="outline" size="sm">
                  Export Roster
                </Button>
              </div>
            </BlurFade>
          </TabsContent>

          {/* ===== Tab 2: Roster ===== */}
          <TabsContent value={1} className="mt-6 space-y-6">
            {/* Search */}
            <BlurFade delay={0.14}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
                <Input
                  placeholder="Search students by name or email..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </BlurFade>

            {/* Student cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEnrollments.map((enrollment, i) => {
                const student = enrollment.users;
                const initials = (student.full_name ?? "")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2);
                const status = getStudentStatus(enrollment.percentage);
                const statusStyle =
                  STATUS_STYLES[status] || STATUS_STYLES.Active;

                return (
                  <BlurFade
                    key={student.id || student.email}
                    delay={0.14 + i * 0.04}
                    inView
                  >
                    <Card className="card-hover-glow h-full">
                      <CardContent className="p-6">
                        {/* Top row */}
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-primary/8 text-primary font-medium">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {student.full_name}
                            </p>
                            <p className="font-mono text-xs text-foreground/30 truncate">
                              {student.email}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] border-0 flex-shrink-0 ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            {status}
                          </Badge>
                        </div>

                        <div className="gradient-divider mb-4" />

                        {/* Grade */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono text-xs text-foreground/40">
                              {enrollment.percentage
                                ? `${enrollment.percentage}%`
                                : "--"}
                            </p>
                          </div>
                          <span
                            className={`font-mono text-2xl font-bold ${
                              GRADE_COLORS[enrollment.grade] ||
                              "text-foreground"
                            }`}
                          >
                            {enrollment.grade || "--"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </BlurFade>
                );
              })}
            </div>

            {filteredEnrollments.length === 0 && (
              <div className="text-center py-16">
                <p className="text-foreground/30 text-sm">
                  No students match your search.
                </p>
              </div>
            )}
          </TabsContent>

          {/* ===== Tab 3: Assignments ===== */}
          <TabsContent value={2} className="mt-6 space-y-5">
            {assignments.map((assignment, i) => (
              <BlurFade key={assignment.id} delay={0.14 + i * 0.04} inView>
                <Card className="card-hover-glow">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-medium text-sm truncate">
                            {assignment.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-[10px] border-0 capitalize ${getTypeColor(
                              assignment.type
                            )}`}
                          >
                            {assignment.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-foreground/40">
                          <span className="font-mono">
                            Due {formatDate(assignment.due_date)}
                          </span>
                          <span className="text-border">|</span>
                          <span className="font-mono">
                            {assignment.points} pts
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-mono text-sm font-semibold">
                            {assignment.submission_count ?? 0}/
                            {enrolledCount}
                          </p>
                          <p className="text-[10px] text-foreground/35">
                            submitted
                          </p>
                        </div>
                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted">
                          <span className="font-mono text-[10px] text-foreground/50">
                            {enrolledCount > 0
                              ? Math.round(
                                  ((assignment.submission_count ?? 0) /
                                    enrolledCount) *
                                    100
                                )
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            ))}

            {assignments.length === 0 && (
              <div className="text-center py-16">
                <p className="text-foreground/30 text-sm">
                  No assignments yet.
                </p>
              </div>
            )}
          </TabsContent>

          {/* ===== Tab 4: Announcements ===== */}
          <TabsContent value={3} className="mt-6 space-y-6">
            {/* Compose form */}
            <BlurFade delay={0.14}>
              <Card className="card-hover-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="font-serif text-lg">
                    New Announcement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Announcement title..."
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Write your announcement..."
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handlePostAnnouncement}
                      disabled={
                        posting ||
                        !announcementTitle.trim() ||
                        !announcementContent.trim()
                      }
                      size="sm"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      {posting ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>

            {/* Existing announcements */}
            {sortedAnnouncements.map((announcement, i) => (
              <BlurFade
                key={announcement.id}
                delay={0.18 + i * 0.04}
                inView
              >
                <Card className="card-hover-glow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          {announcement.pinned && (
                            <Pin className="h-3 w-3 text-warning flex-shrink-0" />
                          )}
                          <h3 className="font-medium text-sm">
                            {announcement.title}
                          </h3>
                          {announcement.pinned && (
                            <Badge
                              variant="outline"
                              className="text-[10px] border-0 bg-warning/10 text-warning"
                            >
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground/50 leading-relaxed mb-2">
                          {announcement.content}
                        </p>
                        <p className="text-[10px] font-mono text-foreground/30">
                          {formatTimestamp(announcement.created_at)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() =>
                          handleDeleteAnnouncement(announcement.id)
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5 text-foreground/30 hover:text-danger" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            ))}

            {sortedAnnouncements.length === 0 && (
              <div className="text-center py-16">
                <p className="text-foreground/30 text-sm">
                  No announcements yet. Post one above.
                </p>
              </div>
            )}
          </TabsContent>

          {/* ===== Tab 5: Analytics ===== */}
          <TabsContent value={4} className="mt-6 space-y-6">
            <div className="grid grid-cols-12 gap-5">
              {/* Grade Distribution */}
              <BlurFade
                delay={0.14}
                inView
                className="col-span-12 lg:col-span-8"
              >
                <Card className="card-hover-glow h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-lg">
                      Grade Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-3 h-48 mb-4">
                      {gradeDistribution.map(({ grade, pct, color }) => (
                        <div
                          key={grade}
                          className="flex-1 flex flex-col items-center gap-2"
                        >
                          <span className="font-mono text-[10px] text-foreground/40">
                            {pct}%
                          </span>
                          <div
                            className="w-full relative"
                            style={{
                              height: `${Math.max(
                                (pct / (Math.max(...gradeDistribution.map((g) => g.pct)) || 1)) * 100,
                                4
                              )}%`,
                            }}
                          >
                            <div
                              className={`absolute inset-0 ${color} rounded-t-md`}
                            />
                          </div>
                          <span className="font-mono text-xs text-foreground/50">
                            {grade}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 pt-3 border-t border-border/30">
                      <span className="text-xs text-foreground/40">
                        Class average:
                      </span>
                      <span className="font-mono text-sm font-semibold">
                        {avgGrade}%
                      </span>
                      <span className="text-xs text-foreground/40">
                        &middot;
                      </span>
                      <span className="text-xs text-foreground/40">
                        {enrolledCount} students
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>

              {/* At-Risk Students */}
              <BlurFade
                delay={0.18}
                inView
                className="col-span-12 lg:col-span-4"
              >
                <Card className="card-hover-glow h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-lg">
                      At-Risk Students
                      <span className="ml-2 font-mono text-xs font-normal text-danger">
                        {atRiskStudents.length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {atRiskStudents.length > 0 ? (
                      atRiskStudents.map((e) => {
                        const isHigh = (e.percentage || 0) < 70;
                        return (
                          <div
                            key={e.user_id}
                            className={`p-3.5 rounded-lg transition-colors ${
                              isHigh
                                ? "bg-danger/[0.04] hover:bg-danger/[0.07]"
                                : "bg-muted/30 hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">
                                {e.users.full_name}
                              </span>
                              <span
                                className={`font-mono text-sm font-bold ${
                                  (e.percentage || 0) < 70
                                    ? "text-danger"
                                    : "text-warning"
                                }`}
                              >
                                {e.percentage}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isHigh ? "bg-danger" : "bg-warning"
                                }`}
                              />
                              <span className="text-xs text-foreground/40">
                                {isHigh
                                  ? "Below passing threshold"
                                  : "Below target threshold"}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-foreground/30 py-4 text-center">
                        No at-risk students
                      </p>
                    )}
                  </CardContent>
                </Card>
              </BlurFade>

              {/* Submission Rate per Assignment */}
              <BlurFade
                delay={0.22}
                inView
                className="col-span-12"
              >
                <Card className="card-hover-glow">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-lg">
                      Submission Rates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {assignments.map(({ id, title, submission_count }) => {
                      const pct =
                        enrolledCount > 0
                          ? Math.round(
                              ((submission_count ?? 0) / enrolledCount) * 100
                            )
                          : 0;
                      return (
                        <div key={id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">{title}</span>
                            <span className="font-mono text-xs text-foreground/35">
                              {submission_count ?? 0}/{enrolledCount}
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-700"
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
            </div>
          </TabsContent>
        </Tabs>
      </BlurFade>
    </div>
  );
}
