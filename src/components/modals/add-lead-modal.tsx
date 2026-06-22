"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrm } from "@/lib/store";
import { EXECUTIVES, LEAD_SOURCES } from "@/lib/data";
import type { LeadSource } from "@/lib/types";

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  location: "",
  source: "Website" as LeadSource,
  assignedTo: EXECUTIVES[0],
  enquiry: "",
};

export function AddLeadModal({ trigger }: { trigger: React.ReactNode }) {
  const router = useRouter();
  const { addLead } = useCrm();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function reset() {
    setForm(EMPTY_FORM);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    const id = addLead(form);
    toast.success("Lead added", {
      action: {
        label: "View",
        onClick: () => router.push(`/leads/${id}`),
      },
    });
    setOpen(false);
    reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Lead</DialogTitle>
          <DialogDescription>
            Capture a new enquiry into the pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="lead-name">Name</Label>
              <Input
                id="lead-name"
                placeholder="Customer name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-phone">Phone</Label>
              <Input
                id="lead-phone"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-email">Email</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="customer@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-location">Location</Label>
              <Input
                id="lead-location"
                placeholder="Saravanampatti"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Source</Label>
              <Select
                value={form.source}
                onValueChange={(value) =>
                  setForm({ ...form, source: (value as LeadSource) ?? form.source })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Assign To</Label>
            <Select
              value={form.assignedTo}
              onValueChange={(value) =>
                setForm({ ...form, assignedTo: value ?? form.assignedTo })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Executive" />
              </SelectTrigger>
              <SelectContent>
                {EXECUTIVES.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lead-enquiry">Enquiry</Label>
            <Textarea
              id="lead-enquiry"
              placeholder="e.g. 3BHK villa enquiry - Saravanampatti"
              value={form.enquiry}
              onChange={(e) => setForm({ ...form, enquiry: e.target.value })}
              rows={2}
            />
          </div>

          <DialogFooter className="-mx-0 -mb-0 mt-2 rounded-none border-0 bg-transparent p-0">
            <Button type="submit" className="w-full sm:w-auto">
              Add Lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
