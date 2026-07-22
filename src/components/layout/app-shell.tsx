"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CrmProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

function pageTitle(pathname: string) {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/production")) return "Production Intelligence";
  if (pathname.startsWith("/inventory")) return "Inventory Intelligence";
  if (pathname.startsWith("/procurement")) return "Procurement Intelligence";
  if (pathname.startsWith("/quality")) return "Quality Intelligence";
  if (pathname.startsWith("/workforce")) return "Workforce Intelligence";
  if (pathname.startsWith("/orders")) return "Order Intelligence";
  if (pathname.startsWith("/finance")) return "Finance Intelligence";
  if (pathname.startsWith("/energy")) return "Energy Intelligence";
  if (pathname.startsWith("/vision")) return "Factory Vision Intelligence";
  if (pathname.startsWith("/leads/")) return "Lead Details";
  if (pathname.startsWith("/leads")) return "Leads";
  if (pathname.startsWith("/followups")) return "Follow-ups";
  if (pathname.startsWith("/site-visits")) return "Site Visits";
  if (pathname.startsWith("/reports")) return "Reports";
  return "One To Technologies";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <CrmProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <Header title={pageTitle(pathname)} />
          <main
            key={pathname}
            className="flex-1 p-6 animate-in fade-in slide-in-from-bottom-1 duration-300"
          >
            {children}
          </main>
        </div>
      </div>
      <Toaster />
    </CrmProvider>
  );
}
