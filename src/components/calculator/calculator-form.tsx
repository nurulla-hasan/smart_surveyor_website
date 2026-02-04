"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RotateCcw,
  Calculator,
  Save,
  Map,
  FileText,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { SuccessToast } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  SearchableSelect,
  SearchableOption,
} from "@/components/ui/custom/searchable-select";
import { getBookings } from "@/services/bookings";
import { saveCalculation } from "@/services/calculations";
import { Booking } from "@/types/bookings";

const formSchema = z.object({
  north: z.number().min(0, "সঠিক মাপ দিন"),
  south: z.number().min(0, "সঠিক মাপ দিন"),
  east: z.number().min(0, "সঠিক মাপ দিন"),
  west: z.number().min(0, "সঠিক মাপ দিন"),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculatorFormProps {
  initialBookings?: Booking[];
}

export function CalculatorForm({ initialBookings = [] }: CalculatorFormProps) {
  const [results, setResults] = useState({ areaSqFt: 0, katha: 0, decimal: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<SearchableOption | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      north: 0,
      south: 0,
      east: 0,
      west: 0,
    },
  });

  const onCalculate = (values: FormValues) => {
    const { north, south, east, west } = values;
    const areaSqFt = ((north + south) / 2) * ((east + west) / 2);
    setResults({
      areaSqFt: Number(areaSqFt.toFixed(2)),
      katha: Number((areaSqFt / 720).toFixed(4)),
      decimal: Number((areaSqFt / 435.6).toFixed(4)),
    });
  };

  const handleReset = () => {
    form.reset({
      north: 0,
      south: 0,
      east: 0,
      west: 0,
    });
    setResults({ areaSqFt: 0, katha: 0, decimal: 0 });
    setSelectedBooking(null);
  };

  const handleSave = async () => {
    if (!results.areaSqFt) return;
    setLoading(true);
    try {
      const values = form.getValues();
      const payload = {
        type: "area" as const,
        bookingId: selectedBooking?.value,
        inputData: {
          sides: [values.north, values.south, values.east, values.west],
        },
        resultData: {
          areaSqFt: results.areaSqFt,
          areaKatha: results.katha,
          areaDecimal: results.decimal,
        },
      };

      const res = await saveCalculation(payload);
      if (res?.success) {
        SuccessToast("গণনা সফলভাবে সেভ করা হয়েছে");
        handleReset();
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingOptions = useCallback(
    async (search: string): Promise<SearchableOption[]> => {
      if (!search && initialBookings.length > 0) {
        return initialBookings.map((b) => ({
          value: b.id,
          label: b.title,
          original: b,
        }));
      }
      const res = await getBookings({ search, pageSize: "10" });
      if (res?.success) {
        return res.data.bookings.map((b) => ({
          value: b.id,
          label: b.title,
          original: b,
        }));
      }
      return [];
    },
    [initialBookings],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Card */}
      <div>
        <Card className="border-border/60 shadow-lg backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Map className="h-5 w-5 text-primary" /> পরিমাপ ইনপুট
            </CardTitle>
            <CardDescription className="font-medium">
              দৈর্ঘ্য ও প্রস্থ ফুটে প্রদান করুন
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onCalculate)}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="north"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          উত্তর (ফুট)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="bg-background/50"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
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
                    name="south"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          দক্ষিণ (ফুট)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="bg-background/50"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
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
                    name="east"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          পূর্ব (ফুট)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="bg-background/50"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
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
                    name="west"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                          পশ্চিম (ফুট)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="bg-background/50"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
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
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 font-bold"
                    onClick={handleReset}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> রিসেট
                  </Button>
                  <Button type="submit" className="flex-1 font-bold">
                    <Calculator className="mr-2 h-4 w-4" /> গণনা
                  </Button>
                </div>
              </form>
            </Form>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <Link href="/dashboard/reports/new" className="block">
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border/50 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group text-center cursor-pointer h-full">
                  <FileText className="h-6 w-6 mb-2 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-tight text-emerald-700">
                    নতুন রিপোর্ট
                  </span>
                </div>
              </Link>
              <Link href="/dashboard/bookings" className="block">
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border/50 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all group text-center cursor-pointer h-full">
                  <PlusCircle className="h-6 w-6 mb-2 text-orange-600 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-tight text-orange-700">
                    নতুন বুকিং
                  </span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Card */}
      <Card className="border-border/60 bg-primary/5 shadow-lg backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <CardHeader>
          <CardTitle className="text-lg font-bold">হিসাবকৃত ফলাফল</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="bg-background/80 backdrop-blur-sm p-6 rounded-2xl border shadow-inner text-center">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
              মোট ক্ষেত্রফল
            </p>
            <h2 className="text-4xl font-black text-primary">
              {results.areaSqFt}{" "}
              <span className="text-sm text-muted-foreground font-normal">
                বর্গফুট
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border shadow-sm">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                কাঠা
              </p>
              <p className="text-xl font-black">{results.katha}</p>
            </div>
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border shadow-sm">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                শতাংশ (শতক)
              </p>
              <p className="text-xl font-black">{results.decimal}</p>
            </div>
          </div>
          <Separator className="bg-primary/10" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-tight text-muted-foreground">
                বুকিং ট্যাগ করুন (ঐচ্ছিক)
              </Label>
              <SearchableSelect
                onSelect={setSelectedBooking}
                fetchOptions={fetchBookingOptions}
                value={selectedBooking}
                renderOption={(option) => (
                  <div className="flex flex-col py-1">
                    <span className="font-bold text-sm">{option.label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {option.original.client?.name}
                    </span>
                  </div>
                )}
              />
            </div>
            <Button
              disabled={!results.areaSqFt}
              onClick={handleSave}
              className="w-full"
              loading={loading}
              loadingText="রেকর্ড সেভ হচ্ছে..."
            >
              <Save /> রেকর্ড সেভ করুন
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
