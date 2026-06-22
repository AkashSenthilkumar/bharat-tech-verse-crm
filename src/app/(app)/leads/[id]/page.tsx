import { LEADS } from "@/lib/data";
import { LeadDetailsClient } from "@/components/leads/lead-details-client";

export function generateStaticParams() {
  return LEADS.map((lead) => ({ id: lead.id }));
}

export default async function LeadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LeadDetailsClient id={id} />;
}
