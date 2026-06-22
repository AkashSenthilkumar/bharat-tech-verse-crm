export type LeadStatus =
  | "New"
  | "Interested"
  | "Follow-up"
  | "Site Visit"
  | "Won"
  | "Lost";

export type LeadSource =
  | "Facebook Ads"
  | "Google Ads"
  | "Walk-in"
  | "Referral"
  | "Website"
  | "WhatsApp";

export type Priority = "Low" | "Medium" | "High";

export type FollowUpStatus = "Pending" | "Done" | "Overdue";

export type SiteVisitStatus = "Scheduled" | "Completed" | "Cancelled";

export type TimelineEventType =
  | "call"
  | "followup"
  | "site-visit"
  | "note"
  | "status";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  timestamp: string; // ISO string
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string;
  enquiry: string;
  lastFollowUp: string | null;
  nextFollowUp: string | null;
  createdAt: string;
  timeline: TimelineEvent[];
}

export interface FollowUp {
  id: string;
  leadId: string;
  leadName: string;
  executive: string;
  priority: Priority;
  dueDate: string;
  status: FollowUpStatus;
  remarks?: string;
}

export interface SiteVisit {
  id: string;
  leadId: string;
  leadName: string;
  date: string;
  executive: string;
  status: SiteVisitStatus;
  remarks?: string;
}
