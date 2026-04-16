"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "staff" | "admin";

interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

const DEMO_USERS: Record<UserRole, DemoUser> = {
  student: {
    id: "b1000000-0000-0000-0000-000000000001",
    name: "Maya Rodriguez",
    email: "maya.rodriguez@lumiere.edu",
    role: "student",
  },
  staff: {
    id: "c1000000-0000-0000-0000-000000000001",
    name: "Dr. Sarah Kim",
    email: "sarah.kim@lumiere.edu",
    role: "staff",
  },
  admin: {
    id: "d1000000-0000-0000-0000-000000000001",
    name: "Victoria Harrington",
    email: "admin@lumiere.edu",
    role: "admin",
  },
};

interface RoleContextType {
  user: DemoUser | null;
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  signOut: () => void;
}

const RoleContext = createContext<RoleContextType>({
  user: null,
  role: null,
  setRole: () => {},
  signOut: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lumiere-role") as UserRole | null;
    if (stored && DEMO_USERS[stored]) {
      setRoleState(stored);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("lumiere-role", newRole);
  };

  const signOut = () => {
    setRoleState(null);
    localStorage.removeItem("lumiere-role");
  };

  const user = role ? DEMO_USERS[role] : null;

  return (
    <RoleContext.Provider value={{ user, role, setRole, signOut }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

export { DEMO_USERS };
