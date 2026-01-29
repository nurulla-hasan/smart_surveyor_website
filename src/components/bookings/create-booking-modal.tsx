"use client";

import { useState } from "react";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { AvailabilityDatePicker } from "@/components/bookings/availability-date-picker";

interface CreateBookingModalProps {
  onConfirm?: (data: Record<string, string | Date | undefined | number>) => void;
}

export function CreateBookingModal({ onConfirm }: CreateBookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    clientId: "",
    newClientName: "",
    newClientPhone: "",
    date: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm?.(formData);
    setIsOpen(false);
  };

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={setIsOpen}
      title="নতুন বুকিং যোগ করুন"
      description="নতুন জরিপ বুকিং শিডিউল করতে বিস্তারিত তথ্য দিন।"
      actionTrigger={
        <Button>
          <Plus className="h-5 w-5" />
          নতুন বুকিং
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Title */}
        <div className="grid gap-2">
          <Label className="text-sm font-bold uppercase tracking-tighter">
            শিরোনাম / উদ্দেশ্য
          </Label>
          <Input 
            placeholder="e.g. Land Survey for Plot 102"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Client Selection */}
        <div className="grid gap-2">
          <Label className="text-sm font-bold uppercase tracking-tighter">
            ক্লায়েন্ট
          </Label>
          <Select 
            value={formData.clientId} 
            onValueChange={(val) => setFormData({ ...formData, clientId: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="ক্লায়েন্ট নির্বাচন করুন..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Golap Hasan</SelectItem>
              <SelectItem value="2">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
          
          <p className="text-[11px] text-muted-foreground mt-1">
            ক্লায়েন্ট খুঁজে পাচ্ছেন না? <span className="text-emerald-500 font-bold cursor-pointer">প্রথমে তাদের যোগ করুন</span> অথবা নিচে ম্যানুয়ালি নাম লিখুন।
          </p>
        </div>

        {/* Manual Client Name */}
        <div className="grid gap-2">
          <Input 
            placeholder="অথবা নতুন ক্লায়েন্টের নাম লিখুন..."
            value={formData.newClientName}
            onChange={(e) => setFormData({ ...formData, newClientName: e.target.value })}
          />
        </div>

        {/* Client Phone */}
        <div className="grid gap-2">
          <Input 
            placeholder="ক্লায়েন্টের ফোন নম্বর..."
            value={formData.newClientPhone}
            onChange={(e) => setFormData({ ...formData, newClientPhone: e.target.value })}
          />
        </div>

        {/* Booking Date */}
        <div className="grid gap-2">
          <Label className="text-sm font-bold uppercase tracking-tighter">
            বুকিংয়ের তারিখ
          </Label>
          <AvailabilityDatePicker 
            date={formData.date}
            setDate={(date) => date && setFormData({ ...formData, date })}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="flex-1 h-11 font-black uppercase tracking-tighter"
          >
            বাতিল
          </Button>
          <Button 
            type="submit" 
            className="flex-1 h-11 font-black uppercase tracking-tighter"
          >
            বুকিং তৈরি করুন
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
