"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";

const KIM_ID = "c1000000-0000-0000-0000-000000000001";

interface Message {
  id: string;
  subject: string;
  body: string;
  read: boolean;
  created_at: string;
  from_user: { full_name: string; role: string };
}

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  student: { bg: "bg-info/8", text: "text-info" },
  staff: { bg: "bg-navy/8", text: "text-navy dark:text-foreground" },
  admin: { bg: "bg-primary/8", text: "text-primary" },
};

const DEMO_MESSAGES: Message[] = [
  {
    id: "m1",
    subject: "Question about HW 4 — Gradient Descent",
    body: "Hi Dr. Kim,\n\nI'm having trouble understanding the convergence criteria for the gradient descent implementation in HW 4. Specifically, should we use a fixed learning rate or implement adaptive scheduling? The lecture notes mention both approaches but I'm not sure which one to use for this assignment.\n\nAlso, is it okay to use NumPy for the matrix operations or should we implement everything from scratch?\n\nThank you,\nMaya Rodriguez",
    read: false,
    created_at: "2026-04-15T09:30:00Z",
    from_user: { full_name: "Maya Rodriguez", role: "student" },
  },
  {
    id: "m2",
    subject: "Office hours — can I come Thursday instead?",
    body: "Dr. Kim,\n\nI have a scheduling conflict with your Wednesday office hours this week. Would it be possible to meet briefly on Thursday after your DS 410 lecture? I need help with the project proposal.\n\nBest,\nJames Chen",
    read: false,
    created_at: "2026-04-14T16:45:00Z",
    from_user: { full_name: "James Chen", role: "student" },
  },
  {
    id: "m3",
    subject: "Request for extension — Project milestone 2",
    body: "Dear Dr. Kim,\n\nI'm writing to request a 48-hour extension on Project Milestone 2. I've been dealing with a family emergency and haven't been able to dedicate enough time to the implementation. I have the design document completed and the data pipeline built, but need more time for the model training section.\n\nI can provide documentation if needed.\n\nSincerely,\nSofia Almeida",
    read: true,
    created_at: "2026-04-13T11:20:00Z",
    from_user: { full_name: "Sofia Almeida", role: "student" },
  },
  {
    id: "m4",
    subject: "Midterm exam re-grade request",
    body: "Hi Professor Kim,\n\nI'd like to request a re-grade for question 3 on the midterm. I believe my approach using regularized logistic regression was valid, even though it differed from the solution key. I applied L2 regularization and showed the derivation steps.\n\nWould you be available to discuss this during office hours?\n\nThanks,\nAmara Okonkwo",
    read: true,
    created_at: "2026-04-12T14:10:00Z",
    from_user: { full_name: "Amara Okonkwo", role: "student" },
  },
  {
    id: "m5",
    subject: "Faculty meeting — curriculum update",
    body: "Sarah,\n\nPlease review the attached curriculum proposal for the updated Data Science minor before Friday's faculty meeting. We need your input on the prerequisite chain for the ML track.\n\nThanks,\nVictoria Harrington",
    read: true,
    created_at: "2026-04-11T08:00:00Z",
    from_user: { full_name: "Victoria Harrington", role: "admin" },
  },
];

export default function StaffMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("messages")
        .select("id, subject, body, read, created_at, from_user:from_user_id(full_name, role)")
        .eq("to_user_id", KIM_ID)
        .order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const msgs = data.map((m: any) => ({ ...m, from_user: m.from_user }));
        setMessages(msgs);
        if (msgs.length > 0) setSelected(msgs[0]);
      } else {
        setMessages(DEMO_MESSAGES);
        setSelected(DEMO_MESSAGES[0]);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="grid grid-cols-3 gap-5 h-[500px]">
          <div className="bg-muted rounded-xl animate-pulse" />
          <div className="col-span-2 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">Messages</h1>
        <p className="text-foreground/40 text-sm mt-1">{messages.filter((m) => !m.read).length} unread</p>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 min-h-[500px]">
          {/* Message list */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <div className="divide-y divide-border/30">
              {messages.map((msg) => {
                const initials = msg.from_user?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
                const colors = ROLE_COLORS[msg.from_user?.role] || ROLE_COLORS.student;
                const isSelected = selected?.id === msg.id;

                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelected(msg)}
                    className={`w-full flex items-start gap-3 p-4 text-left transition-colors cursor-pointer ${
                      isSelected ? "bg-primary/[0.04]" : "hover:bg-muted/30"
                    } ${!msg.read ? "bg-primary/[0.02]" : ""}`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
                      <AvatarFallback className={`text-[10px] ${colors.bg} ${colors.text}`}>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{msg.from_user?.full_name}</p>
                        {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-foreground/50 truncate">{msg.subject}</p>
                      <p className="font-mono text-[10px] text-foreground/25 mt-0.5">
                        {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message detail */}
          <div className="md:col-span-2 rounded-xl border border-border/60 p-6">
            {selected ? (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-semibold mb-1">{selected.subject}</h2>
                    <p className="text-sm text-foreground/40">
                      From <span className="text-foreground/60">{selected.from_user?.full_name}</span>
                      {" · "}
                      <span className="font-mono text-xs">
                        {new Date(selected.created_at).toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
                        })}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="gradient-divider mb-6" />
                <p className="text-foreground/60 leading-relaxed whitespace-pre-line">{selected.body}</p>
              </div>
            ) : (
              <p className="text-foreground/30 text-center py-20">Select a message to read</p>
            )}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
