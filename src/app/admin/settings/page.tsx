"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";

const SYSTEM_TOGGLES_GROUP_1 = [
  {
    label: "Maintenance Mode",
    desc: "Temporarily disable access for students and staff",
    defaultChecked: false,
  },
  {
    label: "Email Notifications",
    desc: "Send system emails for approvals and alerts",
    defaultChecked: true,
  },
  {
    label: "Auto-Enrollment",
    desc: "Automatically enroll students upon admission approval",
    defaultChecked: true,
  },
];

const SYSTEM_TOGGLES_GROUP_2 = [
  {
    label: "Grade Auto-Publish",
    desc: "Publish grades to students when faculty submit them",
    defaultChecked: false,
  },
  {
    label: "Two-Factor Auth",
    desc: "Require 2FA for all administrative accounts",
    defaultChecked: true,
  },
  {
    label: "Audit Logging",
    desc: "Log all administrative actions for compliance",
    defaultChecked: true,
  },
];

const NOTIFICATION_TOGGLES = [
  {
    label: "Approval Alerts",
    desc: "Get notified when new approvals are submitted",
    defaultChecked: true,
  },
  {
    label: "Enrollment Alerts",
    desc: "Receive notifications for new enrollment activity",
    defaultChecked: true,
  },
  {
    label: "Weekly Digest",
    desc: "Summary of enrollment, finance, and performance metrics",
    defaultChecked: true,
  },
];

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-8 max-w-2xl">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl text-navy dark:text-foreground tracking-tight">
          System Settings
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          Profile and system configuration
        </p>
      </BlurFade>

      {/* Profile */}
      <BlurFade delay={0.1}>
        <Card className="card-hover-glow">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg font-semibold mb-6">Profile</h3>
            <div className="flex items-center gap-5 mb-6">
              <Avatar className="h-16 w-16 border border-border">
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
                  VH
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Victoria Harrington</p>
                <p className="text-sm text-foreground/40">
                  v.harrington@lumiere.edu
                </p>
                <p className="text-xs text-primary font-medium mt-0.5">
                  Administrator
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-foreground/50">First Name</Label>
                <Input
                  defaultValue="Victoria"
                  readOnly
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-foreground/50">Last Name</Label>
                <Input
                  defaultValue="Harrington"
                  readOnly
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-xs text-foreground/50">Email</Label>
                <Input
                  defaultValue="v.harrington@lumiere.edu"
                  readOnly
                  className="bg-muted/30"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      <div className="gradient-divider" />

      {/* System Configuration */}
      <BlurFade delay={0.2}>
        <Card className="card-hover-glow">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg font-semibold mb-6">
              System Configuration
            </h3>
            <div className="space-y-5">
              {SYSTEM_TOGGLES_GROUP_1.map(({ label, desc, defaultChecked }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-foreground/35">{desc}</p>
                  </div>
                  <Switch defaultChecked={defaultChecked} />
                </div>
              ))}
            </div>

            <div className="gradient-divider my-5" />

            <div className="space-y-5">
              {SYSTEM_TOGGLES_GROUP_2.map(({ label, desc, defaultChecked }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-foreground/35">{desc}</p>
                  </div>
                  <Switch defaultChecked={defaultChecked} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      <div className="gradient-divider" />

      {/* Notifications */}
      <BlurFade delay={0.3}>
        <Card className="card-hover-glow">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg font-semibold mb-6">
              Notifications
            </h3>
            <div className="space-y-5">
              {NOTIFICATION_TOGGLES.map(({ label, desc, defaultChecked }) => (
                <div key={label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-foreground/35">{desc}</p>
                  </div>
                  <Switch defaultChecked={defaultChecked} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Save */}
      <BlurFade delay={0.4}>
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </BlurFade>
    </div>
  );
}
