"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { useRole } from "@/lib/role-context";

export default function SettingsPage() {
  const { user } = useRole();
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-8 max-w-2xl">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl font-light text-navy dark:text-foreground tracking-tight">Settings</h1>
        <p className="text-foreground/40 text-sm mt-1">Profile and notification preferences</p>
      </BlurFade>

      {/* Profile */}
      <BlurFade delay={0.1}>
        <Card className="card-hover-glow card-hover-glow">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg font-semibold mb-6">Profile</h3>
            <div className="flex items-center gap-5 mb-6">
              <Avatar className="h-16 w-16 border border-border">
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
                  {(user?.name ?? "").split(" ").map(n => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-foreground/40">{user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-foreground/50">First Name</Label>
                <Input defaultValue={(user?.name ?? "").split(" ")[0]} readOnly className="bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-foreground/50">Last Name</Label>
                <Input defaultValue={(user?.name ?? "").split(" ").slice(1).join(" ")} readOnly className="bg-muted/30" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-xs text-foreground/50">Email</Label>
                <Input defaultValue={user?.email} readOnly className="bg-muted/30" />
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Notifications */}
      <BlurFade delay={0.2}>
        <Card className="card-hover-glow card-hover-glow">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg font-semibold mb-6">Notifications</h3>
            <div className="space-y-5">
              {[
                { label: "Assignment reminders", desc: "Get notified when assignments are due soon", default: true },
                { label: "Grade updates", desc: "Receive alerts when grades are posted", default: true },
                { label: "Messages", desc: "Notifications for new messages from faculty", default: true },
                { label: "Announcements", desc: "Course and institutional announcements", default: false },
              ].map(({ label, desc, default: def }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-foreground/35">{desc}</p>
                  </div>
                  <Switch defaultChecked={def} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Actions */}
      <BlurFade delay={0.3}>
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>{saved ? "Saved!" : "Save changes"}</Button>
        </div>
      </BlurFade>
    </div>
  );
}
