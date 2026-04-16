"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";
import { FileText, Download, Upload, Clock } from "lucide-react";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

const TYPE_CONFIG: Record<string, { label: string; group: string; bg: string; text: string }> = {
  transcript:    { label: "Transcript",    group: "Transcripts",                    bg: "bg-info/10",    text: "text-info" },
  financial_aid: { label: "Financial Aid", group: "Financial Aid",                  bg: "bg-success/10", text: "text-success" },
  certificate:   { label: "Certificate",   group: "Certificates & Verifications",   bg: "bg-primary/10", text: "text-primary" },
  verification:  { label: "Verification",  group: "Certificates & Verifications",   bg: "bg-warning/10", text: "text-warning" },
};

const GROUP_ORDER = ["Transcripts", "Financial Aid", "Certificates & Verifications"];

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", MAYA_ID)
        .order("created_at", { ascending: false });
      if (data) setDocuments(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
            <div className="h-4 bg-muted rounded w-24 mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-28 bg-muted rounded-lg animate-pulse" />
        </div>
        {[1, 2, 3].map((g) => (
          <div key={g} className="space-y-3">
            <div className="h-5 bg-muted rounded w-40 animate-pulse" />
            {[1, 2].map((i) => (
              <div key={i} className="h-[76px] bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  /* Group documents by type category */
  const grouped = GROUP_ORDER.reduce<Record<string, Document[]>>((acc, group) => {
    acc[group] = documents.filter(
      (d) => (TYPE_CONFIG[d.type]?.group ?? "Certificates & Verifications") === group
    );
    return acc;
  }, {});

  let staggerIdx = 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <BlurFade delay={0}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-light text-navy dark:text-foreground tracking-tight">
              Documents
            </h1>
            <p className="text-foreground/40 text-sm mt-1">
              {documents.length} documents
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-dashed border-2"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
          </Button>
        </div>
      </BlurFade>

      {/* Grouped sections */}
      {GROUP_ORDER.map((group, gi) => {
        const docs = grouped[group];
        if (!docs || docs.length === 0) return null;

        return (
          <BlurFade key={group} delay={0.1 + gi * 0.08}>
            <div className="space-y-3">
              {/* Section header */}
              <h2 className="font-display text-sm font-medium uppercase tracking-widest text-foreground/30">
                {group}
              </h2>

              {/* Document cards */}
              {docs.map((doc) => {
                const cfg = TYPE_CONFIG[doc.type] ?? {
                  label: doc.type,
                  group: "Other",
                  bg: "bg-muted/50",
                  text: "text-foreground/40",
                };
                const idx = staggerIdx++;

                return (
                  <BlurFade key={doc.id} delay={0.15 + idx * 0.05} inView>
                    <div className="flex items-center gap-4 p-5 rounded-xl border border-border/60 bg-card card-hover-glow group cursor-pointer">
                      {/* File type icon */}
                      <div
                        className={`w-12 h-12 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <FileText className={`w-6 h-6 ${cfg.text}`} />
                      </div>

                      {/* Middle: name + meta */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-foreground/30 mt-0.5">
                          <span className="font-mono text-xs">{cfg.label}</span>
                          <span className="mx-1.5 text-foreground/15">&middot;</span>
                          <span className="font-mono text-xs">
                            {new Date(doc.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </p>
                      </div>

                      {/* Right: status + download */}
                      <div className="flex items-center gap-3">
                        {doc.status === "processing" ? (
                          <Badge className="text-[10px] bg-warning/10 text-warning border-0 gap-1">
                            <Clock className="w-3 h-3" />
                            Processing
                          </Badge>
                        ) : (
                          <Badge className="text-[10px] bg-success/10 text-success border-0">
                            Ready
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="w-4 h-4 text-foreground/40" />
                        </Button>
                      </div>
                    </div>
                  </BlurFade>
                );
              })}
            </div>
          </BlurFade>
        );
      })}
    </div>
  );
}
