"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ModalWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  actionTrigger?: ReactNode;
  showClose?: boolean;
}

export function ModalWrapper({
  open,
  onOpenChange,
  title,
  description,
  children,
  actionTrigger,
  showClose = false,
}: ModalWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {actionTrigger && (
        <DialogTrigger asChild>
          {actionTrigger}
        </DialogTrigger>
      )}

      <DialogContent className="p-0 gap-0">
        
        {/* Header Section */}
        {title && (
          <DialogHeader className="px-6 py-4 border-b shrink-0 text-left">
            <DialogTitle className="text-xl font-black  uppercase tracking-tighter">
              {title}
            </DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        {/* Content Body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </div>

        {showClose && (
          <div className="p-4 border-t bg-muted/20 flex justify-end shrink-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="font-bold uppercase ">
                Close
              </Button>
            </DialogClose>
          </div>
        )}
        
      </DialogContent>
    </Dialog>
  );
}