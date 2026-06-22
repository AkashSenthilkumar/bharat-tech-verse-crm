"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CrmProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

function pageTitle(pathname: string) {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/leads/")) return "Lead Details";
  if (pathname.startsWith("/leads")) return "Leads";
  if (pathname.startsWith("/followups")) return "Follow-ups";
  if (pathname.startsWith("/site-visits")) return "Site Visits";
  if (pathname.startsWith("/reports")) return "Reports";
  return "Bharat Tech Verse CRM";
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
