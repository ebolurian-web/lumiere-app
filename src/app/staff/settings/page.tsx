"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BlurFade } from "@/components/ui/blur-fade";
import { useRole } from "@/lib/role-context";

export default function StaffSettingsPage() {
  const { user } = useRole();

  return (
    <div className="space-y-8 max-w-2xl">
      <BlurFade delay={0}>
        <h1 className="font-display text-3xl font-light text-navy dark:text-foreground tracking-tight">Settings</h1>
        <p className="text-foreground/40 text-sm mt-1">Profile and teaching preferences</p>
      </BlurFade>

      {/* Profile */}
      <BlurFade delay={0.1}>
        <Card className="card-hover-glow card-hover-glow">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg font-semibold mb-6">Profile</h3>
            <div className="flex items-center gap-5 mb-6">
              <Avatar className="h-16 w-16 border border-border">
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
                  {user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-foreground/40">{user?.email}</p>
                <p className="text-xs text-foreground/30 mt-0.5">Faculty · Department of Data Science</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-foreground/50">First Name</Label>
                <Input defaultValue="Sarah" readOnly className="bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-foreground/50">Last Name</Label>
                <Input defaultValue="Kim" readOnly className="bg-muted/30" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-xs text-foreground/50">Email</Label>
                <Input defaultValue={user?.email} readOnly className="bg-muted/30" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-xs text-foreground/50">Title</Label>
                <Input defaultValue="Assistant Professor of Data Science" readOnly className="bg-muted/30" />
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Office Hours */}
      <BlurFade delay={0.15}>
        <Card className="card-hover-glow card-hover-glow">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg font-semibold mb-6">Office Hours</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-foreground/50">Day</Label>
                <Input defaultValue="Wednesday" className="bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-foreground/50">Time</Label>
                <Input defaultValue="2:00 PM – 4:00 PM" className="bg-muted/30" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="text-xs text-foreground/50">Location</Label>
                <Input defaultValue="Turing Hall 206" className="bg-muted/30" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/30">
              <div>
                <p className="text-sm font-medium">Allow student booking</p>
                <p className="text-xs text-foreground/35">Students can reserve 15-min slots during office hours</p>
              </div>
              <Switch defaultChecked />
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
                { label: "New submissions", desc: "Get notified when students submit assignments", default: true },
                { label: "Student messages", desc: "Receive alerts for incoming student messages", default: true },
                { label: "Grade disputes", desc: "Notifications for re-grade requests", default: true },
                { label: "Course announcements", desc: "Institutional and departmental announcements", default: false },
                { label: "At-risk alerts", desc: "Alerts when a student falls below performance threshold", default: true },
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

      {/* Grading Preferences */}
      <BlurFade delay={0.25}>
        <Card className="card-hover-glow card-hover-glow">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg font-semibold mb-6">Grading Preferences</h3>
            <div className="space-y-5">
              {[
                { label: "Late submission penalty", desc: "Automatically deduct 10% per day for late work", default: true },
                { label: "Anonymous grading", desc: "Hide student names while grading submissions", default: false },
                { label: "Auto-publish grades", desc: "Publish grades immediately after entering them", default: false },
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
          <Button className="bg-primary hover:bg-primary/90 text-white">Save changes</Button>
        </div>
      </BlurFade>
    </div>
  );
}
