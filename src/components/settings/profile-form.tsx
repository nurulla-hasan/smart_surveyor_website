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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateProfile } from '@/services/profile';
import { useRouter } from 'next/navigation';

const profileSchema = zod.object({
  name: zod.string().min(2, 'নাম অন্তত ২ অক্ষরের হতে হবে'),
  phone: zod.string().optional(),
  companyName: zod.string().optional(),
  licenseNo: zod.string().optional(),
  address: zod.string().optional(),
  experience: zod.string().optional(),
  location: zod.string().optional(),
  bio: zod.string().optional(),
});

export function ProfileForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.profileImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<zod.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || '',
      phone: initialData?.phone || '',
      companyName: initialData?.companyName || '',
      licenseNo: initialData?.licenseNo || '',
      address: initialData?.address || '',
      experience: initialData?.experience?.toString() || '0',
      location: initialData?.location || '',
      bio: initialData?.bio || '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: zod.infer<typeof profileSchema>) {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }

      const res = await updateProfile(formData);
      if (res?.success) {
        toast.success('প্রোফাইল সফলভাবে আপডেট করা হয়েছে');
        router.refresh();
      } else {
        toast.error(res?.message || 'আপডেট করতে সমস্যা হয়েছে');
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
        <CardTitle>প্রোফাইল সেটিংস</CardTitle>
        <CardDescription>আপনার ব্যক্তিগত এবং পেশাদার তথ্য আপডেট করুন।</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview || ''} alt={initialData?.name} />
                <AvatarFallback>{initialData?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <FormLabel htmlFor="profileImage">প্রোফাইল ছবি</FormLabel>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">
                  JPG, PNG অথবা WebP ফরম্যাট (সর্বোচ্চ ২ মেগাবাইট)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>নাম</FormLabel>
                    <FormControl>
                      <Input placeholder="আপনার নাম" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ফোন নম্বর</FormLabel>
                    <FormControl>
                      <Input placeholder="আপনার ফোন নম্বর" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>কোম্পানির নাম</FormLabel>
                    <FormControl>
                      <Input placeholder="কোম্পানির নাম" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="licenseNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>লাইসেন্স নম্বর</FormLabel>
                    <FormControl>
                      <Input placeholder="লাইসেন্স নম্বর" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>অভিজ্ঞতা (বছর)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="অভিজ্ঞতা" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>লোকেশন</FormLabel>
                    <FormControl>
                      <Input placeholder="লোকেশন" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ঠিকানা</FormLabel>
                  <FormControl>
                    <Textarea placeholder="আপনার পূর্ণ ঠিকানা" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>বায়ো (Bio)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="আপনার সম্পর্কে কিছু বলুন" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading}>
              {loading ? 'আপডেট হচ্ছে...' : 'সেভ করুন'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
