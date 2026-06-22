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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCrm } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/types";

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

const PRIORITY_ACTIVE_CLASS: Record<Priority, string> = {
  Low: "bg-slate-100 text-slate-700 border-slate-300",
  Medium: "bg-amber-50 text-amber-700 border-amber-300",
  High: "bg-rose-50 text-rose-700 border-rose-300",
};

export function AddFollowUpModal({
  leadId,
  trigger,
}: {
  leadId: string;
  trigger: React.ReactNode;
}) {
  const { addFollowUp } = useCrm();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:00");
  const [remarks, setRemarks] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [nextDate, setNextDate] = useState<Date | undefined>(undefined);

  function reset() {
    setDate(new Date());
    setTime("10:00");
    setRemarks("");
    setPriority("Medium");
    setNextDate(undefined);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;

    addFollowUp(leadId, {
      date: format(date, "yyyy-MM-dd"),
      time,
      remarks,
      priority,
      nextFollowUpDate: nextDate ? format(nextDate, "yyyy-MM-dd") : undefined,
    });

    toast.success("Follow-up added");
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
          <DialogTitle>Add Follow-up</DialogTitle>
          <DialogDescription>
            Log the next touchpoint for this lead.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date</Label>
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
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="followup-time">Time</Label>
              <Input
                id="followup-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="followup-remarks">Remarks</Label>
            <Textarea
              id="followup-remarks"
              placeholder="What was discussed / next steps..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                    priority === p
                      ? PRIORITY_ACTIVE_CLASS[p]
                      : "border-border text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Next Follow-up Date</Label>
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
                {nextDate ? format(nextDate, "dd MMM yyyy") : "Pick a date"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={nextDate}
                  onSelect={setNextDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="-mx-0 -mb-0 mt-2 rounded-none border-0 bg-transparent p-0">
            <Button type="submit" className="w-full sm:w-auto">
              Save Follow-up
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
