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
        SuccessToast("রেকর্ড সফলভাবে ডিলিট করা হয়েছে");
        setOpen(false);
      } else {
        ErrorToast(res?.message || "ডিলিট করতে সমস্যা হয়েছে");
      }
    } catch {
      ErrorToast("কিছু ভুল হয়েছে");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        title="আপনি কি নিশ্চিত?"
        description="এই গণনাটি ডিলিট করলে তা আর ফিরিয়ে আনা সম্ভব হবে না।"
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
