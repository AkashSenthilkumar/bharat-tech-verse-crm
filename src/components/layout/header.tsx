"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCrm } from "@/lib/store";
import { TODAY } from "@/lib/data";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  leadId: string;
  title: string;
  detail: string;
}

export function Header({ title }: { title: string }) {
  const router = useRouter();
  const { followUps, siteVisits } = useCrm();

  const todayStr = TODAY.toISOString().slice(0, 10);
  const tomorrowStr = new Date(TODAY.getTime() + 86400000)
    .toISOString()
    .slice(0, 10);

  const notifications = useMemo<Notification[]>(() => {
    const overdue = followUps
      .filter((f) => f.status === "Overdue")
      .map((f) => ({
        id: f.id,
        leadId: f.leadId,
        title: `Overdue follow-up`,
        detail: `${f.leadName} · was due ${new Date(f.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`,
      }));

    const dueToday = followUps
      .filter((f) => f.dueDate === todayStr && f.status === "Pending")
      .map((f) => ({
        id: f.id,
        leadId: f.leadId,
        title: `Follow-up due today`,
        detail: `${f.leadName} · ${f.executive}`,
      }));

    const upcomingVisits = siteVisits
      .filter(
        (v) =>
          v.status === "Scheduled" &&
          (v.date === todayStr || v.date === tomorrowStr)
      )
      .map((v) => ({
        id: v.id,
        leadId: v.leadId,
        title: `Site visit ${v.date === todayStr ? "today" : "tomorrow"}`,
        detail: `${v.leadName} · ${v.executive}`,
      }));

    return [...overdue, ...dueToday, ...upcomingVisits];
  }, [followUps, siteVisits, todayStr, tomorrowStr]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur px-6">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors outline-none">
            <Bell className="h-4.5 w-4.5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                Notifications
                {notifications.length > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    ({notifications.length})
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 && (
                <p className="px-2 py-3 text-sm text-muted-foreground">
                  You&apos;re all caught up.
                </p>
              )}
              {notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex-col items-start gap-0.5"
                  onClick={() => router.push(`/leads/${n.leadId}`)}
                >
                  <span
                    className={cn(
                      "text-sm",
                      n.title.startsWith("Overdue") && "text-rose-600 font-medium"
                    )}
                  >
                    {n.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{n.detail}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-secondary transition-colors outline-none">
            <Avatar size="sm">
              <AvatarFallback className="bg-primary/15 text-primary font-medium">
                AK
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:inline">
              Akash Rey
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/")}>
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
