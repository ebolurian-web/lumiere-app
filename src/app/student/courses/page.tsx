"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-info", green: "bg-success", purple: "bg-purple-600", amber: "bg-warning", pink: "bg-pink-600",
};
const TEXT_COLOR: Record<string, string> = {
  blue: "text-info", green: "text-success", purple: "text-purple-600", amber: "text-warning", pink: "text-pink-600",
};

interface Course {
  id: string; code: string; title: string; instructor_name: string; color: string;
  schedule: string; room: string; credits: number; description: string; percentage?: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("enrollments")
        .select("percentage, courses(id, code, title, instructor_name, color, schedule, room, credits, description)")
        .eq("user_id", MAYA_ID);
      if (data) {
        setCourses(data.map((e: any) => ({ ...e.courses, percentage: e.percentage })));
      }
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-2 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">Courses</h1>
        <p className="text-foreground/40 text-sm mt-1">Spring 2026 · {courses.length} enrolled</p>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course, i) => (
          <BlurFade key={course.id} delay={0.1 + i * 0.06} inView>
            <Card className="card-hover-glow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className={`w-full h-1 rounded-full mb-4 ${COLOR_MAP[course.color] || "bg-primary"}`} />
                <div className="flex items-start justify-between mb-2">
                  <p className={`font-mono text-xs font-medium ${TEXT_COLOR[course.color] || "text-primary"}`}>{course.code}</p>
                  <Badge variant="outline" className="text-[10px]">{course.credits} cr</Badge>
                </div>
                <h3 className="font-serif text-lg font-semibold mb-1">{course.title}</h3>
                <p className="text-xs text-foreground/35 mb-3">{course.instructor_name}</p>
                <p className="text-sm text-foreground/45 leading-relaxed mb-4">{course.description}</p>
                <div className="flex items-center gap-3 text-xs text-foreground/30 font-mono mb-4">
                  <span>{course.schedule}</span>
                  <span className="text-border">|</span>
                  <span>{course.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={course.percentage || 0} className="h-1.5 flex-1" />
                  <span className="font-mono text-xs text-foreground/40">{course.percentage?.toFixed(0)}%</span>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
