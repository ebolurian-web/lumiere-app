"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";

interface Student {
  id: string;
  full_name: string;
  email: string;
  year: number;
  gpa: number;
  status: string;
  program: { name: string } | null;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("users")
        .select("id, full_name, email, year, gpa, status, program:program_id(name)")
        .eq("role", "student")
        .order("full_name");
      if (data) setStudents(data.map((d: any) => ({ ...d, program: Array.isArray(d.program) ? d.program[0] : d.program })) as Student[]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  function gpaColor(gpa: number) {
    if (gpa >= 3.5) return "text-success";
    if (gpa >= 3.0) return "text-warning";
    return "text-danger";
  }

  const statusColor: Record<string, string> = {
    active: "bg-success/10 text-success border-0",
    inactive: "bg-foreground/10 text-foreground/50 border-0",
    probation: "bg-danger/10 text-danger border-0",
    graduated: "bg-info/10 text-info border-0",
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-56 animate-pulse" />
        <div className="h-10 bg-muted rounded-lg w-72 animate-pulse" />
        <div className="h-[400px] bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          Student Management
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {students.length} students enrolled
        </p>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30"
          />
        </div>
      </BlurFade>

      <BlurFade delay={0.15}>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Name
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Email
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Program
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Year
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  GPA
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium text-sm">
                    {s.full_name}
                  </TableCell>
                  <TableCell className="text-sm text-foreground/50">
                    {s.email}
                  </TableCell>
                  <TableCell className="text-sm text-foreground/50">
                    {s.program?.name || "--"}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground/50">
                    {s.year ? `Year ${s.year}` : "--"}
                  </TableCell>
                  <TableCell
                    className={`font-mono text-sm font-semibold ${gpaColor(s.gpa)}`}
                  >
                    {s.gpa?.toFixed(2) || "--"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] ${statusColor[s.status] || statusColor.active}`}
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-foreground/30 py-12"
                  >
                    No students found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </BlurFade>
    </div>
  );
}
