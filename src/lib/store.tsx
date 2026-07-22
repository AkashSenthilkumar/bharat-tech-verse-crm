"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FOLLOW_UPS as SEED_FOLLOW_UPS,
  LEADS as SEED_LEADS,
  SITE_VISITS as SEED_SITE_VISITS,
} from "@/lib/data";
import type {
  FollowUp,
  Lead,
  LeadSource,
  LeadStatus,
  Priority,
  SiteVisit,
  SiteVisitStatus,
  TimelineEvent,
} from "@/lib/types";

const STORAGE_KEY = "ott-platform-data-v1";

interface AddFollowUpInput {
  date: string;
  time: string;
  remarks: string;
  priority: Priority;
  nextFollowUpDate?: string;
}

interface AddSiteVisitInput {
  date: string;
  executive: string;
  remarks?: string;
}

interface AddLeadInput {
  name: string;
  phone: string;
  email: string;
  location: string;
  source: LeadSource;
  assignedTo: string;
  enquiry: string;
}

interface CrmContextValue {
  leads: Lead[];
  followUps: FollowUp[];
  siteVisits: SiteVisit[];
  getLead: (id: string) => Lead | undefined;
  addLead: (input: AddLeadInput) => string;
  addFollowUp: (leadId: string, input: AddFollowUpInput) => void;
  addSiteVisit: (leadId: string, input: AddSiteVisitInput) => void;
  setLeadStatus: (leadId: string, status: LeadStatus) => void;
  reassignLead: (leadId: string, executive: string) => void;
  setSiteVisitStatus: (visitId: string, status: SiteVisitStatus) => void;
  resetDemoData: () => void;
}

const CrmContext = createContext<CrmContextValue | null>(null);

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface PersistedShape {
  leads: Lead[];
  followUps: FollowUp[];
  siteVisits: SiteVisit[];
}

function loadPersisted(): PersistedShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedShape;
  } catch {
    return null;
  }
}

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(
    () => loadPersisted()?.leads ?? SEED_LEADS
  );
  const [followUps, setFollowUps] = useState<FollowUp[]>(
    () => loadPersisted()?.followUps ?? SEED_FOLLOW_UPS
  );
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(
    () => loadPersisted()?.siteVisits ?? SEED_SITE_VISITS
  );

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ leads, followUps, siteVisits })
    );
  }, [leads, followUps, siteVisits]);

  const getLead = useCallback(
    (id: string) => leads.find((lead) => lead.id === id),
    [leads]
  );

  const appendTimelineEvent = useCallback(
    (leadId: string, event: TimelineEvent) => {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId
            ? { ...lead, timeline: [...lead.timeline, event] }
            : lead
        )
      );
    },
    []
  );

  const addLead = useCallback((input: AddLeadInput) => {
    const id = nextId("lead");
    const today = new Date().toISOString().slice(0, 10);
    const newLead: Lead = {
      id,
      name: input.name,
      phone: input.phone,
      email: input.email,
      location: input.location,
      source: input.source,
      status: "New",
      assignedTo: input.assignedTo,
      enquiry: input.enquiry,
      lastFollowUp: null,
      nextFollowUp: null,
      createdAt: today,
      timeline: [
        {
          id: nextId("ev"),
          type: "note",
          title: "Lead captured",
          description: `Lead created manually via ${input.source}`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setLeads((prev) => [newLead, ...prev]);
    return id;
  }, []);

  const addFollowUp = useCallback(
    (leadId: string, input: AddFollowUpInput) => {
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return;

      const followUp: FollowUp = {
        id: nextId("fu"),
        leadId,
        leadName: lead.name,
        executive: lead.assignedTo,
        priority: input.priority,
        dueDate: input.date,
        status: "Pending",
        remarks: input.remarks,
      };
      setFollowUps((prev) => [followUp, ...prev]);

      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? {
                ...l,
                lastFollowUp: input.date,
                nextFollowUp: input.nextFollowUpDate ?? l.nextFollowUp,
                status: l.status === "New" ? "Follow-up" : l.status,
              }
            : l
        )
      );

      appendTimelineEvent(leadId, {
        id: nextId("ev"),
        type: "followup",
        title: "Follow-up added",
        description: input.remarks || `Follow-up scheduled at ${input.time}`,
        timestamp: `${input.date}T${input.time || "00:00"}:00`,
      });
    },
    [leads, appendTimelineEvent]
  );

  const addSiteVisit = useCallback(
    (leadId: string, input: AddSiteVisitInput) => {
      const lead = leads.find((l) => l.id === leadId);
      if (!lead) return;

      const siteVisit: SiteVisit = {
        id: nextId("sv"),
        leadId,
        leadName: lead.name,
        date: input.date,
        executive: input.executive || lead.assignedTo,
        status: "Scheduled",
        remarks: input.remarks,
      };
      setSiteVisits((prev) => [siteVisit, ...prev]);

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: "Site Visit" } : l))
      );

      appendTimelineEvent(leadId, {
        id: nextId("ev"),
        type: "site-visit",
        title: "Site visit scheduled",
        description: input.remarks || `Site visit scheduled on ${input.date}`,
        timestamp: `${input.date}T09:00:00`,
      });
    },
    [leads, appendTimelineEvent]
  );

  const setLeadStatus = useCallback(
    (leadId: string, status: LeadStatus) => {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status } : l))
      );
      appendTimelineEvent(leadId, {
        id: nextId("ev"),
        type: "status",
        title: `Marked as ${status}`,
        description:
          status === "Won"
            ? "Lead marked as Won"
            : status === "Lost"
              ? "Lead marked as Lost"
              : `Status updated to ${status}`,
        timestamp: new Date().toISOString(),
      });
    },
    [appendTimelineEvent]
  );

  const reassignLead = useCallback(
    (leadId: string, executive: string) => {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, assignedTo: executive } : l
        )
      );
      appendTimelineEvent(leadId, {
        id: nextId("ev"),
        type: "note",
        title: "Executive reassigned",
        description: `Lead reassigned to ${executive}`,
        timestamp: new Date().toISOString(),
      });
    },
    [appendTimelineEvent]
  );

  const setSiteVisitStatus = useCallback(
    (visitId: string, status: SiteVisitStatus) => {
      const visit = siteVisits.find((v) => v.id === visitId);
      setSiteVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, status } : v))
      );
      if (visit) {
        appendTimelineEvent(visit.leadId, {
          id: nextId("ev"),
          type: "site-visit",
          title:
            status === "Completed"
              ? "Site visit completed"
              : status === "Cancelled"
                ? "Site visit cancelled"
                : "Site visit rescheduled",
          description: visit.remarks,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [siteVisits, appendTimelineEvent]
  );

  const resetDemoData = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setLeads(SEED_LEADS);
    setFollowUps(SEED_FOLLOW_UPS);
    setSiteVisits(SEED_SITE_VISITS);
  }, []);

  const value = useMemo(
    () => ({
      leads,
      followUps,
      siteVisits,
      getLead,
      addLead,
      addFollowUp,
      addSiteVisit,
      setLeadStatus,
      reassignLead,
      setSiteVisitStatus,
      resetDemoData,
    }),
    [
      leads,
      followUps,
      siteVisits,
      getLead,
      addLead,
      addFollowUp,
      addSiteVisit,
      setLeadStatus,
      reassignLead,
      setSiteVisitStatus,
      resetDemoData,
    ]
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used within CrmProvider");
  return ctx;
}
