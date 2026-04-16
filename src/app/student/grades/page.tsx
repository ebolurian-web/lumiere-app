"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

const GRADE_COLORS: Record<string, string> = {
  "A+": "text-success", "A": "text-success", "A-": "text-success",
  "B+": "text-info", "B": "text-info", "B-": "text-info",
  "C+": "text-warning", "C": "text-warning", "C-": "text-warning",
  "D": "text-danger", "F": "text-danger",
};

interface Enrollment {
  grade: string; percentage: number;
  course: { code: string; title: string; credits: number; color: string };
}

export default function GradesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("enrollments")
        .select("grade, percentage, courses(code, title, credits, color)")
        .eq("user_id", MAYA_ID);
      if (data) {
        setEnrollments(data.map((e: any) => ({ ...e, course: e.courses })));
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const totalCredits = enrollments.reduce((s, e) => s + e.course.credits, 0);

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
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">Grades</h1>
        <p className="text-foreground/40 text-sm mt-1">Spring 2026 · {totalCredits} credits</p>
      </BlurFade>

      {/* GPA summary */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="card-hover-glow">
            <CardContent className="p-6 text-center">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Term GPA</p>
              <NumberTicker value={3.72} decimalPlaces={2} delay={0.3} className="text-4xl font-mono font-bold text-foreground" />
            </CardContent>
          </Card>
          <Card className="card-hover-glow">
            <CardContent className="p-6 text-center">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Cumulative GPA</p>
              <NumberTicker value={3.68} decimalPlaces={2} delay={0.5} className="text-4xl font-mono font-bold text-foreground" />
            </CardContent>
          </Card>
          <Card className="card-hover-glow">
            <CardContent className="p-6 text-center">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Credits Earned</p>
              <NumberTicker value={66} delay={0.7} className="text-4xl font-mono font-bold text-foreground" />
              <span className="text-foreground/30 text-lg font-mono"> / 90</span>
            </CardContent>
          </Card>
        </div>
      </BlurFade>

      {/* Grade table */}
      <BlurFade delay={0.2}>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35">Course</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35">Title</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35 text-center">Credits</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35 text-center">Grade</TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-foreground/35 text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((e) => (
                <TableRow key={e.course.code} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-mono text-sm font-medium">{e.course.code}</TableCell>
                  <TableCell className="text-sm text-foreground/60">{e.course.title}</TableCell>
                  <TableCell className="font-mono text-xs text-foreground/50 text-center">{e.course.credits}</TableCell>
                  <TableCell className="text-center">
                    <span className={`font-mono text-lg font-bold ${GRADE_COLORS[e.grade] || "text-foreground"}`}>
                      {e.grade}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground/50 text-right">{e.percentage?.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </BlurFade>
    </div>
  );
}
