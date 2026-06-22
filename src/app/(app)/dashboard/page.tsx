"use client";

import { useRouter } from "next/navigation";
import {
  CalendarCheck2,
  CalendarClock,
  MapPinned,
  PhoneCall,
  Trophy,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  FollowupPerformanceLine,
  LeadStatusPie,
  MonthlyConversionsBar,
} from "@/components/dashboard/charts";
import { AddFollowUpModal } from "@/components/modals/add-followup-modal";
import { StatusBadge } from "@/components/shared/status-badge";
import { useCrm } from "@/lib/store";
import {
  DASHBOARD_ACTIVITY_LEAD_IDS,
  FOLLOWUP_PERFORMANCE,
  LEAD_STATUSES,
  MONTHLY_CONVERSIONS,
  TODAY,
} from "@/lib/data";
import { Plus } from "lucide-react";

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { leads, followUps, siteVisits } = useCrm();

  const todayStr = TODAY.toISOString().slice(0, 10);

  const totalLeads = leads.length;
  const todaysCalls = 9;
  const todaysFollowUps = followUps.filter(
    (f) => f.dueDate === todayStr && f.status !== "Done"
  ).length;
  const upcomingFollowUps = followUps.filter(
    (f) => f.status === "Pending" && f.dueDate > todayStr
  ).length;
  const siteVisitsScheduled = siteVisits.filter(
    (s) => s.status === "Scheduled"
  ).length;
  const convertedLeads = leads.filter((l) => l.status === "Won").length;

  const statusDistribution = LEAD_STATUSES.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  })).filter((d) => d.count > 0);

  const activityLeads = DASHBOARD_ACTIVITY_LEAD_IDS.map((id) =>
    leads.find((l) => l.id === id)
  ).filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Leads"
          value={totalLeads}
          icon={Users}
          trend="+12% this week"
        />
        <StatCard
          label="Today's Calls"
          value={todaysCalls}
          icon={PhoneCall}
          trend="+4% vs yesterday"
        />
        <StatCard
          label="Today's Follow-ups"
          value={todaysFollowUps}
          icon={CalendarClock}
          trend="On track"
        />
        <StatCard
          label="Upcoming Follow-ups"
          value={upcomingFollowUps}
          icon={CalendarCheck2}
          trend="Next 7 days"
        />
        <StatCard
          label="Site Visits Scheduled"
          value={siteVisitsScheduled}
          icon={MapPinned}
          trend="+2 this week"
        />
        <StatCard
          label="Converted Leads"
          value={convertedLeads}
          icon={Trophy}
          trend="+1 this month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadStatusPie data={statusDistribution} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyConversionsBar data={MONTHLY_CONVERSIONS} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Follow-up Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <FollowupPerformanceLine data={FOLLOWUP_PERFORMANCE} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Follow-up</TableHead>
                <TableHead>Executive</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <StatusBadge value={lead.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(lead.nextFollowUp)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {lead.assignedTo}
                  </TableCell>
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AddFollowUpModal
                      leadId={lead.id}
                      trigger={
                        <Button variant="ghost" size="icon-sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
