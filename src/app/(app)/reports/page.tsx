import {
  CalendarCheck2,
  MapPinned,
  PhoneCall,
  PhoneIncoming,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  CallsVsConnectedBar,
  ConversionFunnelChart,
  WeeklyActivityLine,
} from "@/components/reports/charts";
import {
  CALLS_VS_CONNECTED,
  CONVERSION_FUNNEL,
  REPORTS_STATS,
  WEEKLY_ACTIVITY_TREND,
} from "@/lib/data";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Calls"
          value={REPORTS_STATS.totalCalls}
          icon={PhoneCall}
          trend="+8% this month"
        />
        <StatCard
          label="Connected Calls"
          value={REPORTS_STATS.connectedCalls}
          icon={PhoneIncoming}
          trend="69% connect rate"
        />
        <StatCard
          label="Follow-ups Done"
          value={REPORTS_STATS.followUpsDone}
          icon={CalendarCheck2}
          trend="+5% this month"
        />
        <StatCard
          label="Site Visits"
          value={REPORTS_STATS.siteVisits}
          icon={MapPinned}
          trend="+3 this month"
        />
        <StatCard
          label="Conversions"
          value={REPORTS_STATS.conversions}
          icon={Trophy}
          trend="+1 this month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Calls vs Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <CallsVsConnectedBar data={CALLS_VS_CONNECTED} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ConversionFunnelChart data={CONVERSION_FUNNEL} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyActivityLine data={WEEKLY_ACTIVITY_TREND} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
