"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { useCrm } from "@/lib/store";
import { EXECUTIVES } from "@/lib/data";
import { cn } from "@/lib/utils";

const PRIORITIES = ["Low", "Medium", "High"] as const;
const FOLLOWUP_STATUSES = ["Pending", "Done", "Overdue"] as const;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function FollowUpsPage() {
  const router = useRouter();
  const { followUps } = useCrm();
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [executive, setExecutive] = useState<string>("All");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...followUps]
      .filter((f) => {
        const matchesQuery = !query || f.leadName.toLowerCase().includes(query);
        const matchesPriority = priority === "All" || f.priority === priority;
        const matchesStatus = status === "All" || f.status === status;
        const matchesExecutive = executive === "All" || f.executive === executive;
        return matchesQuery && matchesPriority && matchesStatus && matchesExecutive;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [followUps, search, priority, status, executive]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by lead name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
            />
          </div>

          <Select value={priority} onValueChange={(v) => setPriority(v ?? "All")}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Priorities</SelectItem>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => setStatus(v ?? "All")}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {FOLLOWUP_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={executive} onValueChange={(v) => setExecutive(v ?? "All")}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Executive" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Executives</SelectItem>
              {EXECUTIVES.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Executive</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((followUp) => {
                const overdue = followUp.status === "Overdue";
                return (
                  <TableRow
                    key={followUp.id}
                    className={cn(
                      overdue &&
                        "border-l-2 border-l-rose-500 bg-rose-500/5 hover:bg-rose-500/10"
                    )}
                  >
                    <TableCell>
                      <button
                        onClick={() => router.push(`/leads/${followUp.leadId}`)}
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {followUp.leadName}
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {followUp.executive}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={followUp.priority} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(followUp.dueDate)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={followUp.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    No follow-ups match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
