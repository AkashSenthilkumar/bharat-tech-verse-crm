"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrm } from "@/lib/store";
import { EXECUTIVES } from "@/lib/data";

export function AssignExecutiveModal({
  leadId,
  leadName,
  currentExecutive,
  trigger,
}: {
  leadId: string;
  leadName: string;
  currentExecutive: string;
  trigger: React.ReactNode;
}) {
  const { reassignLead } = useCrm();
  const [open, setOpen] = useState(false);
  const [executive, setExecutive] = useState(currentExecutive);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reassignLead(leadId, executive);
    toast.success(`${leadName} reassigned to ${executive}`);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setExecutive(currentExecutive);
      }}
    >
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Reassign Lead</DialogTitle>
          <DialogDescription>
            Change the executive assigned to {leadName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Executive</Label>
            <Select
              value={executive}
              onValueChange={(value) => setExecutive(value ?? currentExecutive)}
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

          <DialogFooter className="-mx-0 -mb-0 mt-2 rounded-none border-0 bg-transparent p-0">
            <Button type="submit" className="w-full sm:w-auto">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
