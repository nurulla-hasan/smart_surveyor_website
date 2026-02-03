/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { changePassword } from '@/services/auth';

const passwordSchema = zod.object({
  currentPassword: zod.string().min(1, 'বর্তমান পাসওয়ার্ড প্রয়োজন'),
  newPassword: zod.string().min(6, 'নতুন পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে'),
  confirmPassword: zod.string().min(1, 'পাসওয়ার্ড নিশ্চিত করুন'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "পাসওয়ার্ড দুটি মিলছে না",
  path: ["confirmPassword"],
});

export function PasswordForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<zod.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
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
        toast.success('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে');
        form.reset();
      } else {
        toast.error(res?.message || 'পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে');
      }
    } catch (error: any) {
      toast.error(error?.message || 'কিছু একটা ভুল হয়েছে');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>পাসওয়ার্ড পরিবর্তন করুন</CardTitle>
        <CardDescription>আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে পাসওয়ার্ড আপডেট করুন।</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>বর্তমান পাসওয়ার্ড</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
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
                  <FormLabel>নতুন পাসওয়ার্ড নিশ্চিত করুন</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
