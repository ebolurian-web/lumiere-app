"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const KIM_ID = "c1000000-0000-0000-0000-000000000001";

const GRADIENT_MAP: Record<string, string> = {
  blue: "from-info/80 to-info/40",
  green: "from-success/80 to-success/40",
  purple: "from-purple-600/80 to-purple-600/40",
};

const TEXT_COLOR: Record<string, string> = {
  blue: "text-info",
  green: "text-success",
  purple: "text-purple-600",
};

interface Course {
  id: string;
  code: string;
  title: string;
  color: string;
  schedule: string;
  room: string;
  credits: number;
  enrolled_count: number;
  ungraded: number;
}

const DEMO_COURSES: Course[] = [
  {
    id: "e1000000-0000-0000-0000-000000000001",
    code: "DS 310",
    title: "Machine Learning",
    color: "blue",
    schedule: "MWF 10:00-10:50",
    room: "Turing Hall 204",
    credits: 3,
    enrolled_count: 28,
    ungraded: 12,
  },
  {
    id: "e1000000-0000-0000-0000-000000000002",
    code: "DS 410",
    title: "Deep Learning",
    color: "green",
    schedule: "TTh 13:00-14:20",
    room: "Babbage Lab 112",
    credits: 3,
    enrolled_count: 22,
    ungraded: 8,
  },
  {
    id: "e1000000-0000-0000-0000-000000000003",
    code: "DS 210",
    title: "Statistical Foundations",
    color: "purple",
    schedule: "MWF 11:00-11:50",
    room: "Turing Hall 108",
    credits: 3,
    enrolled_count: 35,
    ungraded: 5,
  },
];

export default function StaffCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("courses")
        .select("id, code, title, color, schedule, room, credits")
        .eq("instructor_id", KIM_ID);
      if (data && data.length > 0) {
        setCourses(
          data.map((c: any) => ({
            ...c,
            enrolled_count: c.enrolled_count ?? 0,
            ungraded: c.ungraded ?? 0,
          }))
        );
      } else {
        setCourses(DEMO_COURSES);
      }
      setLoading(false);
    }
    load();
  }, []);

  const activeCourses = courses.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-36 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl font-light text-navy dark:text-foreground tracking-tight">
          My Courses
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          Spring 2026 &middot; {activeCourses} active
        </p>
      </BlurFade>

      {/* Course cards - 2-col bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course, i) => (
          <BlurFade key={course.id} delay={0.1 + i * 0.06} inView>
            <Link href={`/staff/courses/${course.id}`} className="block">
              <Card className="card-hover-glow cursor-pointer h-full overflow-hidden">
              {/* Gradient color header */}
              <div
                className={`h-2 rounded-t-xl bg-gradient-to-r ${
                  GRADIENT_MAP[course.color] || "from-primary/80 to-primary/40"
                }`}
              />
              <CardContent className="p-6">
                {/* Course code */}
                <p
                  className={`font-mono text-xs font-medium mb-1 ${
                    TEXT_COLOR[course.color] || "text-primary"
                  }`}
                >
                  {course.code}
                </p>

                {/* Title */}
                <h3 className="font-serif text-lg font-semibold mb-3">
                  {course.title}
                </h3>

                {/* Schedule + Room */}
                <p className="font-mono text-xs text-foreground/35 mb-4">
                  {course.schedule} &middot; {course.room}
                </p>

                {/* Divider */}
                <div className="gradient-divider mb-4" />

                {/* Mini stat row */}
                <div className="flex items-center gap-4 text-xs text-foreground/50">
                  <span>
                    <span className="font-mono font-semibold text-foreground/70">
                      {course.enrolled_count}
                    </span>{" "}
                    students
                  </span>
                  <span className="text-border">|</span>
                  <span>
                    <span className="font-mono font-semibold text-foreground/70">
                      {course.ungraded}
                    </span>{" "}
                    ungraded
                  </span>
                  <span className="text-border">|</span>
                  <span>
                    <span className="font-mono font-semibold text-foreground/70">
                      {course.credits}
                    </span>{" "}
                    credits
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
