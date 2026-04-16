"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle } from "lucide-react";

interface Approval {
  id: string;
  type: string;
  detail: string;
  status: string;
  priority: string;
  submitted_at: string;
  student: { full_name: string } | null;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("approvals")
        .select("*, student:student_id(full_name)")
        .order("submitted_at", { ascending: false });
      if (data) setApprovals(data as Approval[]);
      setLoading(false);
    }
    load();
  }, []);

  async function handleAction(id: string, newStatus: "approved" | "denied") {
    await supabase.from("approvals").update({ status: newStatus }).eq("id", id);
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  }

  const priorityColor: Record<string, string> = {
    urgent: "bg-danger/10 text-danger border-0",
    high: "bg-danger/10 text-danger border-0",
    normal: "bg-warning/10 text-warning border-0",
    low: "bg-info/10 text-info border-0",
  };

  const statusColor: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-0",
    approved: "bg-success/10 text-success border-0",
    denied: "bg-danger/10 text-danger border-0",
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-56 animate-pulse" />
        <div className="h-[400px] bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          Approval Queue
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {approvals.filter((a) => a.status === "pending").length} pending
          requests
        </p>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Type
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Student
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Detail
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Submitted
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Priority
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium">
                  Status
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-widest text-foreground/35 font-medium text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((a) => (
                <TableRow key={a.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium text-sm">{a.type}</TableCell>
                  <TableCell className="text-sm">
                    {a.student?.full_name || "Unknown"}
                  </TableCell>
                  <TableCell className="text-sm text-foreground/50 max-w-[200px] truncate">
                    {a.detail}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground/40">
                    {new Date(a.submitted_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] ${priorityColor[a.priority] || priorityColor.normal}`}
                    >
                      {a.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] ${statusColor[a.status] || statusColor.pending}`}
                    >
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {a.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-success hover:text-success hover:bg-success/10"
                          onClick={() => handleAction(a.id, "approved")}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-danger hover:text-danger hover:bg-danger/10"
                          onClick={() => handleAction(a.id, "denied")}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Deny
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-foreground/25 font-mono">
                        --
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </BlurFade>
    </div>
  );
}
