"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-info", green: "bg-success", purple: "bg-purple-600", amber: "bg-warning", pink: "bg-pink-600",
};
const TEXT_COLOR: Record<string, string> = {
  blue: "text-info", green: "text-success", purple: "text-purple-600", amber: "text-warning", pink: "text-pink-600",
};
const GRADIENT_FROM: Record<string, string> = {
  blue: "from-info/80", green: "from-success/80", purple: "from-purple-600/80", amber: "from-warning/80", pink: "from-pink-600/80",
};
const GRADIENT_TO: Record<string, string> = {
  blue: "to-info/40", green: "to-success/40", purple: "to-purple-600/40", amber: "to-warning/40", pink: "to-pink-600/40",
};

interface Course {
  id: string;
  code: string;
  title: string;
  instructor_name: string;
  color: string;
  schedule: string;
  room: string;
  credits: number;
  description: string;
  percentage?: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      const { data } = await supabase
        .from("enrollments")
        .select("percentage, courses(id, code, title, instructor_name, color, schedule, room, credits, description)")
        .eq("user_id", MAYA_ID);
      if (data) {
        setCourses(data.map((e: any) => ({ ...e.courses, percentage: e.percentage })));
      }
      setLoading(false);
    }
    fetchCourses();
  }, []);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-9 bg-muted rounded-lg w-36 animate-pulse" />
          <div className="h-4 bg-muted rounded w-44 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl font-light tracking-tight">Courses</h1>
        <p className="text-foreground/40 text-sm mt-1">
          Spring 2026 &middot; {courses.length} enrolled
        </p>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course, i) => (
          <BlurFade key={course.id} delay={0.08 + i * 0.06} inView>
            <Link href={`/student/courses/${course.id}`}>
            <Card className="card-hover-glow cursor-pointer h-full overflow-hidden">
              {/* Gradient header bar */}
              <div
                className={`h-2 rounded-t-xl bg-gradient-to-r ${GRADIENT_FROM[course.color] || "from-primary/80"} ${GRADIENT_TO[course.color] || "to-primary/40"}`}
              />

              <CardContent className="p-6 pt-5">
                {/* Code + credits */}
                <div className="flex items-start justify-between mb-2">
                  <p className={`font-mono text-xs font-medium ${TEXT_COLOR[course.color] || "text-primary"}`}>
                    {course.code}
                  </p>
                  <Badge variant="outline" className="text-[10px]">
                    {course.credits} cr
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg font-semibold mb-3">{course.title}</h3>

                {/* Instructor with avatar */}
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      className={`text-[9px] font-medium ${TEXT_COLOR[course.color] || "text-primary"} bg-muted`}
                    >
                      {getInitials(course.instructor_name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-foreground/45">{course.instructor_name}</span>
                </div>

                {/* Schedule + room */}
                <div className="flex items-center gap-3 font-mono text-xs text-foreground/30 mb-4">
                  <span>{course.schedule}</span>
                  <span className="text-border">|</span>
                  <span>{course.room}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-foreground/45 leading-relaxed mb-5">
                  {course.description}
                </p>

                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <Progress value={course.percentage || 0} className="h-1.5 flex-1" />
                  <span className="font-mono text-xs text-foreground/40">
                    {course.percentage?.toFixed(0) ?? 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
            </Link>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
