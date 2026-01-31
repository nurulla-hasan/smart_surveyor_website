/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  FileText,
  User,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import {
  SearchableSelect,
  SearchableOption,
} from "@/components/ui/custom/searchable-select";
import { getClients } from "@/services/clients";
import { getBookings } from "@/services/bookings";
import { updateReport } from "@/services/reports";
import { Client } from "@/types/clients";
import { Booking } from "@/types/bookings";
import { Report } from "@/types/reports";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const reportSchema = z.object({
  title: z.string().min(1, "শিরোনাম প্রয়োজন"),
  content: z.string().min(1, "বিবরণ প্রয়োজন"),
  mouzaName: z.string().min(1, "মৌজার নাম প্রয়োজন"),
  plotNo: z.string().min(1, "দাগ নং প্রয়োজন"),
  areaSqFt: z.number().min(0, "সঠিক মাপ দিন"),
  areaKatha: z.number().min(0, "সঠিক মাপ দিন"),
  areaDecimal: z.number().min(0, "সঠিক মাপ দিন"),
  notes: z.string().optional(),
  reportFile: z.any().optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface EditReportViewProps {
  report: Report;
  initialClients?: Client[];
}

export function EditReportView({
  report,
  initialClients = [],
}: EditReportViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<SearchableOption | null>({
    value: report.clientId,
    label: report.client.name,
    original: report.client
  });
  const [selectedBooking, setSelectedBooking] =
    useState<SearchableOption | null>(report.bookingId ? {
        value: report.bookingId,
        label: "সংযুক্ত বুকিং",
        original: null
    } : null);
  const [clientBookings, setClientBookings] = useState<Booking[]>([]);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: report.title,
      content: report.content,
      mouzaName: report.mouzaName,
      plotNo: report.plotNo,
      areaSqFt: report.areaSqFt,
      areaKatha: report.areaKatha,
      areaDecimal: report.areaDecimal,
      notes: report.notes || "",
      reportFile: undefined,
    },
  });

  // Fetch bookings when client is selected
  useEffect(() => {
    if (selectedClient) {
      const fetchClientBookings = async () => {
        const res = await getBookings({
          clientId: selectedClient.value,
          pageSize: "50",
        });
        if (res?.success) {
          setClientBookings(res.data.bookings);
          // If the report's booking is in this list, update the label
          const currentBooking = res.data.bookings.find(b => b.id === report.bookingId);
          if (currentBooking) {
              setSelectedBooking({
                  value: currentBooking.id,
                  label: currentBooking.title,
                  original: currentBooking
              });
          }
        }
      };
      fetchClientBookings();
    } else {
      setClientBookings([]);
    }
  }, [selectedClient, report.bookingId]);

  // Auto-convert units
  const handleSqFtChange = (value: number) => {
    form.setValue("areaSqFt", value);
    form.setValue("areaKatha", Number((value / 720).toFixed(4)));
    form.setValue("areaDecimal", Number((value / 435.6).toFixed(4)));
  };

  const handleKathaChange = (value: number) => {
    form.setValue("areaKatha", value);
    const sqft = value * 720;
    form.setValue("areaSqFt", Number(sqft.toFixed(2)));
    form.setValue("areaDecimal", Number((sqft / 435.6).toFixed(4)));
  };

  const handleDecimalChange = (value: number) => {
    form.setValue("areaDecimal", value);
    const sqft = value * 435.6;
    form.setValue("areaSqFt", Number(sqft.toFixed(2)));
    form.setValue("areaKatha", Number((sqft / 720).toFixed(4)));
  };

  const fetchClientOptions = useCallback(
    async (search: string): Promise<SearchableOption[]> => {
      if (!search && initialClients.length > 0) {
        return initialClients.map((c) => ({
          value: c.id,
          label: c.name,
          original: c,
        }));
      }
      const res = await getClients({ search, pageSize: "10" });
      if (res?.success) {
        return res.data.clients.map((c) => ({
          value: c.id,
          label: c.name,
          original: c,
        }));
      }
      return [];
    },
    [initialClients]
  );

  const fetchBookingOptions = useCallback(async (): Promise<
    SearchableOption[]
  > => {
    return clientBookings.map((b) => ({
      value: b.id,
      label: b.title,
      original: b,
    }));
  }, [clientBookings]);

  const onSubmit = async (values: ReportFormValues) => {
    if (!selectedClient) {
      ErrorToast("ক্লায়েন্ট সিলেক্ট করুন");
      return;
    }

    setLoading(true);
    try {
      const payloadData: Record<string, any> = {
        ...values,
        clientId: selectedClient.value,
        bookingId: selectedBooking?.value || null,
      };
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reportFile, ...jsonPayload } = payloadData;

      const formData = new FormData();
      formData.append("data", JSON.stringify(jsonPayload));
      
      if (values.reportFile instanceof File) {
        formData.append("reportFile", values.reportFile);
      }

      const res = await updateReport(report.id, formData as any);
      if (res?.success) {
        SuccessToast("রিপোর্ট সফলভাবে আপডেট করা হয়েছে");
        router.push("/reports");
      } else {
        ErrorToast(res?.message || "আপডেট করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Update report error:", values, error);
      ErrorToast("কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">রিপোর্ট এডিট করুন</h1>
            <p className="text-sm text-muted-foreground">
              প্রয়োজনীয় তথ্য পরিবর্তন করে সেভ করুন।
            </p>
          </div>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
          <Save className="size-4" />
          {loading ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                রিপোর্টের তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  {/* Row 1: Client, Booking, File */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="size-4" />
                        ক্লায়েন্ট
                      </Label>
                      <SearchableSelect
                        onSelect={setSelectedClient}
                        fetchOptions={fetchClientOptions}
                        value={selectedClient}
                        placeholder="ক্লায়েন্ট সিলেক্ট করুন..."
                        renderOption={(option) => (
                          <div className="flex flex-col py-1">
                            <span className="font-bold text-sm">
                              {option.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {option.original?.phone || ""}
                            </span>
                          </div>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>বুকিং (ঐচ্ছিক)</Label>
                      <SearchableSelect
                        onSelect={setSelectedBooking}
                        fetchOptions={fetchBookingOptions}
                        value={selectedBooking}
                        placeholder={
                          selectedClient
                            ? "বুকিং সিলেক্ট করুন..."
                            : "প্রথমে ক্লায়েন্ট সিলেক্ট করুন"
                        }
                        disabled={!selectedClient}
                        renderOption={(option) => (
                          <div className="flex flex-col py-1">
                            <span className="font-bold text-sm">
                              {option.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {option.original?.propertyAddress || "N/A"}
                            </span>
                          </div>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="reportFile"
                      render={({ field: { name, onBlur, ref, onChange } }) => (
                        <FormItem>
                          <FormLabel>
                            নতুন সার্ভে ম্যাপ / ইমেজ আপলোড (ঐচ্ছিক)
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Input
                                type="file"
                                accept="image/*"
                                name={name}
                                onBlur={onBlur}
                                ref={ref}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  onChange(file);
                                }}
                                className="file:text-primary file:font-bold"
                              />
                              {report.fileUrl && (
                                <div className="text-[10px] text-muted-foreground">
                                  বর্তমান ফাইল:{" "}
                                  <a
                                    href={report.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    ডাউনলোড করুন
                                  </a>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Row 2: Title, Mouza, Plot */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>শিরোনাম</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Survey Report - Plot 102"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mouzaName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="size-3" />
                            মৌজার নাম
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Uttara" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="plotNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>দাগ নং</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 102" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Row 3: Area Measurements */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="areaSqFt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>বর্গফুট (Sq. Ft)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                handleSqFtChange(
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="areaKatha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>কাঠা</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.0000"
                              {...field}
                              onChange={(e) =>
                                handleKathaChange(
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="areaDecimal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>শতাংশ</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.0000"
                              {...field}
                              onChange={(e) =>
                                handleDecimalChange(
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value)
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Full Width Row: Description */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বিবরণ</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="জরিপের বিস্তারিত বিবরণ..."
                            className="min-h-25"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Full Width Row: Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>অতিরিক্ত মন্তব্য (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="অতিরিক্ত মন্তব্য..."
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
