# Layouts

## src/app/layout.tsx
```tsx
import type { Metadata } from "next";
import {
  Source_Sans_3,
  Crimson_Pro,
  IBM_Plex_Mono,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/lib/role-context";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumiere | Higher-Ed Pathways",
  description:
    "Lumiere — a private academic operating system. Student, staff, and admin workspaces for degree progression, advising, course management, and institutional reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSans.variable} ${crimsonPro.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <RoleProvider>{children}</RoleProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## src/app/student/layout.tsx
```tsx
"use client";

import { PortalShell } from "@/components/layout/portal-shell";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell requiredRole="student">{children}</PortalShell>;
}
```

## src/components/layout/portal-shell.tsx
```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole, UserRole } from "@/lib/role-context";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

interface PortalShellProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

export function PortalShell({ children, requiredRole }: PortalShellProps) {
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (role === null) {
      // Check localStorage directly to avoid flash on mount
      const stored = localStorage.getItem("lumiere-role");
      if (!stored || stored !== requiredRole) {
        router.push("/auth/signin");
      }
    } else if (role !== requiredRole) {
      router.push(`/${role}/dashboard`);
    }
  }, [role, requiredRole, router]);

  if (!role || role !== requiredRole) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

## src/components/layout/app-sidebar.tsx
```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole, UserRole } from "@/lib/role-context";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Shield,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  BarChart3,
  Calendar,
  Mail,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  Users,
  CheckSquare,
  DollarSign,
  FileBarChart,
  GraduationCap,
  FolderOpen,
} from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  student: [
    { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
    { title: "Courses", url: "/student/courses", icon: BookOpen },
    { title: "Assignments", url: "/student/assignments", icon: ClipboardList },
    { title: "Grades", url: "/student/grades", icon: BarChart3 },
    { title: "Schedule", url: "/student/schedule", icon: Calendar },
    { title: "Messages", url: "/student/messages", icon: Mail, badge: "3" },
    { title: "Documents", url: "/student/documents", icon: FileText },
    { title: "Degree Progress", url: "/student/progress", icon: TrendingUp },
  ],
  staff: [
    { title: "Dashboard", url: "/staff/dashboard", icon: LayoutDashboard },
    { title: "Courses", url: "/staff/courses", icon: BookOpen },
    { title: "Roster", url: "/staff/roster", icon: Users },
    { title: "Gradebook", url: "/staff/gradebook", icon: BarChart3 },
    { title: "Schedule", url: "/staff/schedule", icon: Calendar },
    { title: "Messages", url: "/staff/messages", icon: Mail },
    { title: "Analytics", url: "/staff/analytics", icon: TrendingUp },
  ],
  admin: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Approvals", url: "/admin/approvals", icon: CheckSquare, badge: "4" },
    { title: "Students", url: "/admin/students", icon: GraduationCap },
    { title: "Programs", url: "/admin/programs", icon: FolderOpen },
    { title: "Finance", url: "/admin/finance", icon: DollarSign },
    { title: "Reports", url: "/admin/reports", icon: FileBarChart },
    { title: "Staff", url: "/admin/staff", icon: Users },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student Portal",
  staff: "Staff Portal",
  admin: "Admin Portal",
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, signOut } = useRole();

  if (!role || !user) return null;

  const navItems = NAV_ITEMS[role];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Sidebar className="border-r border-sidebar-border/50">
      <SidebarHeader className="p-4 pb-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display text-sm tracking-tight text-navy dark:text-foreground">
              LUMIERE
            </span>
            <span className="block text-[10px] text-foreground/30 font-sans uppercase tracking-[0.15em]">
              {ROLE_LABELS[role]}
            </span>
          </div>
        </Link>
        <div className="gradient-divider mt-3" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-sans text-[10px] uppercase tracking-[0.15em] text-foreground/25 px-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-gold/[0.06] text-foreground font-medium dark:bg-gold/[0.08]"
                          : "text-foreground/60"
                      }
                    >
                      {isActive && <div className="w-1 h-4 rounded-full bg-gold absolute left-0" />}
                      <item.icon className={`w-4 h-4 ${isActive ? "text-gold" : ""}`} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge className="bg-gold/10 text-gold font-mono text-[10px] h-4 min-w-4 rounded-full px-1">
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href={`/${role}/settings`} />}
                  isActive={pathname === `/${role}/settings`}
                  className={
                    pathname === `/${role}/settings`
                      ? "bg-gold/[0.06] text-foreground font-medium dark:bg-gold/[0.08]"
                      : "text-foreground/60"
                  }
                >
                  {pathname === `/${role}/settings` && <div className="w-1 h-4 rounded-full bg-gold absolute left-0" />}
                  <Settings className={`w-4 h-4 ${pathname === `/${role}/settings` ? "text-gold" : ""}`} />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="gradient-divider mb-3" />
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-9 w-9 border border-border flex-shrink-0">
            <AvatarFallback className="bg-gold/10 text-gold font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 pl-12">
          <ThemeToggle />
          <button
            onClick={() => {
              signOut();
              router.push("/auth/signin");
            }}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
```
