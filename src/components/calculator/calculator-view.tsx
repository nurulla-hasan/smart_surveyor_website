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
  CalendarDays,
  Users,
  ArrowRight,
} from "lucide-react";
import { SuccessToast } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  SearchableSelect,
  SearchableOption,
} from "@/components/ui/custom/searchable-select";
import { getBookings } from "@/services/bookings";
import { saveCalculation, deleteCalculation } from "@/services/calculations";
import { Calculation } from "@/types/calculations";
import { Booking } from "@/types/bookings";
import {
  CalculatorHistory,
} from "./calculator-history";

const formSchema = z.object({
  north: z.number().min(0, "সঠিক মাপ দিন"),
  south: z.number().min(0, "সঠিক মাপ দিন"),
  east: z.number().min(0, "সঠিক মাপ দিন"),
  west: z.number().min(0, "সঠিক মাপ দিন"),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculatorViewProps {
  initialHistory?: Calculation[];
  initialBookings?: Booking[];
}

export function CalculatorView({ initialHistory = [], initialBookings = [] }: CalculatorViewProps) {
  const [results, setResults] = useState({ areaSqFt: 0, katha: 0, decimal: 0 });
  const [history, setHistory] = useState<Calculation[]>(initialHistory);
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
        type: 'area' as const,
        bookingId: selectedBooking?.value,
        inputData: {
          sides: [values.north, values.south, values.east, values.west]
        },
        resultData: {
          areaSqFt: results.areaSqFt,
          areaKatha: results.katha,
          areaDecimal: results.decimal
        }
      };

      const res = await saveCalculation(payload);
      if (res?.success) {
        setHistory([res.data, ...history]);
        SuccessToast("গণনা সফলভাবে সেভ করা হয়েছে");
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      const res = await deleteCalculation(id);
      if (res?.success) {
        setHistory(history.filter((h) => h.id !== id));
        SuccessToast("রেকর্ড ডিলিট করা হয়েছে");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const fetchBookingOptions = useCallback(async (search: string): Promise<SearchableOption[]> => {
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
  }, [initialBookings]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Map className="h-5 w-5 text-primary" /> পরিমাপ ইনপুট
            </CardTitle>
            <CardDescription>দৈর্ঘ্য ও প্রস্থ ফুটে প্রদান করুন</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="north"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>উত্তর (ফুট)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
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
                        <FormLabel>দক্ষিণ (ফুট)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
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
                        <FormLabel>পূর্ব (ফুট)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
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
                        <FormLabel>পশ্চিম (ফুট)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
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
                    className="flex-1"
                    onClick={handleReset}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> রিসেট
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Calculator className="mr-2 h-4 w-4" /> গণনা
                  </Button>
                </div>
              </form>
            </Form>
            {/* Quick Links Section */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <Link href="/bookings" className="group">
                <Card className="p-6 border-border/50 bg-card/30 hover:bg-primary/5 transition-all duration-300 flex items-center justify-between overflow-hidden relative">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold uppercase tracking-tight">
                        বুকিং লিস্ট দেখুন
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium">
                        আপনার সব অ্যাপয়েন্টমেন্ট ম্যানেজ করুন।
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <CalendarDays className="h-24 w-24" />
                  </div>
                </Card>
              </Link>

              <Link href="/clients" className="group">
                <Card className="p-6 border-border/50 bg-card/30 hover:bg-primary/5 transition-all duration-300 flex items-center justify-between overflow-hidden relative">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold uppercase tracking-tight">
                        ক্লায়েন্ট ম্যানেজমেন্ট
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium">
                        নতুন ক্লায়েন্ট যোগ করুন বা তথ্য দেখুন।
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Users className="h-24 w-24" />
                  </div>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="border-border/60 bg-muted/20">
          <CardHeader>
            <CardTitle className="text-lg">হিসাবকৃত ফলাফল</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-background p-6 rounded-lg border text-center">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-tight">
                মোট ক্ষেত্রফল
              </p>
              <h2 className="text-4xl font-bold mt-1">
                {results.areaSqFt}{" "}
                <span className="text-sm text-muted-foreground font-normal">
                  বর্গফুট
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">কাঠা</p>
                <p className="text-xl font-bold">{results.katha}</p>
              </div>
              <div className="bg-background p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">শতাংশ</p>
                <p className="text-xl font-bold">{results.decimal}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">বুকিং ট্যাগ করুন (ঐচ্ছিক)</Label>
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
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={!results.areaSqFt || loading}
                onClick={handleSave}
                loading={loading}
              >
                <Save className="mr-2 h-4 w-4" /> রেকর্ড সেভ করুন
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Section */}
      <CalculatorHistory history={history} onDelete={handleDeleteHistory} />
    </div>
  );
}

