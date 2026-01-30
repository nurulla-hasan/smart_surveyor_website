/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CheckCircle2 } from "lucide-react";
import { updateBooking } from "@/services/bookings";
import { SuccessToast, ErrorToast } from "@/lib/utils";

const formSchema = z.object({
  amountReceived: z.coerce.number().min(0, "সঠিক অংক দিন"),
  amountDue: z.coerce.number().min(0, "সঠিক অংক দিন"),
  paymentNote: z.string().default(""),
});

type FormValues = z.infer<typeof formSchema>;

interface CompleteBookingModalProps {
  bookingId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CompleteBookingModal({ bookingId, trigger, onSuccess }: CompleteBookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      amountReceived: 0,
      amountDue: 0,
      paymentNote: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const res = await updateBooking(bookingId, {
        status: "completed",
        ...values,
      });

      if (res?.success) {
        SuccessToast("বুকিং সফলভাবে সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে");
        setIsOpen(false);
        onSuccess?.();
      } else {
        ErrorToast(res?.message || "আপডেট করতে সমস্যা হয়েছে");
      }
    } catch {
      ErrorToast("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={setIsOpen}
      title="বুকিং সম্পন্ন করুন"
      description="জরিপটি সম্পন্ন হলে পেমেন্ট সংক্রান্ত তথ্য দিয়ে এটি ক্লোজ করুন।"
      actionTrigger={
        trigger || (
          <Button size="sm" variant="outline" className="font-bold uppercase text-[11px] h-9 px-4 rounded-lg border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 gap-2">
            <CheckCircle2 className="h-4 w-4" /> সম্পন্ন হিসেবে চিহ্নিত করুন
          </Button>
        )
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amountReceived"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase">প্রাপ্ত টাকা (৳)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amountDue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase">বাকি টাকা (৳)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="paymentNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold uppercase">পেমেন্ট নোট</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Full payment cleared" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1 font-semibold uppercase"
              disabled={loading}
            >
              বাতিল
            </Button>
            <Button 
              type="submit" 
              className="flex-1 font-semibold uppercase bg-emerald-600 hover:bg-emerald-700"
              loading={loading}
              loadingText="আপডেট হচ্ছে..."
            >
              সম্পন্ন করুন
            </Button>
          </div>
        </form>
      </Form>
    </ModalWrapper>
  );
}