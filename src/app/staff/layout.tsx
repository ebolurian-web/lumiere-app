"use client";

import { PortalShell } from "@/components/layout/portal-shell";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell requiredRole="staff">{children}</PortalShell>;
}
