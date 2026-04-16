"use client";

import { PortalShell } from "@/components/layout/portal-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell requiredRole="admin">{children}</PortalShell>;
}
