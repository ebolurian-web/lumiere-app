"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserMockup } from "@/components/ui/browser-mockup";
import { GraduationCap, BookOpen, Settings } from "lucide-react";

const PORTALS = [
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    color: "bg-info",
    activeColor: "bg-info/10 text-info border-info/30",
    url: "app.lumiere.edu/student",
    content: (
      <div className="p-5 space-y-3 min-h-[280px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-base font-semibold text-navy dark:text-foreground">Good afternoon, Maya</p>
            <p className="text-[10px] text-foreground/30">B.S. Data Science · Junior · 3.72 GPA</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[{ l: "Enrolled", v: "4" }, { l: "Pending", v: "6" }, { l: "GPA", v: "3.72" }, { l: "Degree", v: "73%" }].map(({ l, v }) => (
            <div key={l} className="rounded-lg border border-border/30 p-2.5 bg-muted/20">
              <p className="text-[7px] uppercase tracking-wider text-foreground/20 mb-0.5">{l}</p>
              <p className="font-mono text-xs font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["DS 310 Machine Learning", "DS 425 Statistical Modeling", "DS 350 Data Ethics", "RF 601 Research Methods"].map((c, i) => (
            <div key={c} className="rounded-lg border border-border/30 p-2.5 bg-muted/10">
              <div className={`w-full h-0.5 rounded-full mb-2 ${["bg-info", "bg-success", "bg-purple-500", "bg-pink-500"][i]}`} />
              <p className="text-[10px] font-medium truncate">{c}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "staff",
    label: "Staff",
    icon: BookOpen,
    color: "bg-success",
    activeColor: "bg-success/10 text-success border-success/30",
    url: "app.lumiere.edu/staff",
    content: (
      <div className="p-5 space-y-3 min-h-[280px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-base font-semibold text-navy dark:text-foreground">Dr. Sarah Kim</p>
            <p className="text-[10px] text-foreground/30">Department of Data Science · 3 Active Courses</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[{ l: "Students", v: "87" }, { l: "Ungraded", v: "12" }, { l: "This Week", v: "8 hrs" }].map(({ l, v }) => (
            <div key={l} className="rounded-lg border border-border/30 p-2.5 bg-muted/20">
              <p className="text-[7px] uppercase tracking-wider text-foreground/20 mb-0.5">{l}</p>
              <p className="font-mono text-xs font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border/30 p-3 bg-muted/10">
          <p className="text-[8px] uppercase tracking-wider text-foreground/20 mb-2">Grading Queue</p>
          {["Neural Network Implementation — 23 submissions", "Problem Set 7 — 18 submissions", "Midterm Exam — draft"].map((item) => (
            <div key={item} className="flex items-center gap-2 py-1.5 border-b border-border/20 last:border-0">
              <div className="w-1.5 h-1.5 rounded-full bg-warning" />
              <p className="text-[10px] text-foreground/50">{item}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "admin",
    label: "Admin",
    icon: Settings,
    color: "bg-gold",
    activeColor: "bg-gold/10 text-gold border-gold/30",
    url: "app.lumiere.edu/admin",
    content: (
      <div className="p-5 space-y-3 min-h-[280px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-base font-semibold text-navy dark:text-foreground">Victoria Harrington</p>
            <p className="text-[10px] text-foreground/30">Provost · Lumiere University</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[{ l: "Enrollment", v: "1,247" }, { l: "Courses", v: "42" }, { l: "Approvals", v: "4" }, { l: "Revenue", v: "$2.1M" }].map(({ l, v }) => (
            <div key={l} className="rounded-lg border border-border/30 p-2.5 bg-muted/20">
              <p className="text-[7px] uppercase tracking-wider text-foreground/20 mb-0.5">{l}</p>
              <p className="font-mono text-xs font-semibold">{v}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border/30 p-3 bg-muted/10">
          <p className="text-[8px] uppercase tracking-wider text-foreground/20 mb-2">Pending Approvals</p>
          {[
            { text: "Course Override — Maya Rodriguez", priority: "normal" },
            { text: "Transfer Credit — Amara Okonkwo", priority: "normal" },
            { text: "Leave of Absence — Sofia Almeida", priority: "high" },
            { text: "Grade Appeal — Raj Patel", priority: "normal" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 py-1.5 border-b border-border/20 last:border-0">
              <div className={`w-1.5 h-1.5 rounded-full ${item.priority === "high" ? "bg-danger" : "bg-warning"}`} />
              <p className="text-[10px] text-foreground/50 flex-1">{item.text}</p>
              {item.priority === "high" && <span className="text-[8px] text-danger font-medium">High</span>}
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function PortalPreview() {
  const [active, setActive] = useState("student");
  const activePortal = PORTALS.find((p) => p.id === active)!;

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {PORTALS.map(({ id, label, icon: Icon, color, activeColor }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
              active === id
                ? activeColor
                : "border-border/40 text-foreground/40 hover:text-foreground/60 hover:border-border/60"
            }`}
          >
            <div className={`w-1.5 h-4 rounded-full ${active === id ? color : "bg-foreground/10"} transition-colors`} />
            {label}
          </button>
        ))}
      </div>

      {/* Mockup */}
      <BrowserMockup url={activePortal.url} className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activePortal.content}
          </motion.div>
        </AnimatePresence>
      </BrowserMockup>
    </div>
  );
}
