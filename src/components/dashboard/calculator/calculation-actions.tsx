"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Calculation } from "@/types/calculations";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import { deleteCalculation } from "@/services/calculations";
import { SuccessToast, ErrorToast } from "@/lib/utils";

interface CalculationActionsProps {
  calculation: Calculation;
}

export function CalculationActions({ calculation }: CalculationActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteCalculation(calculation.id);
      if (res?.success) {
        SuccessToast("Record deleted successfully");
        setOpen(false);
      } else {
        ErrorToast(res?.message || "Problem deleting record");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        title="Are you sure?"
        description="This calculation cannot be restored once deleted."
        onConfirm={handleDelete}
        isLoading={isDeleting}
        trigger={
          <Button variant="ghost" size="icon-sm" className="hover:text-destructive">
            <Trash2 />
          </Button>
        }
      />
    </div>
  );
}
