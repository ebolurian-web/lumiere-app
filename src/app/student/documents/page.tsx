"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";
import { FileText, Download, Upload, Clock } from "lucide-react";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

const TYPE_ICONS: Record<string, string> = {
  transcript: "text-info",
  financial_aid: "text-success",
  certificate: "text-primary",
  verification: "text-warning",
};

interface Document {
  id: string; name: string; type: string; status: string; created_at: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", MAYA_ID)
        .order("created_at", { ascending: false });
      if (data) setDocuments(data);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">Documents</h1>
            <p className="text-foreground/40 text-sm mt-1">{documents.length} documents</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="w-3.5 h-3.5" />
            Upload
          </Button>
        </div>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="space-y-3">
          {documents.map((doc, i) => (
            <BlurFade key={doc.id} delay={0.15 + i * 0.05} inView>
              <div className="flex items-center gap-4 p-5 rounded-xl border border-border/60 bg-card card-hover-glow group cursor-pointer">
                <div className={`w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center ${TYPE_ICONS[doc.type] || "text-foreground/40"}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-foreground/35 mt-0.5">
                    {doc.type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    {" · "}
                    <span className="font-mono">
                      {new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {doc.status === "processing" ? (
                    <Badge className="text-[10px] bg-warning/10 text-warning border-0 gap-1">
                      <Clock className="w-3 h-3" />
                      Processing
                    </Badge>
                  ) : (
                    <Badge className="text-[10px] bg-success/10 text-success border-0">Ready</Badge>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="w-4 h-4 text-foreground/40" />
                  </Button>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </BlurFade>
    </div>
  );
}
