"use client";

import { useEffect, useState, useMemo } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";

const MAYA_COURSES = [
  "e1000000-0000-0000-0000-000000000001",
  "e1000000-0000-0000-0000-000000000002",
  "e1000000-0000-0000-0000-000000000003",
  "e1000000-0000-0000-0000-000000000005",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DAYS_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am-5pm

const EXTRA_SCHEDULE = [
  {
    id: "extra-1",
    start_time: "14:00",
    end_time: "15:00",
    title: "Office Hours -- Dr. Kim",
    room: "Turing Hall 206",
    type: "Office Hours",
    color: "amber",
    days: [3],
  },
  {
    id: "extra-2",
    start_time: "16:30",
    end_time: "17:30",
    title: "DS Study Group",
    room: "Library Room 3B",
    type: "Study Group",
    color: "blue",
    days: [1, 3],
  },
  {
    id: "extra-3",
    start_time: "11:00",
    end_time: "11:30",
    title: "Advisor Check-in",
    room: "Virtual -- Zoom",
    type: "Advising",
    color: "green",
    days: [2, 4],
  },
];

const COLOR_MAP: Record<string, { gradient: string; border: string; text: string; dot: string }> = {
  blue:   { gradient: "from-info/10 to-info/5",       border: "border-l-info",       text: "text-info",       dot: "bg-info" },
  green:  { gradient: "from-success/10 to-success/5", border: "border-l-success",    text: "text-success",    dot: "bg-success" },
  purple: { gradient: "from-purple-500/10 to-purple-500/5", border: "border-l-purple-500", text: "text-purple-600", dot: "bg-purple-500" },
  amber:  { gradient: "from-warning/10 to-warning/5", border: "border-l-warning",    text: "text-warning",    dot: "bg-warning" },
  pink:   { gradient: "from-pink-500/10 to-pink-500/5", border: "border-l-pink-500", text: "text-pink-600",   dot: "bg-pink-500" },
};

interface ScheduleEvent {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  course: { code: string; title: string; color: string };
}

interface TimelineItem {
  id: string;
  startMinutes: number;
  endMinutes: number;
  title: string;
  code: string;
  room: string;
  color: string;
  startLabel: string;
  endLabel: string;
  type?: string;
}

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatHour(hour: number): string {
  if (hour === 0) return "12am";
  if (hour < 12) return `${hour}am`;
  if (hour === 12) return "12pm";
  return `${hour - 12}pm`;
}

export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().getDay();
  const todayIndex = today === 0 || today === 6 ? 0 : today - 1; // default to Mon on weekends
  const [selectedDay, setSelectedDay] = useState(todayIndex);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchSchedule() {
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
    fetchSchedule();
  }, []);

  // Build timeline items for the selected day
  const timelineItems: TimelineItem[] = useMemo(() => {
    const dayNum = selectedDay + 1; // 1-indexed
    const courseItems: TimelineItem[] = events
      .filter((e) => e.day_of_week === dayNum)
      .map((e) => ({
        id: e.id,
        startMinutes: parseTimeToMinutes(e.start_time),
        endMinutes: parseTimeToMinutes(e.end_time),
        title: e.course.title,
        code: e.course.code,
        room: e.room,
        color: e.course.color,
        startLabel: e.start_time.slice(0, 5),
        endLabel: e.end_time.slice(0, 5),
      }));

    const extraItems: TimelineItem[] = EXTRA_SCHEDULE
      .filter((e) => e.days.includes(dayNum))
      .map((e) => ({
        id: e.id,
        startMinutes: parseTimeToMinutes(e.start_time),
        endMinutes: parseTimeToMinutes(e.end_time),
        title: e.title,
        code: e.type,
        room: e.room,
        color: e.color,
        startLabel: e.start_time.slice(0, 5),
        endLabel: e.end_time.slice(0, 5),
        type: e.type,
      }));

    return [...courseItems, ...extraItems].sort((a, b) => a.startMinutes - b.startMinutes);
  }, [events, selectedDay]);

  // Weekly overview: which slots have classes on which days
  const weeklyDots = useMemo(() => {
    const grid: Record<string, string[]> = {};
    for (let d = 0; d < 5; d++) {
      const dayNum = d + 1;
      const dayEvents = events.filter((e) => e.day_of_week === dayNum);
      const dayExtras = EXTRA_SCHEDULE.filter((e) => e.days.includes(dayNum));
      for (const e of dayEvents) {
        const startH = Math.floor(parseTimeToMinutes(e.start_time) / 60);
        const key = `${d}-${startH}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(e.course.color);
      }
      for (const e of dayExtras) {
        const startH = Math.floor(parseTimeToMinutes(e.start_time) / 60);
        const key = `${d}-${startH}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(e.color);
      }
    }
    return grid;
  }, [events]);

  // Timeline constants
  const TIMELINE_START = 8 * 60;  // 8am in minutes
  const TIMELINE_END = 18 * 60;   // 6pm (to fit 5pm classes)
  const TIMELINE_RANGE = TIMELINE_END - TIMELINE_START;
  const TIMELINE_HEIGHT = 640; // px

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = today >= 1 && today <= 5 && selectedDay === today - 1;
  const nowInRange = nowMinutes >= TIMELINE_START && nowMinutes <= TIMELINE_END;
  const nowPosition = ((nowMinutes - TIMELINE_START) / TIMELINE_RANGE) * TIMELINE_HEIGHT;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded w-56 animate-pulse" />
        <div className="flex gap-2 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-[640px] bg-muted rounded-xl animate-pulse mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          Schedule
        </h1>
        <p className="text-foreground/40 text-sm mt-1">Spring 2026 &middot; Weekly View</p>
      </BlurFade>

      {/* Day selector */}
      <BlurFade delay={0.05}>
        <div className="flex items-center gap-2">
          {DAYS.map((day, i) => {
            const isTodayBtn = today >= 1 && today <= 5 && i === today - 1;
            const isSelected = i === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(i)}
                className={`
                  relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${isSelected
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border/60 text-foreground/50 hover:text-foreground/70 hover:border-border"
                  }
                `}
              >
                {day}
                {isTodayBtn && (
                  <span
                    className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                      isSelected ? "bg-white" : "bg-primary"
                    }`}
                  />
                )}
              </button>
            );
          })}
          <span className="ml-3 text-xs text-foreground/30 font-mono">
            {DAYS_FULL[selectedDay]}
          </span>
        </div>
      </BlurFade>

      {/* Timeline */}
      <BlurFade delay={0.1}>
        <div className="rounded-xl border border-border/60 overflow-hidden card-hover-glow">
          <div className="p-6">
            <div className="relative flex" style={{ height: `${TIMELINE_HEIGHT}px` }}>
              {/* Time markers on left */}
              <div className="w-14 flex-shrink-0 relative">
                {HOURS.map((hour) => {
                  const top = ((hour * 60 - TIMELINE_START) / TIMELINE_RANGE) * TIMELINE_HEIGHT;
                  return (
                    <div
                      key={hour}
                      className="absolute left-0 font-mono text-xs text-foreground/20"
                      style={{ top: `${top}px`, transform: "translateY(-50%)" }}
                    >
                      {formatHour(hour)}
                    </div>
                  );
                })}
              </div>

              {/* Timeline area */}
              <div className="flex-1 relative border-l border-border/30 ml-2">
                {/* Hour grid lines */}
                {HOURS.map((hour) => {
                  const top = ((hour * 60 - TIMELINE_START) / TIMELINE_RANGE) * TIMELINE_HEIGHT;
                  return (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-border/15"
                      style={{ top: `${top}px` }}
                    />
                  );
                })}

                {/* Course blocks */}
                {timelineItems.map((item) => {
                  const top = ((item.startMinutes - TIMELINE_START) / TIMELINE_RANGE) * TIMELINE_HEIGHT;
                  const height = ((item.endMinutes - item.startMinutes) / TIMELINE_RANGE) * TIMELINE_HEIGHT;
                  const colors = COLOR_MAP[item.color] || COLOR_MAP.blue;

                  return (
                    <div
                      key={item.id}
                      className={`
                        absolute left-3 right-3 rounded-xl border-l-[3px] ${colors.border}
                        bg-gradient-to-r ${colors.gradient}
                        p-3 overflow-hidden cursor-pointer
                        hover:shadow-md transition-shadow
                      `}
                      style={{ top: `${top + 1}px`, height: `${Math.max(height - 2, 32)}px` }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={`font-mono text-[11px] font-semibold ${colors.text} mb-0.5`}>
                            {item.code}
                          </p>
                          <p className="text-sm font-medium text-foreground/70 leading-tight truncate">
                            {item.title}
                          </p>
                        </div>
                        {item.type && (
                          <span className="text-[9px] font-medium text-foreground/30 bg-foreground/[0.04] px-1.5 py-0.5 rounded-md flex-shrink-0">
                            {item.type}
                          </span>
                        )}
                      </div>
                      {height > 50 && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <p className="font-mono text-[10px] text-foreground/30">
                            {item.startLabel} -- {item.endLabel}
                          </p>
                          <span className="text-foreground/10">|</span>
                          <p className="text-[10px] text-foreground/25 truncate">{item.room}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* NOW line */}
                {isToday && nowInRange && (
                  <div
                    className="absolute left-0 right-0 z-10 pointer-events-none"
                    style={{ top: `${nowPosition}px` }}
                  >
                    <div className="relative flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary -ml-[5px] flex-shrink-0 shadow-sm" />
                      <div className="flex-1 h-px bg-primary" />
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {timelineItems.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm text-foreground/25">No classes on {DAYS_FULL[selectedDay]}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Weekly overview heat map */}
      <BlurFade delay={0.2}>
        <div className="rounded-xl border border-border/60 p-5 card-hover-glow">
          <p className="font-serif text-sm text-foreground/50 mb-4">Weekly Overview</p>
          <div className="grid grid-cols-5 gap-1">
            {/* Day headers */}
            {DAYS.map((day, i) => (
              <div
                key={day}
                className={`text-center text-[10px] font-medium uppercase tracking-wider pb-2 ${
                  today >= 1 && today <= 5 && i === today - 1
                    ? "text-primary"
                    : "text-foreground/25"
                }`}
              >
                {day}
              </div>
            ))}
            {/* Hour rows */}
            {HOURS.map((hour) => (
              DAYS.map((_, dayIdx) => {
                const key = `${dayIdx}-${hour}`;
                const colors = weeklyDots[key];
                const isSelectedSlot = dayIdx === selectedDay;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDay(dayIdx)}
                    className={`
                      h-5 rounded-sm flex items-center justify-center transition-all cursor-pointer
                      ${isSelectedSlot ? "bg-primary/[0.04]" : "hover:bg-muted/40"}
                    `}
                  >
                    {colors ? (
                      <div className="flex gap-0.5">
                        {colors.slice(0, 2).map((c, ci) => {
                          const dotColors = COLOR_MAP[c] || COLOR_MAP.blue;
                          return (
                            <div
                              key={ci}
                              className={`w-2 h-2 rounded-full ${dotColors.dot}`}
                              style={{ opacity: 0.7 }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-foreground/[0.06]" />
                    )}
                  </button>
                );
              })
            ))}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
