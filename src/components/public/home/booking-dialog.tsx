/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { ModalWrapper } from '@/components/ui/custom/modal-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSurveyor: any;
  selectedDate: Date | undefined;
}

export function BookingDialog({ isOpen, onClose, selectedSurveyor, selectedDate }: BookingDialogProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    propertyAddress: '',
    clientName: '',
    clientPhone: '',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
      setFormData({
        title: '',
        propertyAddress: '',
        clientName: '',
        clientPhone: '',
        description: ''
      });
    }, 300);
  };

  return (
    <ModalWrapper 
      open={isOpen} 
      onOpenChange={resetAndClose}
      title="Book a Survey"
      description={selectedDate ? format(selectedDate, 'PPP') : 'No date selected'}
    >
      <div className="p-8">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-4"
            >
              <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Booking Request Successful!</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your information has been sent. {selectedSurveyor?.name} will contact you soon.
                </p>
              </div>
              <Button onClick={resetAndClose} className="mt-6 rounded-2xl px-8 h-12 font-bold">
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {step === 1 ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold ml-1">Service Title (Optional)</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                      <Input 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Digital Survey, Boundary Demarcation" 
                        className="rounded-2xl h-14 pl-12 bg-muted/20 border-border/50 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-bold ml-1">Property Address (Optional)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground/50" />
                      <Textarea 
                        name="propertyAddress"
                        value={formData.propertyAddress}
                        onChange={handleInputChange}
                        placeholder="Enter detailed property address..." 
                        className="rounded-2xl min-h-30 pl-12 pt-4 bg-muted/20 border-border/50 focus:ring-primary/20 resize-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold ml-1">Your Name (Optional)</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                        <Input 
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          placeholder="Enter your full name" 
                          className="rounded-2xl h-14 pl-12 bg-muted/20 border-border/50 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold ml-1">Phone Number (Optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                        <Input 
                          name="clientPhone"
                          value={formData.clientPhone}
                          onChange={handleInputChange}
                          placeholder="017XXXXXXXX" 
                          className="rounded-2xl h-14 pl-12 bg-muted/20 border-border/50 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold ml-1">Additional Notes (Optional)</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-muted-foreground/50" />
                      <Textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter any special requests here..." 
                        className="rounded-2xl min-h-25 pl-12 pt-4 bg-muted/20 border-border/50 focus:ring-primary/20 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isSuccess && (
        <div className="p-8 pt-0 flex flex-row items-center justify-between gap-4">
          <div className="flex gap-1.5">
            {[1, 2].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 w-6 rounded-full transition-all duration-300",
                  step === i ? "bg-primary w-10" : "bg-primary/10"
                )} 
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <Button
                variant="ghost"
                onClick={handleBack}
                className="rounded-2xl h-12 px-6 font-bold"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}

            {step < 2 ? (
              <Button
                onClick={handleNext}
                className="rounded-2xl h-12 px-8 font-black text-base shadow-lg shadow-primary/20"
              >
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-2xl h-12 px-8 font-black text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Please wait...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Confirm Booking <CheckCircle2 className="h-4 w-4" />
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}
