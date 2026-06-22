"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Plus, UserCog, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { AddLeadModal } from "@/components/modals/add-lead-modal";
import { AssignExecutiveModal } from "@/components/modals/assign-executive-modal";
import { useCrm } from "@/lib/store";
import { EXECUTIVES, LEAD_SOURCES, LEAD_STATUSES } from "@/lib/data";

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export default function LeadsPage() {
  const router = useRouter();
  const { leads } = useCrm();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [source, setSource] = useState<string>("All");
  const [assignedTo, setAssignedTo] = useState<string>("All");

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesQuery =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.phone.replace(/\s/g, "").includes(query.replace(/\s/g, ""));
      const matchesStatus = status === "All" || lead.status === status;
      const matchesSource = source === "All" || lead.source === source;
      const matchesAssigned =
        assignedTo === "All" || lead.assignedTo === assignedTo;
      return matchesQuery && matchesStatus && matchesSource && matchesAssigned;
    });
  }, [leads, search, status, source, assignedTo]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8"
            />
          </div>

          <Select value={status} onValueChange={(value) => setStatus(value ?? "All")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={source} onValueChange={(value) => setSource(value ?? "All")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sources</SelectItem>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={assignedTo} onValueChange={(value) => setAssignedTo(value ?? "All")}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Assigned To" />
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

          <AddLeadModal
            trigger={
              <Button className="ml-auto">
                <Plus className="h-4 w-4" />
                Add Lead
              </Button>
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Follow-up</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.phone}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.source}
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={lead.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.assignedTo}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(lead.lastFollowUp)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(lead.nextFollowUp)}
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => router.push(`/leads/${lead.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <AssignExecutiveModal
                        leadId={lead.id}
                        leadName={lead.name}
                        currentExecutive={lead.assignedTo}
                        trigger={
                          <Button variant="ghost" size="icon-sm" title="Reassign executive">
                            <UserCog className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-8"
                  >
                    No leads match your filters.
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
