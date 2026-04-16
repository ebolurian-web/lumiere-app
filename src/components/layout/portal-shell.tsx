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
