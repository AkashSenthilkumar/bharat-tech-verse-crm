"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cpu } from "lucide-react";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseEnabled) {
      // Demo mode: allow through if role exists in localStorage
      const role = window.localStorage.getItem("ott-user-role-v1");
      if (!role) {
        router.replace("/");
        return;
      }
      setReady(true);
      return;
    }

    // Real auth: verify Supabase session
    supabase!.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/");
      } else {
        setReady(true);
      }
    });

    // Keep auth state in sync
    const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/30">
            <Cpu className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
