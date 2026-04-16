"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  FileBarChart,
  GraduationCap,
  DollarSign,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

const REPORTS = [
  {
    title: "Enrollment Summary",
    description:
      "Comprehensive overview of enrollment trends, demographics, and program distribution across all active cohorts.",
    frequency: "Updated monthly",
    lastGenerated: "Apr 12, 2026",
    icon: Users,
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    title: "Academic Performance",
    description:
      "GPA distributions, course pass rates, academic probation tracking, and dean's list statistics.",
    frequency: "Updated monthly",
    lastGenerated: "Apr 10, 2026",
    icon: GraduationCap,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    title: "Financial Summary",
    description:
      "Revenue analysis, tuition collection rates, outstanding balances, and financial aid utilization.",
    frequency: "Updated monthly",
    lastGenerated: "Apr 8, 2026",
    icon: DollarSign,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    title: "Retention Analytics",
    description:
      "Student retention and attrition rates by program, year, and demographic cohort with trend analysis.",
    frequency: "Updated weekly",
    lastGenerated: "Apr 14, 2026",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Admissions Pipeline",
    description:
      "Application funnel metrics, conversion rates, yield analysis, and recruitment campaign performance.",
    frequency: "Updated daily",
    lastGenerated: "Apr 16, 2026",
    icon: FileBarChart,
    color: "text-purple-600",
    bg: "bg-purple-600/10",
  },
  {
    title: "Faculty Performance",
    description:
      "Teaching evaluations, course outcomes, research output, and faculty satisfaction metrics.",
    frequency: "Updated monthly",
    lastGenerated: "Apr 5, 2026",
    icon: Award,
    color: "text-pink-600",
    bg: "bg-pink-600/10",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          Reports
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {REPORTS.length} reports available
        </p>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORTS.map((report, i) => {
          const Icon = report.icon;
          return (
            <BlurFade key={report.title} delay={0.1 + i * 0.06} inView>
              <Card className="card-hover-glow h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div
                    className={`w-10 h-10 rounded-lg ${report.bg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-5 h-5 ${report.color}`} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">
                    {report.title}
                  </h3>
                  <p className="text-sm text-foreground/45 leading-relaxed flex-1 mb-4">
                    {report.description}
                  </p>
                  <div className="gradient-divider mb-4" />
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-medium bg-muted/50"
                    >
                      {report.frequency}
                    </Badge>
                    <span className="font-mono text-xs text-foreground/30">
                      {report.lastGenerated}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-8 text-xs"
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </BlurFade>
          );
        })}
      </div>
    </div>
  );
}
