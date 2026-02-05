'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ModalWrapper } from '@/components/ui/custom/modal-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from 'date-fns';
import { 
  MapPin, 
  Phone, 
  User, 
  MessageSquare, 
  Briefcase, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { createBooking } from '@/services/bookings';
import { toast } from 'sonner';
import { Surveyor } from '@/types/surveyor.type';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSurveyor: Surveyor | undefined;
  selectedDate: Date | undefined;
}

const bookingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  propertyAddress: z.string().min(5, "Property address is required"),
  clientName: z.string().min(2, "Your name is required"),
  clientPhone: z.string().regex(/^01[3-9]\d{8}$/, "Please enter a valid 11-digit Bangladeshi phone number"),
  description: z.string().optional(),
  bookingTime: z.string().min(1, "Please select a time slot"),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const TIME_SLOTS = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM"
];

export function BookingDialog({ isOpen, onClose, selectedSurveyor, selectedDate }: BookingDialogProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      title: '',
      propertyAddress: '',
      clientName: '',
      clientPhone: '',
      description: '',
      bookingTime: '',
    },
  });

  const handleNext = async (e?: React.MouseEvent) => {
    console.log("handleNext called, current step:", step);
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const fieldsToValidate = step === 1 
      ? ['title', 'bookingTime', 'propertyAddress'] as const
      : ['clientName', 'clientPhone'] as const;
    
    console.log("Validating fields:", fieldsToValidate);
    const isValid = await form.trigger(fieldsToValidate);
    console.log("Form validation result:", isValid);
    
    if (isValid) {
      if (step === 1) {
        console.log("Moving to step 2");
        setStep(2);
      } else {
        console.log("Submitting form data:", form.getValues());
        await form.handleSubmit(onSubmit)();
      }
    } else {
      console.log("Validation errors:", form.formState.errors);
    }
  };

  const handleBack = useCallback(() => {
    console.log("handleBack called");
    setStep(prev => prev - 1);
  }, []);

  const onSubmit = async (values: BookingFormValues) => {
    console.log("onSubmit triggered with values:", values);
    if (!selectedDate || !selectedSurveyor) {
      console.error("Missing selectedDate or selectedSurveyor", { selectedDate, selectedSurveyor });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const surveyorId = selectedSurveyor.id || (selectedSurveyor as any)._id || (selectedSurveyor as any).id;
      
      const payload = {
        title: values.title,
        propertyAddress: values.propertyAddress,
        clientName: values.clientName,
        clientPhone: values.clientPhone,
        description: values.description,
        bookingDate: selectedDate.toISOString(),
        bookingTime: values.bookingTime,
        surveyorId: surveyorId,
      };

      console.log("Sending booking payload:", payload);
      const response = await createBooking(payload);
      
      if (response?.success) {
        setIsSuccess(true);
        window.dispatchEvent(new CustomEvent('booking-created'));
      } else {
        toast.error(response?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to submit booking. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
      form.reset();
    }, 300);
  }, [onClose, form]);

  const formattedDate = useMemo(() => 
    selectedDate ? format(selectedDate, 'PPP') : 'No date selected',
  [selectedDate]);

  return (
    <ModalWrapper
      open={isOpen}
      onOpenChange={resetAndClose}
      title="Book a Survey"
      description={formattedDate}
    >
      <div className="relative min-h-100 p-6">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-6"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <CheckCircle2 className="h-20 w-20 text-primary relative" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">Booking Requested!</h3>
                <p className="text-muted-foreground font-medium">
                  Your survey request has been sent to <span className="text-foreground font-bold">{selectedSurveyor?.name}</span>. They will contact you shortly.
                </p>
              </div>
              <Button 
                onClick={resetAndClose}
                className="w-full h-12 rounded-xl font-bold text-lg shadow-lg shadow-primary/20"
              >
                Close Window
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <Form {...form}>
                <form className="space-y-4">
                  {step === 1 ? (
                    <>
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Title</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input 
                                  placeholder="e.g., Digital Survey, Boundary Demarcation" 
                                  className="pl-10 h-11"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bookingTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Time</FormLabel>
                            <div className="grid grid-cols-3 gap-2">
                              {TIME_SLOTS.map((slot) => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => field.onChange(slot)}
                                  className={cn(
                                    "flex items-center justify-center gap-1.5 py-2.5 px-1 rounded-xl border text-[11px] font-bold transition-all",
                                    field.value === slot
                                      ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                      : "border-border/50 hover:border-primary/30 hover:bg-muted/50 text-muted-foreground"
                                  )}
                                >
                                  <Clock className="h-3.5 w-3.5" />
                                  {slot}
                                </button>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="propertyAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Address</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Textarea 
                                  placeholder="Enter detailed property address..." 
                                  className="min-h-24 pl-10 pt-2.5 resize-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input 
                                  placeholder="Enter your full name" 
                                  className="pl-10 h-11"
                                  {...field}
                                />
                              </div>
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
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input 
                                  type="tel"
                                  placeholder="017XXXXXXXX" 
                                  className="pl-10 h-11"
                                  {...field}
                                />
                              </div>
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
                            <FormLabel>Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Textarea 
                                  placeholder="Anything else we should know?" 
                                  className="min-h-24 pl-10 pt-2.5 resize-none"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </form>
              </Form>

              <div className="flex items-center gap-3 pt-4">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-12 px-6 rounded-xl font-bold border-2"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back
                  </Button>
                )}
                <Button 
                  type="button"
                  onClick={(e) => {
                    console.log("Button onClick event triggered");
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext(e);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 group"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : step === 1 ? (
                    <>
                      Continue
                      <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <CheckCircle2 className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex justify-center gap-1.5 pt-2">
                <div className={cn("h-1.5 rounded-full transition-all duration-300", step === 1 ? "w-8 bg-primary" : "w-2 bg-muted")} />
                <div className={cn("h-1.5 rounded-full transition-all duration-300", step === 2 ? "w-8 bg-primary" : "w-2 bg-muted")} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ModalWrapper>
  );
}
