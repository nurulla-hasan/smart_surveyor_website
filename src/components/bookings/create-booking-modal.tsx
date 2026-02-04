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
import { Plus, CalendarIcon } from "lucide-react";
import { BookingCalendar } from "@/components/bookings/booking-calendar";
import { getClients } from "@/services/clients";
import { createBooking } from "@/services/bookings";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { useCallback, useEffect } from "react";
import { SearchableSelect, SearchableOption } from "@/components/ui/custom/searchable-select";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Define Form Schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  propertyAddress: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  clientPhone: z.string().optional(),
  bookingDate: z.date({
    error: "Booking date is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateBookingModalProps {
  onSuccess?: () => void;
}

export function CreateBookingModal({ onSuccess }: CreateBookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const [selectedClient, setSelectedClient] = useState<SearchableOption | null>(null);

  // Fetch clients for selection
  const fetchClientOptions = useCallback(async (search: string): Promise<SearchableOption[]> => {
    const res = await getClients({ search, pageSize: "10" });
    if (res?.clients) {
      return res.clients.map((client: any) => ({
        value: client.id,
        label: client.name,
        original: client,
      }));
    }
    return [];
  }, []);

  // 1. Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      propertyAddress: "",
      clientId: "",
      clientName: "",
      clientPhone: "",
      bookingDate: undefined as unknown as Date,
    },
  });

  // Auto-select date from URL if available
  useEffect(() => {
    const dateParam = searchParams.get("date");
    if (dateParam && isOpen) {
      form.setValue("bookingDate", new Date(dateParam));
    }
  }, [searchParams, isOpen, form]);

  // 2. Handle submit
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // Prepare payload based on selection or manual entry
      const payload: any = {
        title: values.title,
        description: values.description || "",
        propertyAddress: values.propertyAddress || "",
        bookingDate: format(values.bookingDate, "yyyy-MM-dd"),
      };

      if (values.clientId) {
        payload.clientId = values.clientId;
      } else {
        payload.clientName = values.clientName;
        payload.clientPhone = values.clientPhone;
      }

      const res = await createBooking(payload);
      if (res?.success) {
        SuccessToast("Booking created successfully");
        form.reset();
        setSelectedClient(null);
        setIsOpen(false);
        onSuccess?.();
      } else {
        ErrorToast(res?.message || "Problem creating booking");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
          setSelectedClient(null);
        }
      }}
      title="Add New Booking"
      description="Provide details to schedule a new survey booking."
      actionTrigger={
        <Button>
          <Plus />
          New Booking
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
                  Title / Purpose
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Land Survey for Plot 102" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="propertyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase">
                    Property Address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Savar, Dhaka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Write something about the survey..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Client Selection Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-semibold uppercase">
                    Client
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      onSelect={(option) => {
                        const value = option?.value || "";
                        field.onChange(value);
                        // Clear manual entry fields if a client is selected
                        if (value) {
                          form.setValue("clientName", "");
                          form.setValue("clientPhone", "");
                        }
                        setSelectedClient(option);
                      }}
                      placeholder="Select a client..."
                      searchPlaceholder="Search client..."
                      fetchOptions={fetchClientOptions}
                      value={selectedClient}
                    />
                  </FormControl>
                  <FormMessage />
                  {!field.value && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Can&apos;t find client? <span className="text-emerald-500 font-bold cursor-pointer">Add them first</span> or enter name manually below.
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* Manual Entry Fields - Only show if no client is selected */}
            {!form.watch("clientId") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Or enter new client name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Client phone number..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Date Selection Section */}
          <FormField
            control={form.control}
            name="bookingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm font-semibold uppercase">
                  Select Booking Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: enUS })
                        ) : (
                          <span>Select Date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <BookingCalendar
                      selectedDate={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                      }}
                      className="border-none shadow-none"
                    />
                  </PopoverContent>
                </Popover>
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 font-semibold uppercase"
              loading={loading}
              loadingText="Creating..."
            >
              Create Booking
            </Button>
          </div>
        </form>
        </Form>
    </ModalWrapper>
  );
}
