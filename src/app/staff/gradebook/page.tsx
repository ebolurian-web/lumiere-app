"use client";

import { useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const ASSIGNMENTS = [
  { key: "hw1", name: "HW 1", max: 100 },
  { key: "hw2", name: "HW 2", max: 100 },
  { key: "hw3", name: "HW 3", max: 100 },
  { key: "midterm", name: "Midterm", max: 100 },
  { key: "project", name: "Project", max: 100 },
  { key: "hw4", name: "HW 4", max: 100 },
  { key: "final", name: "Final", max: 100 },
];

interface StudentGrades {
  name: string;
  scores: Record<string, number | null>;
}

const DEMO_GRADEBOOK: StudentGrades[] = [
  { name: "Maya Rodriguez", scores: { hw1: 95, hw2: 92, hw3: 88, midterm: 91, project: 94, hw4: 90, final: null } },
  { name: "James Chen", scores: { hw1: 98, hw2: 96, hw3: 94, midterm: 95, project: 97, hw4: 93, final: null } },
  { name: "Amara Okonkwo", scores: { hw1: 88, hw2: 85, hw3: 90, midterm: 87, project: 91, hw4: 86, final: null } },
  { name: "Lucas Park", scores: { hw1: 82, hw2: 79, hw3: 84, midterm: 80, project: 85, hw4: 81, final: null } },
  { name: "Sofia Almeida", scores: { hw1: 72, hw2: 68, hw3: 75, midterm: 70, project: 78, hw4: null, final: null } },
  { name: "Raj Patel", scores: { hw1: 85, hw2: 80, hw3: null, midterm: 78, project: 82, hw4: null, final: null } },
];

function scoreColor(score: number | null, max: number): string {
  if (score === null) return "";
  const pct = (score / max) * 100;
  if (pct >= 90) return "text-success";
  if (pct >= 80) return "text-info";
  if (pct >= 70) return "text-warning";
  return "text-danger";
}

function computeAverage(scores: Record<string, number | null>): string {
  const vals = Object.values(scores).filter((v): v is number => v !== null);
  if (vals.length === 0) return "—";
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

export default function GradebookPage() {
  const [course] = useState("DS 310");
  const students = DEMO_GRADEBOOK;

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">Gradebook</h1>
        <p className="text-foreground/40 text-sm mt-1">{course} · Machine Learning · {students.length} students</p>
      </BlurFade>

      {/* Legend */}
      <BlurFade delay={0.1}>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success" />A range</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-info" />B range</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" />C range</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-danger" />Below C</span>
          <span className="flex items-center gap-1.5 text-foreground/30">
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-dashed">—</Badge> Not submitted
          </span>
        </div>
      </BlurFade>

      {/* Gradebook table */}
      <BlurFade delay={0.15}>
        <div className="rounded-xl border border-border/60 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35 sticky left-0 bg-muted/30 z-10 min-w-[160px]">Student</TableHead>
                {ASSIGNMENTS.map((a) => (
                  <TableHead key={a.key} className="text-xs uppercase tracking-wider text-foreground/35 text-center min-w-[72px]">{a.name}</TableHead>
                ))}
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35 text-center min-w-[72px]">Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.name} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="text-sm font-medium sticky left-0 bg-card z-10">{student.name}</TableCell>
                  {ASSIGNMENTS.map((a) => {
                    const score = student.scores[a.key];
                    return (
                      <TableCell key={a.key} className="text-center">
                        {score !== null ? (
                          <span className={`font-mono text-xs font-semibold ${scoreColor(score, a.max)}`}>{score}</span>
                        ) : (
                          <span className="text-foreground/20 text-xs">—</span>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center">
                    <span className="font-mono text-xs font-bold text-foreground/70">{computeAverage(student.scores)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </BlurFade>

      {/* Class average row */}
      <BlurFade delay={0.2}>
        <div className="rounded-xl border border-border/60 p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground/50">Class Average</p>
            <div className="flex items-center gap-6">
              {ASSIGNMENTS.map((a) => {
                const vals = students.map((s) => s.scores[a.key]).filter((v): v is number => v !== null);
                const avg = vals.length > 0 ? (vals.reduce((x, y) => x + y, 0) / vals.length).toFixed(1) : "—";
                return (
                  <div key={a.key} className="text-center">
                    <p className="text-[10px] text-foreground/30 uppercase tracking-wider">{a.name}</p>
                    <p className="font-mono text-xs font-semibold text-foreground/60">{avg}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
