"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
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

type StatusFilter = "all" | "active" | "probation" | "at_risk";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("users")
        .select(
          "id, full_name, email, year, gpa, status, program:program_id(name)"
        )
        .eq("role", "student")
        .order("full_name");
      if (data)
        setStudents(
          data.map((d: any) => ({
            ...d,
            program: Array.isArray(d.program) ? d.program[0] : d.program,
          })) as Student[]
        );
      setLoading(false);
    }
    load();
  }, []);

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "all") return true;
    if (filter === "at_risk") return s.gpa < 2.5;
    return s.status === filter;
  });

  function gpaColor(gpa: number) {
    if (gpa >= 3.5) return "text-success";
    if (gpa >= 3.0) return "text-info";
    return "text-warning";
  }

  function initials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  const statusColor: Record<string, string> = {
    active: "bg-success/10 text-success border-0",
    inactive: "bg-foreground/10 text-foreground/50 border-0",
    probation: "bg-danger/10 text-danger border-0",
    graduated: "bg-info/10 text-info border-0",
  };

  const filterOptions: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Probation", value: "probation" },
    { label: "At Risk", value: "at_risk" },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-56 animate-pulse" />
        <div className="h-5 bg-muted rounded w-28 animate-pulse" />
        <div className="flex gap-3 mt-4">
          <div className="h-10 bg-muted rounded-lg w-72 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-20 bg-muted rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl font-light tracking-tight">
          Student Management
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {students.length} students
        </p>
      </BlurFade>

      <BlurFade delay={0.05}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/30"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {filterOptions.map((f) => (
              <Button
                key={f.value}
                size="sm"
                variant={filter === f.value ? "default" : "ghost"}
                className={
                  filter === f.value
                    ? "h-8 text-xs rounded-full"
                    : "h-8 text-xs rounded-full text-foreground/50 hover:text-foreground"
                }
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s, i) => (
          <BlurFade key={s.id} delay={0.1 + i * 0.04} inView>
            <Card className="card-hover-glow h-full">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="h-12 w-12" size="lg">
                    <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary">
                      {initials(s.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {s.full_name}
                    </h3>
                    <p className="font-mono text-xs text-foreground/40 truncate">
                      {s.email}
                    </p>
                  </div>
                  <Badge
                    className={`text-[10px] shrink-0 ${statusColor[s.status] || statusColor.active}`}
                  >
                    {s.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-foreground/50">
                      {s.program?.name || "No program"}
                    </p>
                    <p className="text-xs text-foreground/30">
                      {s.year ? `Year ${s.year}` : "--"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-mono text-2xl font-bold leading-none ${gpaColor(s.gpa)}`}
                    >
                      {s.gpa?.toFixed(2) || "--"}
                    </p>
                    <p className="text-[10px] text-foreground/30 mt-0.5">GPA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-foreground/30 text-sm">
            No students found
          </div>
        )}
      </div>
    </div>
  );
}
