/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/services/auth";
import { ModalWrapper } from "../ui/custom/modal-wrapper";
// import { ScrollArea } from "../ui/scroll-area";

const passwordSchema = zod
  .object({
    currentPassword: zod.string().min(1, "বর্তমান পাসওয়ার্ড প্রয়োজন"),
    newPassword: zod.string().min(6, "নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে"),
    confirmPassword: zod.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটি মিলছে না",
    path: ["confirmPassword"],
  });

export function ChangePasswordModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<zod.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: zod.infer<typeof passwordSchema>) {
    setLoading(true);
    try {
      const res = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (res?.success) {
        toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে");
        form.reset();
        setIsOpen(false);
      } else {
        toast.error(res?.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে");
      }
    } catch (error: any) {
      toast.error(error?.message || "কিছু একটা ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={setIsOpen}
      title="পাসওয়ার্ড পরিবর্তন করুন"
      description="আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নতুন পাসওয়ার্ড দিন।"
      actionTrigger={
        <Button variant="outline">
          <Lock className="h-4 w-4" />
          পাসওয়ার্ড পরিবর্তন
        </Button>
      }
    >
      {/* <ScrollArea className="max-h-[65vh]"> */}
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>বর্তমান পাসওয়ার্ড</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>নতুন পাসওয়ার্ড</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto font-bold uppercase tracking-tighter"
                >
                  {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      {/* </ScrollArea> */}
    </ModalWrapper>
  );
}
