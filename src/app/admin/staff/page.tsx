"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  status: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("users")
        .select("id, full_name, email, status")
        .eq("role", "staff")
        .order("full_name");
      if (data) setStaff(data as StaffMember[]);
      setLoading(false);
    }
    load();
  }, []);

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2);
  }

  const statusColor: Record<string, string> = {
    active: "bg-success/10 text-success border-0",
    inactive: "bg-foreground/10 text-foreground/50 border-0",
    on_leave: "bg-warning/10 text-warning border-0",
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-[300px] bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          Staff Directory
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          Faculty and staff members
        </p>
      </BlurFade>

      {/* Summary */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
              Total Staff
            </p>
            <NumberTicker
              value={staff.length}
              delay={0.2}
              className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
            />
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-widest text-foreground/35 mb-3">
              Active
            </p>
            <NumberTicker
              value={staff.filter((s) => s.status === "active").length}
              delay={0.3}
              className="text-[1.7rem] font-mono font-semibold text-foreground leading-none"
            />
          </div>
        </div>
      </BlurFade>

      {/* Table */}
      <BlurFade delay={0.15}>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Name
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Email
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-border">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                          {getInitials(s.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{s.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground/50">
                    {s.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] ${statusColor[s.status] || statusColor.active}`}
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {staff.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-sm text-foreground/30 py-12"
                  >
                    No staff members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </BlurFade>
    </div>
  );
}
