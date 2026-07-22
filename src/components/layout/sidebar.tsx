"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  BarChart3,
  CalendarClock,
  Camera,
  ClipboardList,
  Cpu,
  Factory,
  HardHat,
  IndianRupee,
  LayoutDashboard,
  MapPinned,
  Package,
  RotateCcw,
  ShieldCheck,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCrm } from "@/lib/store";

const MANUFACTURING_NAV = [
  { href: "/production", label: "Production", icon: Factory },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/procurement", label: "Procurement", icon: Truck },
  { href: "/quality", label: "Quality", icon: ShieldCheck },
  { href: "/workforce", label: "Workforce", icon: HardHat },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/finance", label: "Finance", icon: IndianRupee },
  { href: "/energy", label: "Energy", icon: Zap },
  { href: "/vision", label: "Factory Vision", icon: Camera },
];

const CRM_NAV = [
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/followups", label: "Follow-ups", icon: CalendarClock },
  { href: "/site-visits", label: "Site Visits", icon: MapPinned },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: typeof Users;
  pathname: string;
}) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/25"
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          active ? "text-primary" : "text-sidebar-foreground/60"
        )}
      />
      {label}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
      {children}
    </p>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { resetDemoData } = useCrm();

  function handleReset() {
    if (
      !window.confirm(
        "Reset all demo data to its original state? This clears every change made in this session."
      )
    ) {
      return;
    }
    resetDemoData();
    toast.success("Demo data reset");
  }

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar shrink-0 sticky top-0">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
          <Cpu className="h-4.5 w-4.5 text-primary" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-foreground tracking-tight">
            One To Technologies
          </p>
          <p className="text-[11px] text-muted-foreground">Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <NavLink href="/dashboard" label="Dashboard" icon={LayoutDashboard} pathname={pathname} />

        <SectionLabel>Manufacturing</SectionLabel>
        {MANUFACTURING_NAV.map((item) => (
          <NavLink key={item.href} {...item} pathname={pathname} />
        ))}

        <SectionLabel>CRM</SectionLabel>
        {CRM_NAV.map((item) => (
          <NavLink key={item.href} {...item} pathname={pathname} />
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          Reset demo data
        </button>
        <p className="text-[11px] text-muted-foreground">
          Demo build &middot; Coimbatore
        </p>
      </div>
    </aside>
  );
}
