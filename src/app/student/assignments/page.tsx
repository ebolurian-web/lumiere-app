"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const MAYA_COURSES = [
  "e1000000-0000-0000-0000-000000000001",
  "e1000000-0000-0000-0000-000000000002",
  "e1000000-0000-0000-0000-000000000003",
  "e1000000-0000-0000-0000-000000000005",
];

interface Assignment {
  id: string; title: string; type: string; due_date: string; points: number;
  course: { code: string };
  submission?: { status: string; score: number | null };
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("assignments")
        .select("id, title, type, due_date, points, courses(code)")
        .in("course_id", MAYA_COURSES)
        .order("due_date", { ascending: true });
      if (data) {
        setAssignments(data.map((a: any) => ({ ...a, course: a.courses })));
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const statusForAssignment = (a: Assignment) => {
    const due = new Date(a.due_date);
    const now = new Date();
    const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil < 0) return { label: "Past due", color: "text-danger bg-danger/10" };
    if (daysUntil <= 2) return { label: "Due soon", color: "text-warning bg-warning/10" };
    return { label: "Upcoming", color: "text-foreground/40 bg-muted" };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">Assignments</h1>
        <p className="text-foreground/40 text-sm mt-1">{assignments.length} assignments across {new Set(assignments.map(a => a.course.code)).size} courses</p>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35">Assignment</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35">Course</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35">Type</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35">Due Date</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35 text-right">Points</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((a) => {
                const status = statusForAssignment(a);
                const due = new Date(a.due_date);
                return (
                  <TableRow key={a.id} className="hover:bg-muted/20 cursor-pointer transition-colors">
                    <TableCell className="font-medium text-sm">{a.title}</TableCell>
                    <TableCell className="font-mono text-xs text-foreground/50">{a.course.code}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize">{a.type}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-foreground/50">
                      {due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-foreground/50 text-right">{a.points}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={`text-[10px] border-0 ${status.color}`}>{status.label}</Badge>
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
