"use client";

import { useState, useEffect } from "react";
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
import { Plus, UserPlus, Pencil } from "lucide-react";
import { Client } from "@/types/clients";
import { createClient, updateClient } from "@/services/clients";
import { SuccessToast, ErrorToast } from "@/lib/utils";

const clientSchema = z.object({
  name: z.string().min(1, "নাম প্রয়োজন"),
  email: z.string().email("সঠিক ইমেইল দিন").or(z.literal("")),
  phone: z.string().min(1, "ফোন নম্বর প্রয়োজন"),
  address: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface AddClientModalProps {
  client?: Client;
  trigger?: React.ReactNode;
}

export function AddClientModal({ client, trigger }: AddClientModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        email: client.email || "",
        phone: client.phone,
        address: client.address || "",
      });
    }
  }, [client, form]);

  const onSubmit = async (values: ClientFormValues) => {
    setLoading(true);
    try {
      const res = client 
        ? await updateClient(client.id, values)
        : await createClient(values);

      if (res?.success) {
        SuccessToast(client ? "ক্লায়েন্ট সফলভাবে আপডেট করা হয়েছে" : "ক্লায়েন্ট সফলভাবে যোগ করা হয়েছে");
        form.reset();
        setIsOpen(false);
      } else {
        ErrorToast(res?.message || (client ? "আপডেট করতে সমস্যা হয়েছে" : "যোগ করতে সমস্যা হয়েছে"));
      }
    } catch (error) {
      ErrorToast("কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open && !client) form.reset();
      }}
      title={client ? "ক্লায়েন্ট এডিট করুন" : "নতুন ক্লায়েন্ট যোগ করুন"}
      description={client ? "ক্লায়েন্টের তথ্য আপডেট করতে নিচের ফর্মটি পূরণ করুন।" : "আপনার কাস্টমার ডাটাবেসে নতুন ক্লায়েন্ট যোগ করতে বিস্তারিত তথ্য দিন।"}
      actionTrigger={
        trigger || (
          <Button>
            <Plus className="h-5 w-5" />
            ক্লায়েন্ট যোগ করুন
          </Button>
        )
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold uppercase">
                  নাম
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Golap Hasan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase">
                    ইমেইল
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="example@mail.com" {...field} />
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
                  <FormLabel className="text-sm font-semibold uppercase">
                    ফোন নম্বর
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="017XXXXXXXX" {...field} />
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
                <FormLabel className="text-sm font-semibold uppercase">
                  ঠিকানা
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Dhaka, Bangladesh" {...field} />
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
              className="flex-1 font-semibold uppercase"
              disabled={loading}
            >
              {loading ? "লোডিং..." : client ? "আপডেট করুন" : "যোগ করুন"}
            </Button>
          </div>
        </form>
      </Form>
    </ModalWrapper>
  );
}
