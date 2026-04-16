"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Settings,
  Quote,
} from "lucide-react";
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

/* ------------------------------------------------------------------ */
/*  Workspace card data                                                */
/* ------------------------------------------------------------------ */
const WORKSPACES = [
  {
    id: "01",
    code: "PORTAL_01",
    title: "Student Interface",
    desc: "Courses, grades, degree progress, schedule, documents, and messaging. Everything a student needs in one disciplined workspace.",
    icon: GraduationCap,
    pages: 9,
  },
  {
    id: "02",
    code: "PORTAL_02",
    title: "Faculty Console",
    desc: "Gradebooks, rosters, course analytics, and teaching schedules. Real-time visibility into student performance and at-risk indicators.",
    icon: BookOpen,
    pages: 7,
  },
  {
    id: "03",
    code: "PORTAL_03",
    title: "Institutional Control",
    desc: "Approval queues, enrollment reporting, financial overview, and system configuration. No more email chains for course overrides.",
    icon: Settings,
    pages: 8,
  },
];

/* ------------------------------------------------------------------ */
/*  Core Architecture principles                                       */
/* ------------------------------------------------------------------ */
const ARCHITECTURE = [
  {
    num: "01",
    title: "Unified Data Layer",
    desc: "Student, staff, and admin portals share the same underlying data model. No sync issues, no stale information, no duplicated sources of truth.",
  },
  {
    num: "02",
    title: "Role-Based Intelligence",
    desc: "One sign-in, automatic routing to the right workspace. Each portal surfaces only the data and actions relevant to that role.",
  },
];

