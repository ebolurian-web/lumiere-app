"use client";

import { useRef } from "react";
import Link from "next/link";
import { Shield, ArrowRight, ChevronDown, GraduationCap, BookOpen, Settings } from "lucide-react";
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
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl font-semibold tracking-tight text-navy dark:text-foreground block leading-tight">
                Lumiere
              </span>
              <span className="text-[10px] text-foreground/30 uppercase tracking-[0.2em]">
                Higher-Ed Pathways
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-sans text-sm text-foreground/50">
            <Link href="#platform" className="hover:text-foreground transition-colors">Platform</Link>
            <Link href="#workspaces" className="hover:text-foreground transition-colors">Workspaces</Link>
            <Link href="#preview" className="hover:text-foreground transition-colors">Preview</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/signin">
              <Button className="bg-primary hover:bg-primary/90 text-white h-9 px-5">Enter Portal</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}
      <section className="relative pt-20 md:pt-28 pb-8 px-6 overflow-hidden">
        <Particles className="absolute inset-0" quantity={20} color="#A41034" size={0.3} staticity={80} ease={100} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="max-w-2xl mb-12">
            <BlurFade delay={0.05} duration={0.4}>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-5">
                Private Academic Operating System
              </p>
            </BlurFade>

            <TextAnimate
              as="h1"
              by="word"
              animation="blurInUp"
              className="font-display text-[2.8rem] md:text-[3.5rem] lg:text-[4.2rem] font-light text-navy dark:text-foreground leading-[1.08] mb-8 tracking-tight"
            >
              Institutional clarity for ambitious students and the teams guiding them
            </TextAnimate>

            <BlurFade delay={0.6} duration={0.5}>
              <p className="text-lg text-foreground/45 max-w-xl leading-relaxed mb-10">
                One entrance, three disciplined workspaces. Degree progression,
                advising, course management, and institutional reporting — unified
                in a single platform.
              </p>
            </BlurFade>

            <BlurFade delay={0.8} duration={0.5}>
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
                <Link href="#platform">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-[15px]">
                    How it works
                  </Button>
                </Link>
              </div>
            </BlurFade>
          </div>

          {/* Live animated dashboard */}
          <BlurFade delay={1.0} duration={0.7}>
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
              { value: 3, label: "Role-Based Portals" },
              { value: 27, label: "Operational Pages" },
              { value: 48, label: "Hour Avg. Approval", suffix: "h" },
              { value: 100, label: "Data Unified", suffix: "%" },
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
      {/* PLATFORM — The problem + how it works                            */}
      {/* ================================================================ */}
      <section ref={problemRef} id="platform" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-28">
            <div className="md:sticky md:top-32">
              <ScrollReveal direction="left">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4">The Problem</p>
                <h2 className="font-display text-3xl md:text-[2.5rem] text-navy dark:text-foreground leading-tight mb-6 font-light">
                  Higher ed still runs on fragmented systems
                </h2>
                <p className="text-foreground/40 leading-relaxed">
                  Students, staff, and administrators each navigate different tools
                  with different logins, different data, and different interfaces.
                  Information falls through the cracks. Approvals stall in email.
                  Degree audits are manual.
                </p>
              </ScrollReveal>
            </div>
            <div className="space-y-6 pt-4">
              {[
                { stat: "4+", text: "disconnected portals replaced by a single entrance with role-based routing" },
                { stat: "48h", text: "average approval turnaround for course overrides, transfers, and appeals" },
                { stat: "100%", text: "of degree audits, grade tracking, and document management — unified" },
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

          {/* Three workspaces */}
          <ScrollReveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4">The Solution</p>
            <h2 className="font-display text-3xl md:text-[2.5rem] text-navy dark:text-foreground mb-16 font-light max-w-lg">
              Three portals, one unified platform
            </h2>
          </ScrollReveal>

          <div className="space-y-24" id="workspaces">
            {/* Student */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left" delay={0.1}>
                <div>
                  <span className="font-mono text-5xl font-bold text-foreground/[0.06]">01</span>
                  <h3 className="font-display text-2xl font-medium -mt-4 mb-3">Student Workspace</h3>
                  <p className="text-foreground/45 leading-relaxed mb-4">
                    Courses, grades, degree progress, schedule, documents, and
                    messaging. Everything a student needs in one dashboard — no
                    more switching between apps.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>9 operational pages</span>
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
                  <h3 className="font-display text-2xl font-medium -mt-4 mb-3">Staff Workspace</h3>
                  <p className="text-foreground/45 leading-relaxed mb-4">
                    Gradebooks, rosters, course analytics, and teaching schedules.
                    Real-time visibility into student performance and at-risk indicators.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-success">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>7 operational pages</span>
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
                  <h3 className="font-display text-2xl font-medium -mt-4 mb-3">Admin Workspace</h3>
                  <p className="text-foreground/45 leading-relaxed mb-4">
                    Approval queues, enrollment reporting, financial overview, and
                    system configuration. No more email chains for course overrides.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Settings className="w-3.5 h-3.5" />
                    <span>8 operational pages</span>
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
      <section className="bg-background-alt py-28 px-6" id="preview">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4">Live Preview</p>
              <h2 className="font-display text-3xl md:text-[2.5rem] text-navy dark:text-foreground leading-tight font-light">
                Explore each workspace
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <PortalPreview />
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SYSTEM DESIGN PRINCIPLES                                         */}
      {/* ================================================================ */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <ScrollReveal direction="left">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4">System Design</p>
              <h2 className="font-display text-3xl md:text-[2.5rem] text-navy dark:text-foreground leading-tight mb-6 font-light">
                A portal that stays premium at first contact and practical in daily use
              </h2>
              <p className="text-foreground/40 leading-relaxed">
                The rebuild is not about adding more dashboard chrome. It is about
                composition, hierarchy, and trust — making each workspace feel like
                it was built specifically for the person using it.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <div className="space-y-6 pt-2">
                {[
                  { title: "Role-based routing", desc: "One sign-in, automatic routing to the right workspace based on credentials." },
                  { title: "Unified data layer", desc: "Student, staff, and admin portals share the same underlying data — no sync issues, no stale information." },
                  { title: "Operational depth", desc: "27 production-ready pages covering enrollment, grading, approvals, finance, and degree management." },
                  { title: "Institutional feel", desc: "Premium typography, restrained color, and deliberate whitespace. Not a SaaS dashboard — an academic operating system." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-1 rounded-full bg-primary/30 flex-shrink-0" />
                    <div>
                      <p className="font-serif font-semibold mb-1">{title}</p>
                      <p className="text-sm text-foreground/40 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CTA                                                              */}
      {/* ================================================================ */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-navy dark:bg-card border border-border/20 overflow-hidden px-8 py-16 md:py-20 text-center">
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl text-white dark:text-foreground mb-4 font-light">
                Experience the platform
              </h2>
              <p className="text-white/40 dark:text-foreground/40 mb-10 max-w-md mx-auto">
                Sign in to explore all three workspaces with pre-loaded institutional data.
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
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-navy text-white flex items-center justify-center">
              <Shield className="w-3 h-3" />
            </div>
            <span className="font-display text-xs tracking-wide text-navy dark:text-foreground">
              Lumiere Higher-Ed Pathways
            </span>
          </div>
          <p className="text-xs text-foreground/20">
            &copy; {new Date().getFullYear()} Lumiere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
