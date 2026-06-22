"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrm } from "@/lib/store";
import { EXECUTIVES } from "@/lib/data";

export function ScheduleSiteVisitModal({
  leadId,
  defaultExecutive,
  trigger,
}: {
  leadId: string;
  defaultExecutive: string;
  trigger: React.ReactNode;
}) {
  const { addSiteVisit } = useCrm();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [executive, setExecutive] = useState(defaultExecutive);
  const [remarks, setRemarks] = useState("");

  function reset() {
    setDate(undefined);
    setExecutive(defaultExecutive);
    setRemarks("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;

    addSiteVisit(leadId, {
      date: format(date, "yyyy-MM-dd"),
      executive,
      remarks,
    });

    toast.success("Site visit scheduled");
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
          <DialogTitle>Schedule Site Visit</DialogTitle>
          <DialogDescription>
            Set up a site visit for this lead.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Visit Date</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-9 justify-start font-normal"
                  />
                }
              >
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "dd MMM yyyy") : "Pick a date"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <Label>Assigned Executive</Label>
            <Select
              value={executive}
              onValueChange={(value) => setExecutive(value ?? defaultExecutive)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select executive" />
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
            <Label htmlFor="visit-remarks">Remarks</Label>
            <Textarea
              id="visit-remarks"
              placeholder="Purpose of the visit..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="-mx-0 -mb-0 mt-2 rounded-none border-0 bg-transparent p-0">
            <Button type="submit" className="w-full sm:w-auto">
              Schedule Visit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
