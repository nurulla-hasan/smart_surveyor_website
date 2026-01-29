"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { AvailabilityDatePicker } from "@/components/bookings/availability-date-picker";

// Define Form Schema
const formSchema = z.object({
  title: z.string().min(1, "শিরোনাম প্রয়োজন"),
  clientId: z.string().optional(),
  newClientName: z.string().optional(),
  newClientPhone: z.string().optional(),
  date: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateBookingModalProps {
  onConfirm?: (data: FormValues) => void;
}

export function CreateBookingModal({ onConfirm }: CreateBookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      clientId: "",
      newClientName: "",
      newClientPhone: "",
      date: new Date(),
    },
  });

  // 2. Handle submit
  const onSubmit = (values: FormValues) => {
    onConfirm?.(values);
    form.reset();
    setIsOpen(false);
  };

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) form.reset();
      }}
      title="নতুন বুকিং যোগ করুন"
      description="নতুন জরিপ বুকিং শিডিউল করতে বিস্তারিত তথ্য দিন।"
      actionTrigger={
        <Button>
          <Plus className="h-5 w-5" />
          নতুন বুকিং
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold uppercase">
                  শিরোনাম / উদ্দেশ্য
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Land Survey for Plot 102" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Client Selection Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase">
                    ক্লায়েন্ট
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="ক্লায়েন্ট নির্বাচন করুন..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Golap Hasan</SelectItem>
                      <SelectItem value="2">Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    ক্লায়েন্ট খুঁজে পাচ্ছেন না? <span className="text-emerald-500 font-bold cursor-pointer">প্রথমে তাদের যোগ করুন</span> অথবা নিচে ম্যানুয়ালি নাম লিখুন।
                  </p>
                </FormItem>
              )}
            />

            {/* Manual Entry Fields */}
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="newClientName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="অথবা নতুন ক্লায়েন্টের নাম লিখুন..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newClientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="ক্লায়েন্টের ফোন নম্বর..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Date Picker Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm font-semibold uppercase">
                  বুকিংয়ের তারিখ
                </FormLabel>
                <AvailabilityDatePicker 
                  date={field.value}
                  setDate={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1 font-semibold uppercase"
            >
              বাতিল
            </Button>
            <Button 
              type="submit" 
              className="flex-1 font-semibold uppercase"
            >
              বুকিং তৈরি করুন
            </Button>
          </div>
        </form>
      </Form>
    </ModalWrapper>
  );
}
