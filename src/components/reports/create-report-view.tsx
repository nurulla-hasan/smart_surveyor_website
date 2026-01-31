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
  CardDescription,
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
import { getBookings, getBookingById } from "@/services/bookings";
import { createReport } from "@/services/reports";
import { Client } from "@/types/clients";
import { Booking } from "@/types/bookings";
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

interface CreateReportViewProps {
  initialClients?: Client[];
  initialBookings?: Booking[];
}

export function CreateReportView({
  initialClients = [],
  // initialBookings = [],
}: CreateReportViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<SearchableOption | null>(
    null
  );
  const [selectedBooking, setSelectedBooking] =
    useState<SearchableOption | null>(null);
  const [clientBookings, setClientBookings] = useState<Booking[]>([]);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      content: "",
      mouzaName: "",
      plotNo: "",
      areaSqFt: 0,
      areaKatha: 0,
      areaDecimal: 0,
      notes: "",
      reportFile: undefined,
    },
  });

  const watchedValues = form.watch();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle image preview
  useEffect(() => {
    if (watchedValues.reportFile instanceof File) {
      const objectUrl = URL.createObjectURL(watchedValues.reportFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImagePreview(null);
    }
  }, [watchedValues.reportFile]);

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
        }
      };
      fetchClientBookings();
      setSelectedBooking(null);
    } else {
      setClientBookings([]);
    }
  }, [selectedClient]);

  // Fetch calculation/map data when booking is selected
  useEffect(() => {
    if (selectedBooking) {
      const fetchData = async () => {
        try {
          // Fetch full booking details
          const res = await getBookingById(selectedBooking.value);
          
          if (res?.success && res.data) {
            const booking = res.data;
            let foundData = false;

            // 1. Try savedMaps first
            if (booking.savedMaps && booking.savedMaps.length > 0) {
              const latestMap = booking.savedMaps[0]; // Assuming latest first or take first
              
              if (latestMap.area || latestMap.perimeter) {
                // Populate from Map
                const decimal = Number(latestMap.area || 0);
                form.setValue("areaDecimal", decimal);
                
                // Convert to others
                const sqft = decimal * 435.6;
                form.setValue("areaSqFt", Number(sqft.toFixed(2)));
                form.setValue("areaKatha", Number((sqft / 720).toFixed(4)));
                
                // If calculations exist, try to overwrite sqft with more precise calc data
                if (booking.calculations && booking.calculations.length > 0) {
                   const latestCalc = booking.calculations[0];
                   if (latestCalc.resultData?.areaSqFt) {
                     form.setValue("areaSqFt", latestCalc.resultData.areaSqFt);
                     // Re-calculate Katha to be consistent with SqFt
                     form.setValue("areaKatha", Number((latestCalc.resultData.areaSqFt / 720).toFixed(4)));
                   }
                }
                
                form.setValue("mouzaName", latestMap.name || "");
                foundData = true;
                SuccessToast("ম্যাপ থেকে ডাটা লোড করা হয়েছে");
              }
            }

            // 2. If no map data, try Calculations
            if (!foundData && booking.calculations && booking.calculations.length > 0) {
              const latestCalc = booking.calculations[0];
              if (latestCalc.resultData) {
                form.setValue("areaSqFt", latestCalc.resultData.areaSqFt);
                form.setValue("areaKatha", latestCalc.resultData.areaKatha);
                form.setValue("areaDecimal", latestCalc.resultData.areaDecimal || 0);
                foundData = true;
                SuccessToast("ক্যালকুলেটর থেকে ডাটা লোড করা হয়েছে");
              }
            }

            if (!foundData) {
               // Optional: InfoToast("এই বুকিংয়ের জন্য কোনো পরিমাপ পাওয়া যায়নি");
            }
          }
        } catch (error) {
          console.error("Error fetching booking data:", error);
        }
      };
      fetchData();
    }
  }, [selectedBooking, form]);

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
      // Create a plain object for the payload
      const payloadData: Record<string, any> = {
        ...values,
        clientId: selectedClient.value,
        bookingId: selectedBooking?.value || null,
      };
      
      // Remove file from payloadData to avoid sending it in JSON
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { reportFile, ...jsonPayload } = payloadData;

      console.log("📤 Sending Report Payload:", {
        jsonPayload,
        reportFile: values.reportFile,
      });

      const formData = new FormData();
      formData.append("data", JSON.stringify(jsonPayload));
      
      if (values.reportFile instanceof File) {
        formData.append("reportFile", values.reportFile);
      }

      const res = await createReport(formData as any);
      if (res?.success) {
        SuccessToast("রিপোর্ট সফলভাবে তৈরি করা হয়েছে");
        router.push("/reports");
      } else {
        ErrorToast(res?.message || "তৈরি করতে সমস্যা হয়েছে");
      }
    } catch {
      ErrorToast("কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date().toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">নতুন রিপোর্ট</h1>
            <p className="text-sm text-muted-foreground">
              PDF তৈরি করতে তথ্য পূরণ করুন।
            </p>
          </div>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
          <Save className="size-4" />
          {loading ? "সেভ হচ্ছে..." : "রিপোর্ট সেভ করুন"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                রিপোর্টের তথ্য
              </CardTitle>
              <CardDescription>
                জরিপ এবং ক্লায়েন্টের তথ্য প্রদান করুন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-5">
                  {/* Client Selection */}
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
                            {option.original.phone}
                          </span>
                        </div>
                      )}
                    />
                  </div>

                  {/* Booking Selection - shows after client is selected */}
                  {selectedClient && (
                    <div className="space-y-2">
                      <Label>বুকিং (ঐচ্ছিক)</Label>
                      <SearchableSelect
                        onSelect={setSelectedBooking}
                        fetchOptions={fetchBookingOptions}
                        value={selectedBooking}
                        placeholder="বুকিং সিলেক্ট করুন..."
                        renderOption={(option) => (
                          <div className="flex flex-col py-1">
                            <span className="font-bold text-sm">
                              {option.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {option.original.propertyAddress || "N/A"}
                            </span>
                          </div>
                        )}
                      />
                    </div>
                  )}

                  <Separator />

                  {/* File Upload */}
                  <FormField
                    control={form.control}
                    name="reportFile"
                    render={({ field: { name, onBlur, ref, onChange } }) => (
                      <FormItem>
                        <FormLabel>সার্ভে ম্যাপ / ইমেজ আপলোড (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
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
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Title & Content */}
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
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>বিবরণ</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="জরিপের বিস্তারিত বিবরণ..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Land Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </div>

                  <Separator />

                  {/* Area Measurements with Auto Convert */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>সার্ভেয়র নোটস (ঐচ্ছিক)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="অতিরিক্ত মন্তব্য..."
                            rows={2}
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

        {/* PDF Preview Section */}
        <div className="lg:sticky lg:top-6">
          <Card className="h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                লাইভ প্রিভিউ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white text-black rounded-lg p-6 shadow-inner min-h-125 text-sm">
                {/* PDF Header */}
                <div className="flex flex-col items-center justify-center border-b-2 border-emerald-600 pb-4 mb-4">
                  <h1 className="text-3xl font-black tracking-widest text-emerald-700 uppercase">
                    SMART SURVEYOR
                  </h1>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">
                    <span>Digital Land Survey</span>
                    <span className="text-emerald-400">•</span>
                    <span>Mapping</span>
                    <span className="text-emerald-400">•</span>
                    <span>Consultancy</span>
                  </div>
                </div>

                {/* Client Information */}
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-emerald-700 mb-2">
                    Client Information
                  </h2>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <p>
                      <span className="text-gray-600">Name:</span>{" "}
                      <span className="font-medium">
                        {selectedClient?.label || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Phone:</span>{" "}
                      <span className="font-medium">
                        {selectedClient?.original?.phone || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Date:</span>{" "}
                      <span className="font-medium">{currentDate}</span>
                    </p>
                  </div>
                </div>

                <Separator className="my-3 bg-gray-300" />

                {/* Land Details */}
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-emerald-700 mb-2">
                    Land Details
                  </h2>
                  <div className="text-xs space-y-1">
                    <p>
                      <span className="text-gray-600">Mouza / Area:</span>{" "}
                      <span className="font-medium">
                        {watchedValues.mouzaName || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Plot No (Dag):</span>{" "}
                      <span className="font-medium">
                        {watchedValues.plotNo || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>

                <Separator className="my-3 bg-gray-300" />

                {/* Measurement Results */}
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-emerald-700 mb-2">
                    Measurement Results
                  </h2>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p>
                      <span className="text-gray-600">Total Area (Sq. Ft):</span>
                    </p>
                    <p className="font-bold">{watchedValues.areaSqFt || "0.00"}</p>
                    <p>
                      <span className="text-gray-600">Total Area (Katha):</span>
                    </p>
                    <p className="font-bold">
                      {watchedValues.areaKatha || "0.0000"}
                    </p>
                    <p>
                      <span className="text-gray-600">Total Area (Decimal):</span>
                    </p>
                    <p className="font-bold">
                      {watchedValues.areaDecimal || "0.0000"}
                    </p>
                  </div>
                </div>

                {/* Survey Map Image Attachment */}
                {imagePreview && (
                  <div className="mb-4">
                    <Separator className="my-3 bg-gray-300" />
                    <h2 className="text-sm font-bold text-emerald-700 mb-2">
                      Survey Map / Attachment
                    </h2>
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Survey Map Preview"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* Notes */}
                {watchedValues.notes && (
                  <>
                    <Separator className="my-3 bg-gray-300" />
                    <div>
                      <h2 className="text-sm font-bold text-emerald-700 mb-2">
                        Surveyor Notes
                      </h2>
                      <p className="text-xs text-gray-700">
                        {watchedValues.notes}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
