"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const KIM_ID = "c1000000-0000-0000-0000-000000000001";

const GRADE_COLORS: Record<string, string> = {
  "A+": "text-success", "A": "text-success", "A-": "text-success",
  "B+": "text-info", "B": "text-info", "B-": "text-info",
  "C+": "text-warning", "C": "text-warning", "C-": "text-warning",
  "D": "text-danger", "F": "text-danger",
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-success/10", text: "text-success" },
  Probation: { bg: "bg-warning/10", text: "text-warning" },
  "At Risk": { bg: "bg-danger/10", text: "text-danger" },
};

interface Student {
  name: string;
  email: string;
  course: string;
  grade: string;
  status: string;
}

const DEMO_STUDENTS: Student[] = [
  { name: "Maya Rodriguez", email: "maya.rodriguez@lumiere.edu", course: "DS 310", grade: "A-", status: "Active" },
  { name: "James Chen", email: "james.chen@lumiere.edu", course: "DS 310", grade: "A", status: "Active" },
  { name: "Amara Okonkwo", email: "amara.okonkwo@lumiere.edu", course: "DS 310", grade: "B+", status: "Active" },
  { name: "Lucas Park", email: "lucas.park@lumiere.edu", course: "DS 410", grade: "B", status: "Active" },
  { name: "Sofia Almeida", email: "sofia.almeida@lumiere.edu", course: "DS 310", grade: "C+", status: "At Risk" },
  { name: "Raj Patel", email: "raj.patel@lumiere.edu", course: "DS 210", grade: "B-", status: "Probation" },
];

export default function RosterPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    async function load() {
      // Attempt real data fetch
      const { data } = await supabase
        .from("enrollments")
        .select("grade, percentage, users(full_name, email), courses!inner(code, instructor_id)")
        .eq("courses.instructor_id", KIM_ID);
      if (data && data.length > 0) {
        setStudents(
          data.map((e: any) => ({
            name: e.users?.full_name || "Unknown",
            email: e.users?.email || "",
            course: e.courses?.code || "",
            grade: e.grade || "—",
            status: (e.percentage ?? 100) < 75 ? "At Risk" : "Active",
          }))
        );
      } else {
        setStudents(DEMO_STUDENTS);
      }
      setLoading(false);
    }
    load();
  }, []);

  const courses = ["All", ...Array.from(new Set(students.map((s) => s.course)))];
  const filtered = filter === "All" ? students : students.filter((s) => s.course === filter);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="h-80 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">Student Roster</h1>
        <p className="text-foreground/40 text-sm mt-1">{students.length} students across all courses</p>
      </BlurFade>

      {/* Course filter tabs */}
      <BlurFade delay={0.1}>
        <div className="flex gap-2 flex-wrap">
          {courses.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                filter === c
                  ? "bg-primary text-white"
                  : "bg-muted/50 text-foreground/50 hover:bg-muted hover:text-foreground/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </BlurFade>

      {/* Roster table */}
      <BlurFade delay={0.15}>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35">Student</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35">Email</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35">Course</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35 text-center">Grade</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => {
                const initials = student.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
                const statusStyle = STATUS_STYLES[student.status] || STATUS_STYLES.Active;

                return (
                  <TableRow key={student.email} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-[10px] bg-primary/8 text-primary">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-foreground/50">{student.email}</TableCell>
                    <TableCell className="font-mono text-xs font-medium">{student.course}</TableCell>
                    <TableCell className="text-center">
                      <span className={`font-mono text-sm font-bold ${GRADE_COLORS[student.grade] || "text-foreground"}`}>
                        {student.grade}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] border-0 ${statusStyle.bg} ${statusStyle.text}`}>
                        {student.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </BlurFade>
    </div>
  );
}
