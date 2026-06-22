"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MoreHorizontal, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { useCrm } from "@/lib/store";
import { EXECUTIVES } from "@/lib/data";

const VISIT_STATUSES = ["Scheduled", "Completed", "Cancelled"] as const;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function SiteVisitsPage() {
  const router = useRouter();
  const { siteVisits, setSiteVisitStatus } = useCrm();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [executive, setExecutive] = useState<string>("All");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...siteVisits]
      .filter((visit) => {
        const matchesQuery =
          !query || visit.leadName.toLowerCase().includes(query);
        const matchesStatus = status === "All" || visit.status === status;
        const matchesExecutive =
          executive === "All" || visit.executive === executive;
        return matchesQuery && matchesStatus && matchesExecutive;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [siteVisits, search, status, executive]);

  function handleStatusChange(
    visitId: string,
    leadName: string,
    next: "Scheduled" | "Completed" | "Cancelled"
  ) {
    setSiteVisitStatus(visitId, next);
    toast.success(`${leadName}'s site visit marked ${next}`);
  }

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

          <Select value={status} onValueChange={(v) => setStatus(v ?? "All")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {VISIT_STATUSES.map((s) => (
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
                <TableHead>Date</TableHead>
                <TableHead>Assigned Executive</TableHead>
                <TableHead>Visit Status</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>
                    <button
                      onClick={() => router.push(`/leads/${visit.leadId}`)}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {visit.leadName}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(visit.date)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {visit.executive}
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={visit.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {visit.remarks}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={visit.status === "Completed"}
                          onClick={() =>
                            handleStatusChange(visit.id, visit.leadName, "Completed")
                          }
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={visit.status === "Cancelled"}
                          onClick={() =>
                            handleStatusChange(visit.id, visit.leadName, "Cancelled")
                          }
                        >
                          <XCircle className="h-4 w-4" />
                          Mark Cancelled
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={visit.status === "Scheduled"}
                          onClick={() =>
                            handleStatusChange(visit.id, visit.leadName, "Scheduled")
                          }
                        >
                          Reschedule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No site visits match your filters.
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
