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
    currentPassword: zod.string().min(1, "Current password required"),
    newPassword: zod.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: zod.string().min(1, "Confirm password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
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
        toast.success("Password changed successfully");
        form.reset();
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Failed to change password");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Change Password"
      description="Enter a new password to ensure your account security."
      actionTrigger={
        <Button variant="outline">
          <Lock className="h-4 w-4" />
          Change Password
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
                    <FormLabel>Current Password</FormLabel>
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
                    <FormLabel>New Password</FormLabel>
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
                    <FormLabel>Confirm Password</FormLabel>
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
                  {loading ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      {/* </ScrollArea> */}
    </ModalWrapper>
  );
}