/* ================================================================== */
/*  Page Component                                                     */
/* ================================================================== */
export default function HomePage() {
  const darkSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: darkSectionRef,
    offset: ["start end", "end start"],
  });
  const archOpacity1 = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const archOpacity2 = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);

  return (
    <div className="min-h-screen bg-background">
      {/* ============================================================ */}
      {/* NAVBAR                                                       */}
      {/* ============================================================ */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-4">
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

          <div className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-widest text-foreground/40 font-sans">
            <Link
              href="#platform"
              className="hover:text-foreground transition-colors"
            >
              Platform
            </Link>
            <Link
              href="#workspaces"
              className="hover:text-foreground transition-colors"
            >
              Workspaces
            </Link>
            <Link
              href="#preview"
              className="hover:text-foreground transition-colors"
            >
              Preview
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth/signin">
              <Button className="bg-primary hover:bg-primary/90 text-white h-9 px-5 text-xs uppercase tracking-widest">
                Portal Access
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* HERO  —  12-col grid                                         */}
      {/* ============================================================ */}
      <section className="relative pt-24 md:pt-32 pb-12 px-8 overflow-hidden">
        <Particles
          className="absolute inset-0"
          quantity={20}
          color="#A41034"
          size={0.3}
          staticity={80}
          ease={100}
        />

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            {/* Left — 8 cols */}
            <div className="lg:col-span-8">
              <BlurFade delay={0.05} duration={0.4}>
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary mb-6 font-mono">
                  Private Academic Operating System
                </p>
              </BlurFade>

              <TextAnimate
                as="h1"
                by="word"
                animation="blurInUp"
                className="font-display text-[3rem] md:text-[4.5rem] lg:text-[6.5rem] font-light text-navy dark:text-foreground leading-[1.02] mb-8 tracking-tight"
              >
                Institutional Clarity for the Next Era
              </TextAnimate>

              <BlurFade delay={0.6} duration={0.5}>
                <p className="text-lg text-foreground/40 max-w-xl leading-relaxed mb-10">
                  One entrance, three disciplined workspaces. Degree progression,
                  advising, course management, and institutional reporting —
                  unified in a single platform.
                </p>
              </BlurFade>

              <BlurFade delay={0.8} duration={0.5}>
                <Link
                  href="/auth/signin"
                  className="group inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-lg"
                >
                  Enter the portal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </BlurFade>
            </div>

            {/* Right — 4 cols  pull-quote card */}
            <div className="lg:col-span-4 hidden lg:block">
              <BlurFade delay={0.9} duration={0.6}>
                <div className="rounded-2xl border border-border/40 bg-card p-8 h-full min-h-[420px] flex flex-col justify-between">
                  <div>
                    <Quote className="w-8 h-8 text-primary/30 mb-6" />
                    <p className="font-serif text-xl leading-relaxed text-foreground/70 italic">
                      &ldquo;The platform reduced our approval cycle from two
                      weeks to forty-eight hours and gave every stakeholder a
                      single source of truth.&rdquo;
                    </p>
                    <p className="text-xs text-foreground/30 mt-4 uppercase tracking-wider">
                      &mdash; Office of the Provost
                    </p>
                  </div>

                  {/* Abstract progress lines */}
                  <div className="space-y-3 pt-8">
                    {[85, 60, 45, 92].map((w, i) => (
                      <motion.div
                        key={i}
                        className="h-[2px] rounded-full bg-primary/15"
                        initial={{ width: 0 }}
                        animate={{ width: `${w}%` }}
                        transition={{
                          delay: 1.2 + i * 0.15,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-4 h-4 text-foreground/15 animate-scroll-bounce" />
        </div>
      </section>

      {/* ============================================================ */}
      {/* ASYMMETRIC MOCKUP with editorial label                       */}
      {/* ============================================================ */}
      <section className="py-20 px-8">
        <div className="max-w-[1400px] mx-auto">
          <ScrollReveal>
            <div className="relative">
              {/* Vertical editorial label */}
              <div
                className="absolute -left-14 top-1/2 -translate-y-1/2 hidden xl:block"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                }}
              >
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/15">
                  Visualization 01.A
                </span>
              </div>

              <BrowserMockup
                url="app.lumiere.edu/student/dashboard"
                className="shadow-2xl"
              >
                <div className="p-6 md:p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    {/* Left col — heading + description */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/25 mb-3">
                        01
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl font-light text-navy dark:text-foreground mb-4 leading-tight">
                        Centralized Command
                      </h3>
                      <p className="text-sm text-foreground/40 leading-relaxed">
                        Every data point a student needs — courses, grades,
                        degree progress, documents, and schedule — surfaced in a
                        single disciplined interface. No more switching between
                        four portals.
                      </p>
                    </div>

                    {/* Right col — stat cards */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        {
                          label: "Degree Status",
                          value: 73.2,
                          suffix: "%",
                          dec: 1,
                        },
                        {
                          label: "GPA",
                          value: 3.91,
                          suffix: "",
                          dec: 2,
                        },
                        {
                          label: "Credits",
                          value: 104,
                          suffix: "",
                          dec: 0,
                        },
                      ].map(({ label, value, suffix, dec }) => (
                        <div
                          key={label}
                          className="rounded-xl border border-border/40 bg-background/50 p-4 text-center"
                        >
                          <p className="text-[8px] font-mono uppercase tracking-wider text-foreground/25 mb-2">
                            {label}
                          </p>
                          <p className="font-mono text-2xl font-semibold text-foreground">
                            <NumberTicker
                              value={value}
                              decimalPlaces={dec}
                              delay={0.5}
                              className="font-mono text-2xl font-semibold text-foreground"
                            />
                            {suffix && (
                              <span className="text-foreground/30 text-lg">
                                {suffix}
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </BrowserMockup>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PULL QUOTE                                                   */}
      {/* ============================================================ */}
      <section className="py-20 px-8">
        <ScrollReveal direction="scale">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="w-10 h-10 text-primary/20 mx-auto mb-6" />
            <p className="font-serif text-2xl md:text-3xl italic text-foreground/60 leading-relaxed">
              &ldquo;The future of academic operations isn&rsquo;t just about
              collecting data — it&rsquo;s about restoring clarity to the
              mission of education.&rdquo;
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ============================================================ */}
      {/* FULL-BLEED DARK SECTION  —  Core Architecture                */}
      {/* ============================================================ */}
      <section
        ref={darkSectionRef}
        id="platform"
        className="relative py-28 px-8"
        style={{ backgroundColor: "#0E1117" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <ScrollReveal>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-4">
              System Infrastructure
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-tight mb-16 max-w-lg">
              Core Architecture
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Numbered principles */}
            <div className="space-y-10">
              {ARCHITECTURE.map((item, i) => (
                <motion.div
                  key={item.num}
                  style={{ opacity: [archOpacity1, archOpacity2][i] }}
                >
                  <div className="flex items-start gap-6">
                    <span className="font-mono text-5xl font-bold text-white/[0.06] leading-none flex-shrink-0">
                      {item.num}
                    </span>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/40 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Large dark card */}
            <ScrollReveal direction="right" delay={0.2}>
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-10 flex flex-col justify-between min-h-[320px]">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-3 h-3">
                      <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
                      <div className="relative w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">
                      System Operational
                    </span>
                  </div>

                  <p className="font-display text-5xl md:text-6xl font-light text-white mb-3">
                    <NumberTicker
                      value={27}
                      delay={0.8}
                      className="font-display text-5xl md:text-6xl font-light text-white"
                    />
                  </p>
                  <p className="text-sm text-white/40">
                    Integrated Operational Pages
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-8">
                  {["Student", "Faculty", "Admin"].map((label) => (
                    <span
                      key={label}
                      className="text-[10px] font-mono uppercase tracking-wider text-white/20 border border-white/[0.06] rounded-full px-3 py-1"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* WORKSPACES  —  3 tall cards with stagger                     */}
      {/* ============================================================ */}
      <section id="workspaces" className="py-28 px-8">
        <div className="max-w-[1400px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-4">
                Role-Based Portals
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-navy dark:text-foreground">
                Three Disciplined Workspaces
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WORKSPACES.map((ws, i) => {
              const Icon = ws.icon;
              return (
                <ScrollReveal
                  key={ws.id}
                  direction="up"
                  delay={0.1 + i * 0.15}
                >
                  <div
                    className={`group relative rounded-2xl border border-border/40 bg-card overflow-hidden aspect-[3/4] flex flex-col justify-end p-8 cursor-pointer hover:border-border/60 transition-all duration-500 ${
                      i === 1 ? "md:translate-y-20" : ""
                    }`}
                  >
                    {/* Large watermark icon */}
                    <Icon className="absolute top-8 right-8 w-24 h-24 text-foreground/[0.03]" />

                    {/* Portal code label */}
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/20 mb-3">
                      {ws.code}
                    </p>

                    <h3 className="font-display text-2xl font-light text-navy dark:text-foreground mb-2">
                      {ws.title}
                    </h3>

                    <p className="text-sm text-foreground/40 leading-relaxed mb-4">
                      {ws.desc}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-foreground/30 mb-6">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{ws.pages} operational pages</span>
                    </div>

                    {/* Expanding line on hover */}
                    <div className="h-[1px] w-10 group-hover:w-full bg-primary/40 transition-all duration-500" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* INTERACTIVE PORTAL PREVIEW                                   */}
      {/* ============================================================ */}
      <section className="bg-background-alt py-28 px-8" id="preview">
        <div className="max-w-[1400px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-4">
                Live Preview
              </p>
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

      {/* ============================================================ */}
      {/* PRINCIPLES  —  Two-column grid                               */}
      {/* ============================================================ */}
      <section className="py-28 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal direction="left">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-4">
                Design Philosophy
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-navy dark:text-foreground leading-tight mb-6">
                System Design Philosophy
              </h2>
              <p className="text-foreground/40 leading-relaxed max-w-lg">
                The rebuild is not about adding more dashboard chrome. It is
                about composition, hierarchy, and trust — making each workspace
                feel like it was built specifically for the person using it.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.15}>
              <div className="space-y-10 pt-2">
                {[
                  {
                    num: "01",
                    title: "Institutional Feel",
                    desc: "Premium typography, restrained color, and deliberate whitespace. Not a SaaS dashboard — an academic operating system that earns trust on first contact.",
                  },
                  {
                    num: "02",
                    title: "Operational Depth",
                    desc: "Twenty-seven production-ready pages covering enrollment, grading, approvals, finance, and degree management. Every workflow considered, every edge case handled.",
                  },
                ].map(({ num, title, desc }) => (
                  <div key={num} className="flex gap-6">
                    <span className="font-mono text-5xl font-bold text-foreground/[0.06] leading-none flex-shrink-0">
                      {num}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl font-semibold mb-2">
                        {title}
                      </h3>
                      <p className="text-sm text-foreground/40 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA  —  Full-width crimson card                              */}
      {/* ============================================================ */}
      <section className="px-8 pb-24">
        <div className="max-w-[1400px] mx-auto">
          <ScrollReveal direction="scale">
            <div
              className="relative rounded-3xl overflow-hidden px-8 py-20 md:py-28 text-center bg-primary"
            >
              <div className="relative z-10">
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-light leading-tight max-w-2xl mx-auto">
                  Ready to unify your campus?
                </h2>
                <p className="text-white/50 mb-12 max-w-md mx-auto text-lg">
                  Sign in to explore all three workspaces with pre-loaded
                  institutional data.
                </p>
                <Link href="/auth/signin">
                  <button className="bg-white text-primary hover:bg-white/90 transition-colors rounded-full h-14 px-10 text-[15px] font-medium inline-flex items-center gap-2 cursor-pointer">
                    Enter the portal
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="border-t border-border/40 py-8 px-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-navy text-white flex items-center justify-center">
              <Shield className="w-3 h-3" />
            </div>
            <span className="font-display text-xs tracking-wide text-navy dark:text-foreground">
              Lumiere Higher-Ed Pathways
            </span>
          </div>

          <div className="flex items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-foreground/25">
            <Link
              href="#platform"
              className="hover:text-foreground/50 transition-colors"
            >
              Platform
            </Link>
            <Link
              href="#workspaces"
              className="hover:text-foreground/50 transition-colors"
            >
              Workspaces
            </Link>
            <Link
              href="#preview"
              className="hover:text-foreground/50 transition-colors"
            >
              Preview
            </Link>
            <Link
              href="/compliance"
              className="hover:text-foreground/50 transition-colors"
            >
              Compliance
            </Link>
          </div>

          <p className="text-[10px] font-mono text-foreground/20 uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Lumiere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
