"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";
const MAYA_COURSES = [
  "e1000000-0000-0000-0000-000000000001",
  "e1000000-0000-0000-0000-000000000002",
  "e1000000-0000-0000-0000-000000000003",
  "e1000000-0000-0000-0000-000000000005",
];

const COURSE_COLOR: Record<string, string> = {
  "CS 124": "text-info",
  "MATH 55": "text-success",
  "PHIL 177": "text-purple-600",
  "ECON 101": "text-warning",
  "STAT 110": "text-pink-600",
};

interface Assignment {
  id: string;
  title: string;
  type: string;
  due_date: string;
  points: number;
  course_code: string;
  status: "upcoming" | "submitted" | "graded";
  score: number | null;
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

function gradeColor(pct: number): string {
  if (pct >= 90) return "text-success";
  if (pct >= 80) return "text-info";
  if (pct >= 70) return "text-warning";
  return "text-danger";
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      // Fetch assignments with course codes
      const { data: assignmentData } = await supabase
        .from("assignments")
        .select("id, title, type, due_date, points, courses(code)")
        .in("course_id", MAYA_COURSES)
        .order("due_date", { ascending: true });

      // Fetch submissions for Maya
      const { data: submissionData } = await supabase
        .from("submissions")
        .select("assignment_id, status, score")
        .eq("user_id", MAYA_ID);

      if (assignmentData) {
        const submissionMap = new Map<string, { status: string; score: number | null }>();
        if (submissionData) {
          submissionData.forEach((s: any) => {
            submissionMap.set(s.assignment_id, { status: s.status, score: s.score });
          });
        }

        const now = new Date();
        setAssignments(
          assignmentData.map((a: any) => {
            const sub = submissionMap.get(a.id);
            let status: "upcoming" | "submitted" | "graded" = "upcoming";
            if (sub?.status === "graded") status = "graded";
            else if (sub?.status === "submitted") status = "submitted";
            else if (new Date(a.due_date) <= now) status = "upcoming";

            return {
              id: a.id,
              title: a.title,
              type: a.type,
              due_date: a.due_date,
              points: a.points,
              course_code: a.courses?.code || "",
              status,
              score: sub?.score ?? null,
            };
          })
        );
      }
      setLoading(false);
    }
    fetchAssignments();
  }, []);

  const upcoming = assignments.filter((a) => a.status === "upcoming");
  const submitted = assignments.filter((a) => a.status === "submitted");
  const graded = assignments.filter((a) => a.status === "graded");

  const uniqueCourses = new Set(assignments.map((a) => a.course_code)).size;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-9 bg-muted rounded-lg w-44 animate-pulse" />
          <div className="h-4 bg-muted rounded w-56 animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-28 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-24 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const sections: {
    key: string;
    label: string;
    items: Assignment[];
    emptyMsg: string;
  }[] = [
    { key: "upcoming", label: "Upcoming", items: upcoming, emptyMsg: "No upcoming assignments" },
    { key: "submitted", label: "Submitted", items: submitted, emptyMsg: "Nothing awaiting review" },
    { key: "graded", label: "Graded", items: graded, emptyMsg: "No graded assignments yet" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl font-light tracking-tight">Assignments</h1>
        <p className="text-foreground/40 text-sm mt-1">
          {assignments.length} assignments across {uniqueCourses} courses
        </p>
      </BlurFade>

      {/* Status groups */}
      {sections.map((section, sectionIdx) => (
        <div key={section.key} className="space-y-4">
          <BlurFade delay={0.06 + sectionIdx * 0.08}>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-medium tracking-tight text-foreground/70">
                {section.label}
              </h2>
              <span className="font-mono text-xs text-foreground/25">{section.items.length}</span>
            </div>
          </BlurFade>

          {section.items.length === 0 ? (
            <BlurFade delay={0.1 + sectionIdx * 0.08}>
              <p className="text-sm text-foreground/30 pl-1">{section.emptyMsg}</p>
            </BlurFade>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((a, i) => {
                const due = new Date(a.due_date);
                const now = new Date();
                const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = a.status === "upcoming" && diffDays >= 0 && diffDays <= 2;
                const pct = a.score !== null ? Math.round((a.score / a.points) * 100) : null;

                return (
                  <BlurFade key={a.id} delay={0.1 + sectionIdx * 0.08 + i * 0.04} inView>
                    <Card
                      className={`card-hover-glow cursor-pointer h-full ${
                        isUrgent ? "border-l-[3px] border-l-danger" : ""
                      }`}
                    >
                      <CardContent className="p-5">
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-medium text-sm leading-snug">{a.title}</h3>
                          <span className="font-mono text-xs text-foreground/35 flex-shrink-0">
                            {a.points} pts
                          </span>
                        </div>

                        {/* Course code + type badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className={`font-mono text-xs font-medium ${COURSE_COLOR[a.course_code] || "text-foreground/50"}`}
                          >
                            {a.course_code}
                          </span>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {a.type}
                          </Badge>
                        </div>

                        {/* Due date + urgent flag */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-foreground/35">
                            {due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                            <span className="text-foreground/20">&middot;</span>{" "}
                            {relativeTime(due)}
                          </span>

                          {isUrgent && (
                            <span className="text-[10px] font-medium text-danger">Due soon</span>
                          )}

                          {/* Graded score */}
                          {a.status === "graded" && a.score !== null && (
                            <div className="flex items-center gap-2">
                              <span className={`font-mono text-sm font-semibold ${gradeColor(pct!)}`}>
                                {a.score}/{a.points}
                              </span>
                              <span className={`font-mono text-[10px] ${gradeColor(pct!)}`}>
                                {pct}%
                              </span>
                            </div>
                          )}

                          {/* Submitted indicator */}
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
  );
}
