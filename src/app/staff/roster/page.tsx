"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";

const KIM_ID = "c1000000-0000-0000-0000-000000000001";

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

const COURSE_COLORS: Record<string, string> = {
  "DS 310": "text-info",
  "DS 410": "text-success",
  "DS 210": "text-purple-600",
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-success/10", text: "text-success" },
  "At Risk": { bg: "bg-warning/10", text: "text-warning" },
  Probation: { bg: "bg-danger/10", text: "text-danger" },
};

interface Student {
  name: string;
  email: string;
  course: string;
  year: string;
  grade: string;
  status: string;
}

const DEMO_STUDENTS: Student[] = [
  { name: "Maya Rodriguez", email: "maya.rodriguez@lumiere.edu", course: "DS 310", year: "Junior", grade: "A-", status: "Active" },
  { name: "James Chen", email: "james.chen@lumiere.edu", course: "DS 310", year: "Senior", grade: "A", status: "Active" },
  { name: "Amara Okonkwo", email: "amara.okonkwo@lumiere.edu", course: "DS 310", year: "Junior", grade: "B+", status: "Active" },
  { name: "Lucas Park", email: "lucas.park@lumiere.edu", course: "DS 410", year: "Senior", grade: "B", status: "Active" },
  { name: "Sofia Almeida", email: "sofia.almeida@lumiere.edu", course: "DS 310", year: "Sophomore", grade: "C+", status: "At Risk" },
  { name: "Raj Patel", email: "raj.patel@lumiere.edu", course: "DS 210", year: "Junior", grade: "B-", status: "Probation" },
];

export default function RosterPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("enrollments")
        .select(
          "grade, percentage, users(full_name, email), courses!inner(code, instructor_id)"
        )
        .eq("courses.instructor_id", KIM_ID);
      if (data && data.length > 0) {
        setStudents(
          data.map((e: any) => ({
            name: e.users?.full_name || "Unknown",
            email: e.users?.email || "",
            course: e.courses?.code || "",
            year: "Junior",
            grade: e.grade || "--",
            status:
              (e.percentage ?? 100) < 70
                ? "At Risk"
                : (e.percentage ?? 100) < 75
                ? "Probation"
                : "Active",
          }))
        );
      } else {
        setStudents(DEMO_STUDENTS);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
  );

  const uniqueCourses = new Set(students.map((s) => s.course));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-9 bg-muted rounded-lg w-52 animate-pulse" />
          <div className="h-4 bg-muted rounded w-40 animate-pulse" />
        </div>
        <div className="h-10 bg-muted rounded-lg w-full animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          Student Roster
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {students.length} students across {uniqueCourses.size} courses
        </p>
      </BlurFade>

      {/* Search bar */}
      <BlurFade delay={0.08}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
          <Input
            placeholder="Search students by name, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </BlurFade>

      {/* Student cards - 3-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((student, i) => {
          const initials = student.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);
          const statusStyle =
            STATUS_STYLES[student.status] || STATUS_STYLES.Active;

          return (
            <BlurFade key={student.email} delay={0.1 + i * 0.04} inView>
              <Card className="card-hover-glow cursor-pointer h-full">
                <CardContent className="p-6">
                  {/* Top row: Avatar + name + status badge */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-primary/8 text-primary font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {student.name}
                      </p>
                      <p className="font-mono text-xs text-foreground/30 truncate">
                        {student.email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] border-0 flex-shrink-0 ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {student.status}
                    </Badge>
                  </div>

                  {/* Divider */}
                  <div className="gradient-divider mb-4" />

                  {/* Details row */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                      <p
                        className={`font-mono text-xs font-medium ${
                          COURSE_COLORS[student.course] || "text-primary"
                        }`}
                      >
                        {student.course}
                      </p>
                      <p className="text-xs text-foreground/40">
                        {student.year}
                      </p>
                    </div>

                    {/* Grade - large, color-coded */}
                    <span
                      className={`font-mono text-2xl font-bold ${
                        GRADE_COLORS[student.grade] || "text-foreground"
                      }`}
                    >
                      {student.grade}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <BlurFade delay={0.1}>
          <div className="text-center py-16">
            <p className="text-foreground/30 text-sm">
              No students match your search.
            </p>
          </div>
        </BlurFade>
      )}
    </div>
  );
}
