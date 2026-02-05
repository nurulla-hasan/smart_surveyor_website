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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, FileText, User, MapPin } from "lucide-react";
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
import PageHeader from "../../ui/custom/page-header";

const reportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Description is required"),
  mouzaName: z.string().min(1, "Mouza name is required"),
  plotNo: z.string().min(1, "Plot No is required"),
  areaSqFt: z.number().min(0, "Enter valid area"),
  areaKatha: z.number().min(0, "Enter valid area"),
  areaDecimal: z.number().min(0, "Enter valid area"),
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
  const [selectedClient, setSelectedClient] = useState<SearchableOption | null>(
    {
      value: report.clientId,
      label: report.client.name,
      original: report.client,
    },
  );
  const [selectedBooking, setSelectedBooking] =
    useState<SearchableOption | null>(
      report.bookingId
        ? {
            value: report.bookingId,
            label: "Linked Booking",
            original: null,
          }
        : null,
    );
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
          limit: "50",
        });
        if (res?.success) {
          setClientBookings(res.data.bookings);
          // If the report's booking is in this list, update the label
          const currentBooking = res.data.bookings.find(
            (b: Booking) => b.id === report.bookingId,
          );
          if (currentBooking) {
            setSelectedBooking({
              value: currentBooking.id,
              label: currentBooking.title,
              original: currentBooking,
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
      const res = await getClients({ search, limit: "10" });
      if (res?.clients) {
        return res.clients.map((c: Client) => ({
          value: c.id,
          label: c.name,
          original: c,
        }));
      }
      return [];
    },
    [initialClients],
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
      ErrorToast("Please select a client");
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
        SuccessToast("Report updated successfully");
        router.push("/reports");
      } else {
        ErrorToast(res?.message || "Problem updating report");
      }
    } catch (error) {
      console.error("Update report error:", values, error);
      ErrorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <PageHeader
            title="Edit Report"
            description="Modify information and save changes."
          />
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
          <Save className="size-4" />
          {loading ? "Updating..." : "Update Report"}
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
                Report Information
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
                        Client
                      </Label>
                      <SearchableSelect
                        onSelect={setSelectedClient}
                        fetchOptions={fetchClientOptions}
                        value={selectedClient}
                        placeholder="Select client..."
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
                      <Label>Booking (Optional)</Label>
                      <SearchableSelect
                        onSelect={setSelectedBooking}
                        fetchOptions={fetchBookingOptions}
                        value={selectedBooking}
                        placeholder={
                          selectedClient
                            ? "Select booking..."
                            : "Select a client first"
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
                            Upload New Survey Map / Image (Optional)
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
                                  Current file:{" "}
                                  <a
                                    href={report.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    Download
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
                          <FormLabel>Title</FormLabel>
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
                            Mouza Name
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
                          <FormLabel>Plot No</FormLabel>
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
                          <FormLabel>Total Area (Sq. Ft)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              {...field}
                              onChange={(e) =>
                                handleSqFtChange(
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value),
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
                          <FormLabel>Total Area (Katha)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.0000"
                              {...field}
                              onChange={(e) =>
                                handleKathaChange(
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value),
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
                          <FormLabel>Total Area (Decimal)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.0000"
                              {...field}
                              onChange={(e) =>
                                handleDecimalChange(
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value),
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed survey description..."
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
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional notes..."
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
