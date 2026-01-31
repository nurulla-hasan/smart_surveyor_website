"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Download } from "lucide-react";
import { Report } from "@/types/reports";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import { deleteReport } from "@/services/reports";
import { SuccessToast, ErrorToast } from "@/lib/utils";

interface ReportActionsProps {
  report: Report;
}

export function ReportActions({ report }: ReportActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteReport(report.id);
      if (res?.success) {
        SuccessToast("রিপোর্ট সফলভাবে ডিলিট করা হয়েছে");
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
      <Button variant="ghost" size="icon-sm" className="hover:text-foreground">
        <Eye />
      </Button>
      {report.fileUrl && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="hover:text-foreground"
          asChild
        >
          <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
            <Download />
          </a>
        </Button>
      )}
      <ConfirmationModal
        open={open}
        onOpenChange={setOpen}
        title="আপনি কি নিশ্চিত?"
        description="এই রিপোর্টটি ডিলিট করলে তা আর ফিরিয়ে আনা সম্ভব হবে না।"
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
