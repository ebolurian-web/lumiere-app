"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";
import { Search, Send } from "lucide-react";

const MAYA_ID = "b1000000-0000-0000-0000-000000000001";

interface Message {
  id: string;
  subject: string;
  body: string;
  read: boolean;
  created_at: string;
  from_user: { full_name: string; role: string };
}

interface ChatBubble {
  id: string;
  text: string;
  sent: boolean;
  timestamp: Date;
}

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  staff: { bg: "bg-navy/8", text: "text-navy dark:text-foreground" },
  admin: { bg: "bg-primary/8", text: "text-primary" },
};

const ROLE_LABELS: Record<string, string> = {
  staff: "Faculty",
  admin: "Admin",
};

// Mock replies to pair with received messages
const MOCK_REPLIES: Record<number, string> = {
  0: "Thank you! I'll review the details and get back to you soon.",
  1: "Got it, appreciate the heads up.",
  2: "Sounds good -- I'll make sure to prepare accordingly.",
  3: "Thanks for letting me know. I have a quick follow-up question I'll send later.",
  4: "Understood, thanks!",
};

function buildChatThread(msg: Message, index: number): ChatBubble[] {
  const receivedTime = new Date(msg.created_at);
  const replyTime = new Date(receivedTime.getTime() + 15 * 60 * 1000); // 15min later

  const bubbles: ChatBubble[] = [
    {
      id: `${msg.id}-received`,
      text: msg.body,
      sent: false,
      timestamp: receivedTime,
    },
  ];

  const reply = MOCK_REPLIES[index % Object.keys(MOCK_REPLIES).length];
  if (reply) {
    bubbles.push({
      id: `${msg.id}-sent`,
      text: reply,
      sent: true,
      timestamp: replyTime,
    });
  }

  return bubbles;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffHrs < 1) return "just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [composeText, setComposeText] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("id, subject, body, read, created_at, from_user:from_user_id(full_name, role)")
        .eq("to_user_id", MAYA_ID)
        .order("created_at", { ascending: false });
      if (data) {
        const msgs = data.map((m: any) => ({ ...m, from_user: m.from_user }));
        setMessages(msgs);
        if (msgs.length > 0) {
          setSelected(msgs[0]);
          setSelectedIndex(0);
        }
      }
      setLoading(false);
    }
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      msg.subject.toLowerCase().includes(q) ||
      msg.from_user?.full_name?.toLowerCase().includes(q) ||
      msg.body.toLowerCase().includes(q)
    );
  });

  const chatThread = selected ? buildChatThread(selected, selectedIndex) : [];
  const unreadCount = messages.filter((m) => !m.read).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 bg-muted rounded-lg w-48 animate-pulse" />
        <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        <div className="grid grid-cols-12 gap-5 h-[600px] mt-4">
          <div className="col-span-4 bg-muted rounded-xl animate-pulse" />
          <div className="col-span-8 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          Messages
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {unreadCount} unread
        </p>
      </BlurFade>

      {/* Two-panel layout */}
      <BlurFade delay={0.1}>
        <div className="grid grid-cols-12 gap-0 rounded-xl border border-border/60 overflow-hidden card-hover-glow min-h-[600px]">
          {/* Left panel - conversation list */}
          <div className="col-span-12 md:col-span-4 border-r border-border/40 flex flex-col bg-background">
            {/* Search */}
            <div className="p-3 border-b border-border/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/25" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/40 border border-border/30 text-sm placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </div>
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <p className="text-sm text-foreground/30 text-center py-12">No messages found</p>
              ) : (
                <div className="divide-y divide-border/20">
                  {filteredMessages.map((msg, idx) => {
                    const initials = msg.from_user?.full_name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2);
                    const colors = ROLE_COLORS[msg.from_user?.role] || ROLE_COLORS.staff;
                    const isSelected = selected?.id === msg.id;

                    return (
                      <button
                        key={msg.id}
                        onClick={() => {
                          setSelected(msg);
                          setSelectedIndex(idx);
                          setComposeText("");
                        }}
                        className={`
                          w-full flex items-start gap-3 p-4 text-left transition-colors cursor-pointer
                          ${isSelected ? "bg-primary/[0.04]" : "hover:bg-muted/30"}
                        `}
                      >
                        <Avatar className="h-10 w-10 flex-shrink-0 mt-0.5">
                          <AvatarFallback className={`text-xs ${colors.bg} ${colors.text}`}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm truncate ${!msg.read ? "font-semibold" : "font-medium"}`}>
                              {msg.from_user?.full_name}
                            </p>
                            <span className="font-mono text-[10px] text-foreground/25 flex-shrink-0">
                              {timeAgo(new Date(msg.created_at))}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {!msg.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            )}
                            <p className="text-xs text-foreground/40 truncate">{msg.subject}</p>
                          </div>
                          <p className="text-[11px] text-foreground/25 truncate mt-0.5">
                            {msg.body.slice(0, 60)}{msg.body.length > 60 ? "..." : ""}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right panel - conversation view */}
          <div className="col-span-12 md:col-span-8 flex flex-col bg-background">
            {selected ? (
              <>
                {/* Conversation header */}
                <div className="px-6 py-4 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarFallback
                        className={`text-xs ${
                          (ROLE_COLORS[selected.from_user?.role] || ROLE_COLORS.staff).bg
                        } ${(ROLE_COLORS[selected.from_user?.role] || ROLE_COLORS.staff).text}`}
                      >
                        {selected.from_user?.full_name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{selected.from_user?.full_name}</p>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            (ROLE_COLORS[selected.from_user?.role] || ROLE_COLORS.staff).bg
                          } ${(ROLE_COLORS[selected.from_user?.role] || ROLE_COLORS.staff).text}`}
                        >
                          {ROLE_LABELS[selected.from_user?.role] || "Staff"}
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground/30 font-mono">
                        last active {timeAgo(new Date(selected.created_at))}
                      </p>
                    </div>
                  </div>
                  <div className="gradient-divider mt-4" />
                </div>

                {/* Subject line */}
                <div className="px-6 py-3 border-b border-border/20">
                  <p className="font-serif text-sm font-medium text-foreground/60">
                    {selected.subject}
                  </p>
                </div>

                {/* Chat thread */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                  {chatThread.map((bubble) => (
                    <div
                      key={bubble.id}
                      className={`flex ${bubble.sent ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[75%] px-4 py-3
                          ${bubble.sent
                            ? "bg-primary/10 rounded-2xl rounded-br-sm"
                            : "bg-muted/30 rounded-2xl rounded-bl-sm"
                          }
                        `}
                      >
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          {bubble.text}
                        </p>
                        <p className="font-mono text-[10px] text-foreground/20 mt-1.5 text-right">
                          {formatTime(bubble.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compose bar */}
                <div className="sticky bottom-0 px-4 py-3 border-t border-border/30 bg-background">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={composeText}
                      onChange={(e) => setComposeText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && composeText.trim()) {
                          setComposeText("");
                        }
                      }}
                      className="flex-1 h-12 px-4 rounded-xl bg-muted/30 border border-border/30 text-sm placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                    <button
                      onClick={() => {
                        if (composeText.trim()) setComposeText("");
                      }}
                      className="h-12 w-12 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-foreground/30 text-sm">Select a conversation to view</p>
              </div>
            )}
          </div>
        </div>
      </BlurFade>
    </div>
  );
}
