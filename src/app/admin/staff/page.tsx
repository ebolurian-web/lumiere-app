"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { BlurFade } from "@/components/ui/blur-fade";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  status: string;
}

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

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filtered = staff.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
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
          {staff.length} faculty members
        </p>
      </BlurFade>

      {/* Search */}
      <BlurFade delay={0.1}>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
          <Input
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/30"
          />
        </div>
      </BlurFade>

      {/* Staff cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s, i) => (
          <BlurFade key={s.id} delay={0.15 + i * 0.04} inView>
            <Card className="card-hover-glow">
              <CardContent className="p-5 flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-border shrink-0">
                  <AvatarFallback className="text-sm bg-primary/10 text-primary font-semibold">
                    {getInitials(s.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{s.full_name}</p>
                  <p className="font-mono text-xs text-foreground/30 truncate">
                    {s.email}
                  </p>
                </div>
                <Badge
                  className={`text-[10px] shrink-0 ${statusColor[s.status] || statusColor.active}`}
                >
                  {s.status === "on_leave"
                    ? "On Leave"
                    : s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                </Badge>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-foreground/30 py-12">
            No staff members found
          </div>
        )}
      </div>
    </div>
  );
}
