"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface Approval {
  id: string;
  type: string;
  detail: string;
  status: string;
  priority: string;
  submitted_at: string;
  student: { full_name: string } | null;
}

type StatusFilter = "all" | "pending" | "approved" | "denied";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("pending");

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

  const filtered =
    filter === "all"
      ? approvals
      : approvals.filter((a) => a.status === filter);

  const pendingCount = approvals.filter((a) => a.status === "pending").length;

  const priorityDot: Record<string, string> = {
    urgent: "bg-danger",
    high: "bg-danger",
    normal: "bg-warning",
    low: "bg-foreground/20",
  };

  const priorityBadge: Record<string, string> = {
    urgent: "bg-danger/10 text-danger border-0",
    high: "bg-danger/10 text-danger border-0",
  };

  const statusBadge: Record<string, string> = {
    approved: "bg-success/10 text-success border-0",
    denied: "bg-danger/10 text-danger border-0",
  };

  const filters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Denied", value: "denied" },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-56 animate-pulse" />
        <div className="h-5 bg-muted rounded w-32 animate-pulse" />
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="space-y-3 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl font-light tracking-tight">
          Approvals
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {pendingCount} pending &middot; {approvals.length} total
        </p>
      </BlurFade>

      <BlurFade delay={0.05}>
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              size="sm"
              variant={filter === f.value ? "default" : "ghost"}
              className={
                filter === f.value
                  ? "h-8 text-xs"
                  : "h-8 text-xs text-foreground/50 hover:text-foreground"
              }
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {f.value === "pending" && (
                <span className="ml-1.5 rounded-full bg-warning/20 text-warning px-1.5 py-0.5 text-[10px] font-mono">
                  {pendingCount}
                </span>
              )}
            </Button>
          ))}
        </div>
      </BlurFade>

      <div className="space-y-3">
        {filtered.map((a, i) => (
          <BlurFade key={a.id} delay={0.1 + i * 0.03} inView>
            <Card className="card-hover-glow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Priority dot */}
                  <div className="pt-1.5">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${priorityDot[a.priority] || priorityDot.normal}`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif font-semibold text-sm">
                        {a.type}
                      </h3>
                      <span className="text-foreground/40 text-sm">
                        &mdash; {a.student?.full_name || "Unknown"}
                      </span>
                      {(a.priority === "urgent" || a.priority === "high") && (
                        <Badge
                          className={`text-[10px] ${priorityBadge[a.priority]}`}
                        >
                          <AlertTriangle className="w-3 h-3 mr-0.5" />
                          {a.priority}
                        </Badge>
                      )}
                    </div>
                    <p className="text-foreground/45 text-sm truncate max-w-lg">
                      {a.detail}
                    </p>
                    <p className="font-mono text-xs text-foreground/30 mt-1.5">
                      {new Date(a.submitted_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Actions or status */}
                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    {a.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs text-success border-success/30 hover:bg-success/10 hover:text-success"
                          onClick={() => handleAction(a.id, "approved")}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs text-danger border-danger/30 hover:bg-danger/10 hover:text-danger"
                          onClick={() => handleAction(a.id, "denied")}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Deny
                        </Button>
                      </>
                    ) : (
                      <Badge
                        className={`text-[10px] ${statusBadge[a.status] || "bg-muted text-foreground/50 border-0"}`}
                      >
                        {a.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        ))}

        {filtered.length === 0 && (
          <BlurFade delay={0.1}>
            <div className="text-center py-16 text-foreground/30 text-sm">
              No {filter === "all" ? "" : filter} approvals found
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  );
}
