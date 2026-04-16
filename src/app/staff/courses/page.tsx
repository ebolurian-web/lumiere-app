"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { supabase } from "@/lib/supabase";

const KIM_ID = "c1000000-0000-0000-0000-000000000001";

const COLOR_MAP: Record<string, string> = {
  blue: "bg-info", green: "bg-success", purple: "bg-purple-600", amber: "bg-warning", pink: "bg-pink-600",
};
const TEXT_COLOR: Record<string, string> = {
  blue: "text-info", green: "text-success", purple: "text-purple-600", amber: "text-warning", pink: "text-pink-600",
};

interface Course {
  id: string;
  code: string;
  title: string;
  color: string;
  schedule: string;
  room: string;
  credits: number;
  description: string;
  enrolled_count?: number;
}

// Demo data used when Supabase returns nothing
const DEMO_COURSES: Course[] = [
  {
    id: "e1000000-0000-0000-0000-000000000001",
    code: "DS 310",
    title: "Machine Learning",
    color: "blue",
    schedule: "MWF 10:00–10:50",
    room: "Turing Hall 204",
    credits: 4,
    description: "Supervised and unsupervised learning, neural networks, model evaluation, and real-world applications.",
    enrolled_count: 28,
  },
  {
    id: "e1000000-0000-0000-0000-000000000002",
    code: "DS 410",
    title: "Deep Learning",
    color: "purple",
    schedule: "TTh 13:00–14:20",
    room: "Babbage Lab 112",
    credits: 3,
    description: "Convolutional and recurrent architectures, transformers, and generative models.",
    enrolled_count: 22,
  },
  {
    id: "e1000000-0000-0000-0000-000000000003",
    code: "DS 210",
    title: "Statistical Foundations",
    color: "green",
    schedule: "MWF 11:00–11:50",
    room: "Turing Hall 108",
    credits: 3,
    description: "Probability distributions, hypothesis testing, regression, and Bayesian inference.",
    enrolled_count: 35,
  },
];

export default function StaffCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("courses")
        .select("id, code, title, color, schedule, room, credits, description")
        .eq("instructor_id", KIM_ID);
      if (data && data.length > 0) {
        setCourses(data as Course[]);
      } else {
        setCourses(DEMO_COURSES);
      }
      setLoading(false);
    }
    load();
  }, []);

  const totalStudents = courses.reduce((s, c) => s + (c.enrolled_count || 0), 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">My Courses</h1>
        <p className="text-foreground/40 text-sm mt-1">Spring 2026 · {courses.length} courses · {totalStudents} students</p>
      </BlurFade>

      {/* Summary cards */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="card-hover-glow">
            <CardContent className="p-6 text-center">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Active Courses</p>
              <NumberTicker value={courses.length} delay={0.2} className="text-4xl font-mono font-bold text-foreground" />
            </CardContent>
          </Card>
          <Card className="card-hover-glow">
            <CardContent className="p-6 text-center">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Total Students</p>
              <NumberTicker value={totalStudents} delay={0.4} className="text-4xl font-mono font-bold text-foreground" />
            </CardContent>
          </Card>
          <Card className="card-hover-glow">
            <CardContent className="p-6 text-center">
              <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">Total Credits</p>
              <NumberTicker value={courses.reduce((s, c) => s + c.credits, 0)} delay={0.6} className="text-4xl font-mono font-bold text-foreground" />
            </CardContent>
          </Card>
        </div>
      </BlurFade>

      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course, i) => (
          <BlurFade key={course.id} delay={0.15 + i * 0.06} inView>
            <Card className="card-hover-glow cursor-pointer h-full">
              <CardContent className="p-6">
                <div className={`w-full h-1 rounded-full mb-4 ${COLOR_MAP[course.color] || "bg-primary"}`} />
                <div className="flex items-start justify-between mb-2">
                  <p className={`font-mono text-xs font-medium ${TEXT_COLOR[course.color] || "text-primary"}`}>{course.code}</p>
                  <Badge variant="outline" className="text-[10px]">{course.credits} cr</Badge>
                </div>
                <h3 className="font-serif text-lg font-semibold mb-1">{course.title}</h3>
                <p className="text-sm text-foreground/45 leading-relaxed mb-4">{course.description}</p>
                <div className="flex items-center gap-3 text-xs text-foreground/30 font-mono mb-3">
                  <span>{course.schedule}</span>
                  <span className="text-border">|</span>
                  <span>{course.room}</span>
                </div>
                <div className="gradient-divider mb-3" />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-foreground/35">Enrolled Students</p>
                  <span className="font-mono text-sm font-semibold">{course.enrolled_count || 0}</span>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
