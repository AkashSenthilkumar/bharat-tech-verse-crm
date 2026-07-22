"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";

export type UserRole =
  | "md"
  | "plant-manager"
  | "production-supervisor"
  | "machine-operator"
  | "quality-inspector"
  | "finance-manager"
  | "procurement-manager"
  | "sales-executive";

export interface RoleDefinition {
  id: UserRole;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  navAccess: string[] | "*";
}

export const ROLE_DEFS: RoleDefinition[] = [
  {
    id: "md",
    label: "MD / CEO",
    emoji: "👔",
    color: "#c8a020",
    bgColor: "rgba(200,160,32,0.12)",
    description: "Full platform — P&L, production, CRM overview",
    navAccess: "*",
  },
  {
    id: "plant-manager",
    label: "Plant Manager",
    emoji: "🏭",
    color: "#2490ef",
    bgColor: "rgba(36,144,239,0.12)",
    description: "All manufacturing modules + finance read",
    navAccess: [
      "/dashboard",
      "/production",
      "/inventory",
      "/procurement",
      "/quality",
      "/workforce",
      "/orders",
      "/finance",
      "/energy",
      "/vision",
    ],
  },
  {
    id: "production-supervisor",
    label: "Production Supervisor",
    emoji: "⚙️",
    color: "#8b5cf6",
    bgColor: "rgba(139,92,246,0.12)",
    description: "Shop floor — machines, work orders, quality, vision",
    navAccess: [
      "/dashboard",
      "/production",
      "/quality",
      "/inventory",
      "/orders",
      "/energy",
      "/vision",
    ],
  },
  {
    id: "machine-operator",
    label: "Machine Operator",
    emoji: "🔧",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.10)",
    description: "My machine only — targets, job cards, alerts",
    navAccess: ["/dashboard", "/production"],
  },
  {
    id: "quality-inspector",
    label: "Quality Inspector",
    emoji: "🔬",
    color: "#0d9e9a",
    bgColor: "rgba(13,158,154,0.10)",
    description: "Quality inspections, defect log, FPY trends",
    navAccess: ["/dashboard", "/quality", "/production"],
  },
  {
    id: "finance-manager",
    label: "Finance Manager",
    emoji: "💰",
    color: "#c8a020",
    bgColor: "rgba(200,160,32,0.10)",
    description: "P&L, cost analysis, orders, energy costs",
    navAccess: [
      "/dashboard",
      "/finance",
      "/orders",
      "/inventory",
      "/procurement",
      "/energy",
    ],
  },
  {
    id: "procurement-manager",
    label: "Procurement Manager",
    emoji: "🚛",
    color: "#f97316",
    bgColor: "rgba(249,115,22,0.10)",
    description: "Purchase orders, vendors, inventory levels",
    navAccess: [
      "/dashboard",
      "/procurement",
      "/inventory",
      "/orders",
      "/finance",
    ],
  },
  {
    id: "sales-executive",
    label: "Sales Executive",
    emoji: "👤",
    color: "#ec4899",
    bgColor: "rgba(236,72,153,0.10)",
    description: "CRM only — leads, follow-ups, site visits",
    navAccess: ["/dashboard", "/leads", "/followups", "/site-visits", "/reports"],
  },
];

const ROLE_KEY = "ott-user-role-v1";

interface RoleContextValue {
  role: UserRole;
  roleDef: RoleDefinition;
  setRole: (r: UserRole) => void;
  canAccess: (href: string) => boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("md");

  useEffect(() => {
    if (isSupabaseEnabled && supabase) {
      // Read role from Supabase user_profiles
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session) {
          const { data } = await supabase!
            .from("user_profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();
          const serverRole = data?.role as UserRole | undefined;
          if (serverRole && ROLE_DEFS.find((r) => r.id === serverRole)) {
            setRoleState(serverRole);
            window.localStorage.setItem(ROLE_KEY, serverRole);
            return;
          }
        }
        // Fallback: read from localStorage (set during role selection on login page)
        const stored = window.localStorage.getItem(ROLE_KEY) as UserRole | null;
        if (stored && ROLE_DEFS.find((r) => r.id === stored)) setRoleState(stored);
      });
    } else {
      // Demo mode: use localStorage only
      const stored = window.localStorage.getItem(ROLE_KEY) as UserRole | null;
      if (stored && ROLE_DEFS.find((r) => r.id === stored)) setRoleState(stored);
    }
  }, []);

  const setRole = useCallback((r: UserRole) => {
    setRoleState(r);
    window.localStorage.setItem(ROLE_KEY, r);
  }, []);

  const roleDef = useMemo(
    () => ROLE_DEFS.find((r) => r.id === role) ?? ROLE_DEFS[0],
    [role]
  );

  const canAccess = useCallback(
    (href: string) => {
      if (roleDef.navAccess === "*") return true;
      return roleDef.navAccess.some(
        (a) => href === a || href.startsWith(a + "/")
      );
    },
    [roleDef]
  );

  const value = useMemo(
    () => ({ role, roleDef, setRole, canAccess }),
    [role, roleDef, setRole, canAccess]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
