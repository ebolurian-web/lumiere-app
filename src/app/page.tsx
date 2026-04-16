"use client";

import { useRef } from "react";
import Link from "next/link";
import { Shield, ArrowRight, MapPin, Phone, Mail, ChevronDown, GraduationCap, BookOpen, Settings } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Particles } from "@/components/ui/particles";
import { TextAnimate } from "@/components/ui/text-animate";
import { Marquee } from "@/components/ui/marquee";
import { BrowserMockup } from "@/components/ui/browser-mockup";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeroDashboard } from "@/components/homepage/hero-dashboard";
import { PortalPreview } from "@/components/homepage/portal-preview";

const ANNOUNCEMENTS = [
  "Fall 2026 enrollment opens May 1",
  "Research Fellowship applications due June 15",
  "Commencement ceremony: August 22, 2026",
  "New: M.S. Learning Design now fully online",
];

export default function HomePage() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: problemRef,
    offset: ["start end", "end start"],
  });
  const problemOpacity1 = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const problemOpacity2 = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const problemOpacity3 = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top utility bar */}
      <div className="bg-navy text-white/70 text-xs py-2 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              Cambridge, MA
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              (617) 555-0142
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/signin" className="hover:text-white transition-colors">Student Portal</Link>
            <Link href="/auth/signin" className="hover:text-white transition-colors">Faculty & Staff</Link>
            <Link href="/auth/signin" className="hover:text-white transition-colors">Administration</Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl font-semibold tracking-tight text-navy dark:text-foreground block leading-tight">
                Lumiere University
              </span>
              <span className="text-[10px] text-foreground/35 uppercase tracking-[0.2em]">
                Higher-Ed Pathways
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-sans text-sm text-foreground/60">
            <Link href="#academics" className="hover:text-foreground transition-colors">Academics</Link>
            <Link href="#platform" className="hover:text-foreground transition-colors">Platform</Link>
            <Link href="#admissions" className="hover:text-foreground transition-colors">Admissions</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/signin">
              <Button className="bg-primary hover:bg-primary/90 text-white h-9 px-5">Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Announcement ticker */}
      <div className="border-b border-border/30 py-2 overflow-hidden bg-background-alt/50">
        <Marquee pauseOnHover className="[--duration:40s] [--gap:4rem]">
          {ANNOUNCEMENTS.map((a) => (
            <span key={a} className="text-xs text-foreground/40 flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-primary/40" />
              {a}
            </span>
          ))}
        </Marquee>
      </div>

      {/* ================================================================ */}
      {/* HERO — Institutional with live platform demo                     */}
      {/* ================================================================ */}
      <section className="relative pt-20 md:pt-28 pb-8 px-6 overflow-hidden">
        <Particles className="absolute inset-0" quantity={20} color="#A41034" size={0.3} staticity={80} ease={100} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="max-w-2xl mb-12">
            <TextAnimate
              as="h1"
              by="word"
              animation="blurInUp"
              className="font-display text-[2.8rem] md:text-[3.5rem] lg:text-[4.2rem] font-light text-navy dark:text-foreground leading-[1.1] mb-8 tracking-tight"
            >
              Where rigorous scholarship meets purposeful innovation
            </TextAnimate>

            <BlurFade delay={0.5} duration={0.5}>
              <p className="text-lg text-foreground/45 max-w-xl leading-relaxed mb-10">
                Lumiere University offers undergraduate, graduate, and fellowship
                programs — powered by a unified academic platform for students,
                faculty, and administration.
              </p>
            </BlurFade>

            <BlurFade delay={0.7} duration={0.5}>
              <div className="flex items-center gap-4">
                <Link href="/auth/signin">
                  <ShimmerButton
                    background="rgba(164,16,52,1)"
                    shimmerColor="rgba(255,255,255,0.25)"
                    shimmerSize="0.04em"
                    borderRadius="10px"
                    shimmerDuration="4s"
                    className="h-12 px-8 text-[15px] font-medium gap-2"
                  >
                    Enter the portal
                    <ArrowRight className="w-4 h-4" />
                  </ShimmerButton>
                </Link>
                <Link href="#academics">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-[15px]">
                    Explore programs
                  </Button>
                </Link>
              </div>
            </BlurFade>
          </div>

          {/* Live animated dashboard mockup */}
          <BlurFade delay={0.9} duration={0.7}>
            <BrowserMockup url="app.lumiere.edu/student/dashboard" className="shadow-2xl">
              <HeroDashboard />
            </BrowserMockup>
          </BlurFade>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-4 h-4 text-foreground/15 animate-scroll-bounce" />
        </div>
      </section>

      {/* ================================================================ */}
      {/* NUMBERS                                                          */}
      {/* ================================================================ */}
      <section className="border-y border-border/50 py-14 px-6 bg-background-alt/30">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 1247, label: "Enrolled Students" },
              { value: 4, label: "Degree Programs" },
              { value: 42, label: "Faculty Members" },
              { value: 96, label: "Placement Rate", suffix: "%" },
            ].map(({ value, label, suffix }) => (
              <div key={label}>
                <p className="font-mono text-3xl font-semibold text-foreground mb-1.5">
                  <NumberTicker value={value} delay={0.3} />
                  {suffix && <span className="text-foreground/30">{suffix}</span>}
                </p>
                <p className="text-xs text-foreground/35 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ================================================================ */}
      {/* ACADEMICS — Programs                                             */}
      {/* ================================================================ */}
      <section id="academics" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="max-w-lg mb-16">
              <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">Academics</p>
              <h2 className="font-display text-3xl md:text-[2.5rem] text-navy dark:text-foreground leading-tight font-light">
                Programs built around how people <em className="font-medium italic">actually learn</em>
              </h2>
            </div>
          </ScrollReveal>

          {[
            { title: "B.S. Data Science", desc: "Machine learning, statistical modeling, and data engineering. Year-long industry capstone.", details: "36 months · Hybrid · 534 enrolled", tag: "Undergraduate" },
            { title: "Transfer Pathways", desc: "Articulation agreements with 40+ partners. Individualized credit evaluation.", details: "Custom · Hybrid · 298 enrolled", tag: "Undergraduate" },
            { title: "M.S. Learning Design & Technology", desc: "Instructional systems, learning analytics, and educational technology leadership.", details: "24 months · Online · 287 enrolled", tag: "Graduate" },
            { title: "Research Fellowship", desc: "Selective cohort for advanced scholars. Funded research and faculty mentorship.", details: "9 months · Cohort · 128 fellows", tag: "Fellowship" },
          ].map(({ title, desc, details, tag }, i) => (
            <ScrollReveal key={title} delay={i * 0.06}>
              <div className="group py-8 border-b border-border/40 last:border-0 cursor-pointer">
                <div className="flex items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-xl md:text-2xl font-medium text-foreground group-hover:text-primary transition-colors">{title}</h3>
                      <span className="text-[10px] uppercase tracking-wider text-foreground/25 border border-border/50 rounded px-2 py-0.5">{tag}</span>
                    </div>
                    <p className="text-foreground/45 leading-relaxed max-w-2xl mb-3">{desc}</p>
                    <p className="font-mono text-xs text-foreground/30">{details}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/15 group-hover:text-primary group-hover:translate-x-1 transition-all mt-2 flex-shrink-0" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* PLATFORM — Problem + three-step walkthrough                      */}
      {/* ================================================================ */}
      <section ref={problemRef} id="platform" className="bg-background-alt py-28 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Problem framing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-24">
            <div className="md:sticky md:top-32">
              <ScrollReveal direction="left">
                <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">The Platform</p>
                <h2 className="font-display text-3xl md:text-[2.5rem] text-navy dark:text-foreground leading-tight mb-6 font-light">
                  One entrance, three disciplined workspaces
                </h2>
                <p className="text-foreground/40 leading-relaxed">
                  Students, faculty, and administrators each get a purpose-built portal.
                  The same underlying data, surfaced with different intent — degree progress
                  for students, gradebooks for staff, approvals for admins.
                </p>
              </ScrollReveal>
            </div>
            <div className="space-y-6 pt-4">
              {[
                { stat: "4+", text: "disconnected portals replaced by a single sign-in with role-based routing" },
                { stat: "48h", text: "average approval turnaround — course overrides, transfers, and appeals" },
                { stat: "100%", text: "of degree audits, grade tracking, and document management in one place" },
              ].map(({ stat, text }, i) => (
                <motion.div
                  key={stat}
                  style={{ opacity: [problemOpacity1, problemOpacity2, problemOpacity3][i] }}
                  className="flex gap-5 p-6 rounded-xl border border-border/40 bg-card"
                >
                  <span className="font-mono text-3xl font-bold text-primary leading-none flex-shrink-0">{stat}</span>
                  <p className="text-foreground/50 leading-relaxed pt-1">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Three-step walkthrough */}
          <ScrollReveal>
            <h2 className="font-display text-3xl text-navy dark:text-foreground mb-16 font-light">
              Three portals, one unified experience
            </h2>
          </ScrollReveal>

          <div className="space-y-24">
            {/* Student */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left" delay={0.1}>
                <div>
                  <span className="font-mono text-5xl font-bold text-foreground/[0.06]">01</span>
                  <h3 className="font-display text-2xl font-medium -mt-4 mb-3">Students see everything</h3>
                  <p className="text-foreground/45 leading-relaxed mb-4">
                    Courses, grades, degree progress, schedule, documents, and messaging — one dashboard. No switching between apps.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student Portal</span>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.2}>
                <BrowserMockup url="app.lumiere.edu/student" className="shadow-lg">
                  <div className="p-4 space-y-2.5 min-h-[200px]">
                    <div className="grid grid-cols-4 gap-2">
                      {["4 enrolled", "6 pending", "3.72 GPA", "73% degree"].map((s) => (
                        <div key={s} className="rounded-md bg-muted/30 p-2 text-center">
                          <p className="font-mono text-[10px] font-medium">{s.split(" ")[0]}</p>
                          <p className="text-[8px] text-foreground/30">{s.split(" ").slice(1).join(" ")}</p>
                        </div>
                      ))}
                    </div>
                    {["DS 310 Machine Learning", "DS 425 Statistical Modeling", "DS 350 Data Ethics"].map((c, i) => (
                      <div key={c} className="flex items-center gap-2 p-2 rounded-md bg-muted/20">
                        <div className={`w-1.5 h-1.5 rounded-full ${["bg-info", "bg-success", "bg-purple-500"][i]}`} />
                        <span className="text-[10px] text-foreground/60">{c}</span>
                      </div>
                    ))}
                  </div>
                </BrowserMockup>
              </ScrollReveal>
            </div>

            {/* Staff — reversed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="scale" delay={0.1} className="md:order-2">
                <div>
                  <span className="font-mono text-5xl font-bold text-foreground/[0.06]">02</span>
                  <h3 className="font-display text-2xl font-medium -mt-4 mb-3">Staff manage with precision</h3>
                  <p className="text-foreground/45 leading-relaxed mb-4">
                    Gradebooks, rosters, course analytics, and teaching schedules. Real-time visibility into student performance.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-success">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Staff Portal</span>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="left" delay={0.2} className="md:order-1">
                <BrowserMockup url="app.lumiere.edu/staff" className="shadow-lg">
                  <div className="p-4 space-y-2.5 min-h-[200px]">
                    <div className="grid grid-cols-3 gap-2">
                      {["87 students", "12 ungraded", "8 hrs/week"].map((s) => (
                        <div key={s} className="rounded-md bg-muted/30 p-2 text-center">
                          <p className="font-mono text-[10px] font-medium">{s.split(" ")[0]}</p>
                          <p className="text-[8px] text-foreground/30">{s.split(" ").slice(1).join(" ")}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-md bg-muted/20 p-2.5">
                      <p className="text-[8px] text-foreground/25 uppercase tracking-wider mb-1.5">Grading Queue</p>
                      {["Neural Network — 23 submissions", "Problem Set 7 — 18 submissions"].map((g) => (
                        <div key={g} className="flex items-center gap-2 py-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                          <span className="text-[10px] text-foreground/50">{g}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </BrowserMockup>
              </ScrollReveal>
            </div>

            {/* Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="up" delay={0.1}>
                <div>
                  <span className="font-mono text-5xl font-bold text-foreground/[0.06]">03</span>
                  <h3 className="font-display text-2xl font-medium -mt-4 mb-3">Admins approve in real-time</h3>
                  <p className="text-foreground/45 leading-relaxed mb-4">
                    Approval queues, enrollment reporting, financial overview, and system-wide configuration.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={0.2}>
                <BrowserMockup url="app.lumiere.edu/admin" className="shadow-lg">
                  <div className="p-4 space-y-2.5 min-h-[200px]">
                    <div className="grid grid-cols-4 gap-2">
                      {["1,247 enrolled", "42 courses", "4 pending", "$2.1M revenue"].map((s) => (
                        <div key={s} className="rounded-md bg-muted/30 p-2 text-center">
                          <p className="font-mono text-[10px] font-medium">{s.split(" ")[0]}</p>
                          <p className="text-[8px] text-foreground/30">{s.split(" ").slice(1).join(" ")}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-md bg-muted/20 p-2.5">
                      <p className="text-[8px] text-foreground/25 uppercase tracking-wider mb-1.5">Pending Approvals</p>
                      {[
                        { text: "Course Override — Maya Rodriguez", p: "normal" },
                        { text: "Leave of Absence — Sofia Almeida", p: "high" },
                      ].map((a) => (
                        <div key={a.text} className="flex items-center gap-2 py-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${a.p === "high" ? "bg-danger" : "bg-warning"}`} />
                          <span className="text-[10px] text-foreground/50 flex-1">{a.text}</span>
                          {a.p === "high" && <span className="text-[8px] text-danger">High</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </BrowserMockup>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* INTERACTIVE PORTAL PREVIEW                                       */}
      {/* ================================================================ */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">Live Preview</p>
              <h2 className="font-display text-3xl md:text-[2.5rem] text-navy dark:text-foreground leading-tight font-light">
                Explore each portal
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <PortalPreview />
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* ADMISSIONS                                                       */}
      {/* ================================================================ */}
      <section id="admissions" className="bg-background-alt py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <ScrollReveal direction="left">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4">Admissions</p>
                <h2 className="font-display text-3xl md:text-[2.5rem] text-navy dark:text-foreground leading-tight mb-6 font-light">
                  Begin your application
                </h2>
                <p className="text-foreground/45 leading-relaxed mb-4">
                  We review applications holistically — academic record, professional
                  experience, and a personal statement about your intellectual curiosity.
                </p>
                <p className="text-foreground/45 leading-relaxed">
                  Fall 2026 applications open May 1. Early decision applicants
                  receive priority financial aid consideration.
                </p>
                <div className="mt-8">
                  <Link href="/auth/signin">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white h-12 px-8 text-[15px]">
                      Start your application <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <div className="space-y-4">
                {[
                  { label: "Application deadline", value: "July 15, 2026" },
                  { label: "Early decision", value: "May 30, 2026" },
                  { label: "Tuition (per year)", value: "$48,200" },
                  { label: "Average financial aid", value: "$31,400" },
                  { label: "Acceptance rate", value: "23%" },
                  { label: "Average entering GPA", value: "3.7" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-border/30">
                    <span className="text-sm text-foreground/50">{label}</span>
                    <span className="font-mono text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TESTIMONIAL                                                      */}
      {/* ================================================================ */}
      <section className="py-24 px-6">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <div className="gradient-divider mb-10" />
            <blockquote className="font-serif text-xl md:text-2xl text-foreground/55 leading-relaxed italic mb-6">
              &ldquo;Lumiere gave me the tools to think rigorously about data and the
              space to figure out what kind of scholar I wanted to become.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">MR</div>
              <div className="text-left">
                <p className="text-sm font-medium">Maya Rodriguez</p>
                <p className="text-xs text-foreground/30">B.S. Data Science, Class of 2027</p>
              </div>
            </div>
            <div className="gradient-divider mt-10" />
          </div>
        </ScrollReveal>
      </section>

      {/* ================================================================ */}
      {/* CTA — Dark section with particles                                */}
      {/* ================================================================ */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-navy dark:bg-card border border-border/20 overflow-hidden px-8 py-16 md:py-20 text-center">
            <Particles className="absolute inset-0" quantity={15} color="#D44060" size={0.3} staticity={80} ease={100} />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl text-white dark:text-foreground mb-4 font-light">
                Experience the platform
              </h2>
              <p className="text-white/40 dark:text-foreground/40 mb-10 max-w-md mx-auto">
                Sign in to explore the student, faculty, and administrative portals
                with pre-loaded demo data.
              </p>
              <Link href="/auth/signin">
                <ShimmerButton
                  background="rgba(164,16,52,1)"
                  shimmerColor="rgba(255,255,255,0.3)"
                  shimmerSize="0.04em"
                  borderRadius="10px"
                  shimmerDuration="4s"
                  className="h-12 px-10 text-[15px] font-medium gap-2 mx-auto"
                >
                  Enter the portal
                  <ArrowRight className="w-4 h-4" />
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FOOTER                                                           */}
      {/* ================================================================ */}
      <footer className="bg-navy text-white/60 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white/80" />
                </div>
                <span className="font-display text-base font-semibold text-white tracking-tight">Lumiere University</span>
              </div>
              <p className="text-xs leading-relaxed text-white/35">
                Preparing the next generation of scholars at the intersection
                of technology and human systems.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/25 mb-4">Academics</p>
              <div className="space-y-2 text-sm">
                <Link href="#academics" className="block hover:text-white transition-colors">B.S. Data Science</Link>
                <Link href="#academics" className="block hover:text-white transition-colors">Transfer Pathways</Link>
                <Link href="#academics" className="block hover:text-white transition-colors">M.S. Learning Design</Link>
                <Link href="#academics" className="block hover:text-white transition-colors">Research Fellowship</Link>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/25 mb-4">Resources</p>
              <div className="space-y-2 text-sm">
                <Link href="/auth/signin" className="block hover:text-white transition-colors">Student Portal</Link>
                <Link href="/auth/signin" className="block hover:text-white transition-colors">Faculty Portal</Link>
                <Link href="#" className="block hover:text-white transition-colors">Library</Link>
                <Link href="#" className="block hover:text-white transition-colors">Academic Calendar</Link>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/25 mb-4">Contact</p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> 124 Brattle Street, Cambridge, MA</p>
                <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> (617) 555-0142</p>
                <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> admissions@lumiere.edu</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex items-center justify-between">
            <p className="text-xs text-white/25">&copy; {new Date().getFullYear()} Lumiere University. All rights reserved.</p>
            <div className="flex items-center gap-6 text-xs text-white/25">
              <Link href="#" className="hover:text-white/50 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white/50 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white/50 transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
