"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  ThumbsDown,
  ThumbsUp,
  UserCog,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Timeline } from "@/components/shared/timeline";
import { AddFollowUpModal } from "@/components/modals/add-followup-modal";
import { ScheduleSiteVisitModal } from "@/components/modals/schedule-site-visit-modal";
import { AssignExecutiveModal } from "@/components/modals/assign-executive-modal";
import { useCrm } from "@/lib/store";

export function LeadDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const { getLead, setLeadStatus } = useCrm();
  const lead = getLead(id);

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-muted-foreground">Lead not found.</p>
        <Button variant="outline" onClick={() => router.push("/leads")}>
          Back to Leads
        </Button>
      </div>
    );
  }

  function handleMarkWon() {
    setLeadStatus(lead!.id, "Won");
    toast.success(`${lead!.name} marked as Won`);
  }

  function handleMarkLost() {
    setLeadStatus(lead!.id, "Lost");
    toast.error(`${lead!.name} marked as Lost`);
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/leads")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Leads
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight">
              {lead.name}
            </h2>
            <StatusBadge value={lead.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {lead.enquiry}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <AddFollowUpModal
            leadId={lead.id}
            trigger={<Button variant="outline">Add Follow-up</Button>}
          />
          <ScheduleSiteVisitModal
            leadId={lead.id}
            defaultExecutive={lead.assignedTo}
            trigger={<Button variant="outline">Schedule Site Visit</Button>}
          />
          <Button
            onClick={handleMarkWon}
            disabled={lead.status === "Won"}
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300"
          >
            <ThumbsUp className="h-4 w-4" />
            Mark Won
          </Button>
          <Button
            onClick={handleMarkLost}
            disabled={lead.status === "Lost"}
            className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300"
          >
            <ThumbsDown className="h-4 w-4" />
            Mark Lost
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Customer Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Phone} label="Phone" value={lead.phone} />
            <InfoRow icon={Mail} label="Email" value={lead.email} />
            <InfoRow icon={MapPin} label="Location" value={lead.location} />
            <InfoRow icon={Megaphone} label="Source" value={lead.source} />
            <div className="flex items-start justify-between gap-3">
              <InfoRow icon={UserCog} label="Assigned To" value={lead.assignedTo} />
              <AssignExecutiveModal
                leadId={lead.id}
                leadName={lead.name}
                currentExecutive={lead.assignedTo}
                trigger={
                  <Button variant="ghost" size="icon-sm" className="shrink-0" title="Reassign executive">
                    <UserCog className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline events={lead.timeline} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-muted-foreground shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
