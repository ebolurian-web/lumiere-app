"use client";

import { useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";

const KIM_ID = "c1000000-0000-0000-0000-000000000001";

const COLUMNS = [
  { key: "hw1", name: "HW 1" },
  { key: "hw2", name: "HW 2" },
  { key: "hw3", name: "HW 3" },
  { key: "hw4", name: "HW 4" },
  { key: "midterm", name: "Midterm" },
  { key: "project", name: "Project" },
  { key: "final", name: "Final" },
];

interface StudentGrades {
  name: string;
  scores: Record<string, number | null>;
}

const DEMO_GRADEBOOK: StudentGrades[] = [
  {
    name: "Maya Rodriguez",
    scores: { hw1: 95, hw2: 92, hw3: 88, hw4: 90, midterm: 91, project: 94, final: 89 },
  },
  {
    name: "James Chen",
    scores: { hw1: 98, hw2: 96, hw3: 94, hw4: 93, midterm: 95, project: 97, final: 92 },
  },
  {
    name: "Amara Okonkwo",
    scores: { hw1: 88, hw2: 85, hw3: 90, hw4: 86, midterm: 87, project: 91, final: 84 },
  },
  {
    name: "Lucas Park",
    scores: { hw1: 82, hw2: 79, hw3: 84, hw4: 81, midterm: 80, project: 85, final: 77 },
  },
  {
    name: "Sofia Almeida",
    scores: { hw1: 72, hw2: 68, hw3: 75, hw4: 71, midterm: 70, project: 78, final: 65 },
  },
  {
    name: "Raj Patel",
    scores: { hw1: 85, hw2: 80, hw3: 78, hw4: 82, midterm: 78, project: 82, final: 76 },
  },
];

function cellBg(score: number | null): string {
  if (score === null) return "";
  if (score >= 90) return "bg-success/8";
  if (score >= 80) return "bg-info/8";
  if (score >= 70) return "bg-warning/8";
  return "bg-danger/8";
}

function cellText(score: number | null): string {
  if (score === null) return "text-foreground/20";
  if (score >= 90) return "text-success";
  if (score >= 80) return "text-info";
  if (score >= 70) return "text-warning";
  return "text-danger";
}

function computeAverage(scores: Record<string, number | null>): number | null {
  const vals = Object.values(scores).filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function columnAverage(
  students: StudentGrades[],
  key: string
): number | null {
  const vals = students
    .map((s) => s.scores[key])
    .filter((v): v is number => v !== null);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export default function GradebookPage() {
  const [students] = useState(DEMO_GRADEBOOK);

  const classAvg = (() => {
    const allAvgs = students
      .map((s) => computeAverage(s.scores))
      .filter((v): v is number => v !== null);
    if (allAvgs.length === 0) return null;
    return allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length;
  })();

  return (
    <div className="space-y-8">
      {/* Header */}
      <BlurFade delay={0}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
              Gradebook
            </h1>
            <p className="text-foreground/40 text-sm mt-1">
              DS 310 Machine Learning &middot; Spring 2026
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-medium"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </BlurFade>

      {/* Enhanced table */}
      <BlurFade delay={0.1}>
        <div className="rounded-xl border border-border/60 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-[11px] uppercase tracking-wider text-foreground/35 sticky left-0 bg-muted/30 z-10 min-w-[180px]">
                  Student
                </TableHead>
                {COLUMNS.map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-[11px] uppercase tracking-wider text-foreground/35 text-center min-w-[72px]"
                  >
                    {col.name}
                  </TableHead>
                ))}
                <TableHead className="text-[11px] uppercase tracking-wider text-foreground/35 text-center min-w-[80px] font-bold">
                  Average
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const initials = student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2);
                const avg = computeAverage(student.scores);

                return (
                  <TableRow
                    key={student.name}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    {/* Sticky student name with avatar */}
                    <TableCell className="sticky left-0 bg-card z-10">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-7 w-7 flex-shrink-0">
                          <AvatarFallback className="text-[10px] bg-primary/8 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {student.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Score cells with color-coded backgrounds */}
                    {COLUMNS.map((col) => {
                      const score = student.scores[col.key];
                      return (
                        <TableCell
                          key={col.key}
                          className={`text-center ${cellBg(score)}`}
                        >
                          {score !== null ? (
                            <span
                              className={`font-mono text-xs font-semibold ${cellText(score)}`}
                            >
                              {score}
                            </span>
                          ) : (
                            <span className="text-foreground/20 text-xs">
                              --
                            </span>
                          )}
                        </TableCell>
                      );
                    })}

                    {/* Bold average column */}
                    <TableCell className={`text-center ${cellBg(avg)}`}>
                      <span
                        className={`font-mono text-xs font-bold ${cellText(avg)}`}
                      >
                        {avg !== null ? avg.toFixed(1) : "--"}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Class average summary row */}
              <TableRow className="bg-muted/20 border-t-2 border-border/40">
                <TableCell className="sticky left-0 bg-muted/20 z-10">
                  <span className="text-sm font-semibold text-foreground/50">
                    Class Average
                  </span>
                </TableCell>
                {COLUMNS.map((col) => {
                  const avg = columnAverage(students, col.key);
                  return (
                    <TableCell
                      key={col.key}
                      className={`text-center ${cellBg(avg)}`}
                    >
                      <span
                        className={`font-mono text-xs font-bold ${cellText(avg)}`}
                      >
                        {avg !== null ? avg.toFixed(1) : "--"}
                      </span>
                    </TableCell>
                  );
                })}
                <TableCell className={`text-center ${cellBg(classAvg)}`}>
                  <span
                    className={`font-mono text-xs font-bold ${cellText(classAvg)}`}
                  >
                    {classAvg !== null ? classAvg.toFixed(1) : "--"}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </BlurFade>
    </div>
  );
}
