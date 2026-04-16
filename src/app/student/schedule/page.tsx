"use client";

import { useEffect, useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";

const MAYA_COURSES = [
  "e1000000-0000-0000-0000-000000000001",
  "e1000000-0000-0000-0000-000000000002",
  "e1000000-0000-0000-0000-000000000003",
  "e1000000-0000-0000-0000-000000000005",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am to 5pm

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-info/10", border: "border-info/20", text: "text-info" },
  green: { bg: "bg-success/10", border: "border-success/20", text: "text-success" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-600" },
  amber: { bg: "bg-warning/10", border: "border-warning/20", text: "text-warning" },
  pink: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-600" },
};

interface ScheduleEvent {
  id: string; day_of_week: number; start_time: string; end_time: string; room: string;
  course: { code: string; title: string; color: string };
}

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("schedule_events")
        .select("id, day_of_week, start_time, end_time, room, courses(code, title, color)")
        .in("course_id", MAYA_COURSES)
        .order("start_time");
      if (data) {
        setEvents(data.map((e: any) => ({ ...e, course: e.courses })));
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const getEventsForDay = (dayIndex: number) =>
    events.filter((e) => e.day_of_week === dayIndex + 1);

  const today = new Date().getDay(); // 0=Sun
  const todayIndex = today === 0 ? -1 : today - 1; // 0=Mon

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="h-96 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">Schedule</h1>
        <p className="text-foreground/40 text-sm mt-1">Spring 2026 · Weekly View</p>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-5 border-b border-border/40">
            {DAYS.map((day, i) => (
              <div
                key={day}
                className={`py-3 px-4 text-center text-xs font-medium uppercase tracking-wider ${
                  i === todayIndex ? "text-primary bg-primary/[0.03]" : "text-foreground/35"
                }`}
              >
                {day}
                {i === todayIndex && (
                  <span className="ml-2 text-[9px] text-primary font-normal normal-case">(today)</span>
                )}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-5 min-h-[500px]">
            {DAYS.map((_, dayIndex) => {
              const dayEvents = getEventsForDay(dayIndex);
              return (
                <div
                  key={dayIndex}
                  className={`border-r border-border/30 last:border-0 p-2 space-y-2 ${
                    dayIndex === todayIndex ? "bg-primary/[0.02]" : ""
                  }`}
                >
                  {dayEvents.map((event) => {
                    const colors = COLOR_MAP[event.course.color] || COLOR_MAP.blue;
                    const [startH] = event.start_time.split(":").map(Number);
                    const [endH] = event.end_time.split(":").map(Number);
                    const durationHours = endH - startH;

                    return (
                      <div
                        key={event.id}
                        className={`rounded-lg border ${colors.border} ${colors.bg} p-2.5 cursor-pointer hover:opacity-80 transition-opacity`}
                        style={{ minHeight: `${Math.max(durationHours * 60, 60)}px` }}
                      >
                        <p className={`font-mono text-[10px] font-medium ${colors.text} mb-0.5`}>
                          {event.course.code}
                        </p>
                        <p className="text-xs font-medium text-foreground/70 leading-tight mb-1">
                          {event.course.title}
                        </p>
                        <p className="font-mono text-[10px] text-foreground/30">
                          {event.start_time.slice(0, 5)} – {event.end_time.slice(0, 5)}
                        </p>
                        <p className="text-[10px] text-foreground/25 mt-0.5">{event.room}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
