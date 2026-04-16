"use client";

import { BlurFade } from "@/components/ui/blur-fade";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const HOURS = Array.from({ length: 10 }, (_, i) => i + 8); // 8am–5pm

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-info/10", border: "border-info/20", text: "text-info" },
  green: { bg: "bg-success/10", border: "border-success/20", text: "text-success" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-600" },
  amber: { bg: "bg-warning/10", border: "border-warning/20", text: "text-warning" },
  office: { bg: "bg-primary/[0.06]", border: "border-primary/20", text: "text-primary" },
};

interface TeachingEvent {
  day: number; // 1=Mon
  startTime: string;
  endTime: string;
  title: string;
  subtitle: string;
  room: string;
  color: string;
}

const EVENTS: TeachingEvent[] = [
  // DS 310 — MWF 10:00–10:50
  { day: 1, startTime: "10:00", endTime: "10:50", title: "DS 310", subtitle: "Machine Learning", room: "Turing Hall 204", color: "blue" },
  { day: 3, startTime: "10:00", endTime: "10:50", title: "DS 310", subtitle: "Machine Learning", room: "Turing Hall 204", color: "blue" },
  { day: 5, startTime: "10:00", endTime: "10:50", title: "DS 310", subtitle: "Machine Learning", room: "Turing Hall 204", color: "blue" },
  // DS 410 — TTh 13:00–14:20
  { day: 2, startTime: "13:00", endTime: "14:20", title: "DS 410", subtitle: "Deep Learning", room: "Babbage Lab 112", color: "purple" },
  { day: 4, startTime: "13:00", endTime: "14:20", title: "DS 410", subtitle: "Deep Learning", room: "Babbage Lab 112", color: "purple" },
  // DS 210 — MWF 11:00–11:50
  { day: 1, startTime: "11:00", endTime: "11:50", title: "DS 210", subtitle: "Statistical Foundations", room: "Turing Hall 108", color: "green" },
  { day: 3, startTime: "11:00", endTime: "11:50", title: "DS 210", subtitle: "Statistical Foundations", room: "Turing Hall 108", color: "green" },
  { day: 5, startTime: "11:00", endTime: "11:50", title: "DS 210", subtitle: "Statistical Foundations", room: "Turing Hall 108", color: "green" },
  // Office Hours — Wed 2–4pm
  { day: 3, startTime: "14:00", endTime: "16:00", title: "Office Hours", subtitle: "Drop-in", room: "Turing Hall 206", color: "office" },
];

export default function StaffSchedulePage() {
  const getEventsForDay = (dayIndex: number) =>
    EVENTS.filter((e) => e.day === dayIndex + 1);

  const today = new Date().getDay(); // 0=Sun
  const todayIndex = today === 0 ? -1 : today - 1; // 0=Mon

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">Teaching Schedule</h1>
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
                  {dayEvents.map((event, idx) => {
                    const colors = COLOR_MAP[event.color] || COLOR_MAP.blue;
                    const [startH, startM] = event.startTime.split(":").map(Number);
                    const [endH, endM] = event.endTime.split(":").map(Number);
                    const durationMin = (endH * 60 + endM) - (startH * 60 + startM);

                    return (
                      <div
                        key={`${event.title}-${dayIndex}-${idx}`}
                        className={`rounded-lg border ${colors.border} ${colors.bg} p-2.5 cursor-pointer hover:opacity-80 transition-opacity`}
                        style={{ minHeight: `${Math.max(durationMin, 50)}px` }}
                      >
                        <p className={`font-mono text-[10px] font-medium ${colors.text} mb-0.5`}>
                          {event.title}
                        </p>
                        <p className="text-xs font-medium text-foreground/70 leading-tight mb-1">
                          {event.subtitle}
                        </p>
                        <p className="font-mono text-[10px] text-foreground/30">
                          {event.startTime} – {event.endTime}
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

      {/* Weekly summary */}
      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-2">Teaching Hours</p>
            <p className="font-mono text-2xl font-semibold text-foreground">10.5 <span className="text-sm text-foreground/30">hrs/week</span></p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-2">Office Hours</p>
            <p className="font-mono text-2xl font-semibold text-foreground">2.0 <span className="text-sm text-foreground/30">hrs/week</span></p>
          </div>
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-2">Next Office Hours</p>
            <p className="font-mono text-2xl font-semibold text-foreground">Wed <span className="text-sm text-foreground/30">2:00 PM</span></p>
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
