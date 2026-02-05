 
'use client';

import React, { useState, useCallback, useMemo } from 'react';
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
  Loader2,
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

const INITIAL_FORM_DATA = {
  title: '',
  propertyAddress: '',
  clientName: '',
  clientPhone: '',
  description: ''
};

export function BookingDialog({ isOpen, onClose, selectedSurveyor, selectedDate }: BookingDialogProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const validateStep = useCallback((currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      // Optional fields for now as per previous logic, but we can add validation if needed
    } else if (currentStep === 2) {
      if (formData.clientPhone && !/^\d{11}$/.test(formData.clientPhone)) {
        newErrors.clientPhone = 'Please enter a valid 11-digit phone number';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = useCallback(() => {
    if (validateStep(1)) setStep(prev => prev + 1);
  }, [validateStep]);

  const handleBack = useCallback(() => setStep(prev => prev - 1), []);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSurveyor) return;
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        propertyAddress: formData.propertyAddress,
        client: {
          name: formData.clientName,
          phone: formData.clientPhone,
        },
        description: formData.description,
        bookingDate: selectedDate.toISOString(),
        surveyorId: selectedSurveyor.id || selectedSurveyor._id,
      };

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
    // Use a slight delay to allow modal exit animation
    setTimeout(() => {
      setStep(1);
      setIsSuccess(false);
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
    }, 300);
  }, [onClose]);

  const formattedDate = useMemo(() => 
    selectedDate ? format(selectedDate, 'PPP') : 'No date selected',
  [selectedDate]);

  const stepContent = useMemo(() => {
    if (isSuccess) return null;
    
    return step === 1 ? (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Service Title (Optional)</Label>
          <div className="relative group">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Digital Survey, Boundary Demarcation" 
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="propertyAddress">Property Address (Optional)</Label>
          <div className="relative group">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Textarea 
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleInputChange}
              placeholder="Enter detailed property address..." 
              className="min-h-25 pl-10"
            />
          </div>
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Your Name (Optional)</Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                placeholder="Enter your full name" 
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientPhone">Phone Number (Optional)</Label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                id="clientPhone"
                name="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={handleInputChange}
                placeholder="017XXXXXXXX" 
                className={cn(
                  "pl-10",
                  errors.clientPhone && "border-destructive"
                )}
              />
            </div>
            {errors.clientPhone && <p className="text-xs text-destructive">{errors.clientPhone}</p>}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Additional Notes (Optional)</Label>
          <div className="relative group">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter any special requests here..." 
              className="min-h-20 pl-10"
            />
          </div>
        </div>
      </div>
    );
  }, [step, formData, handleInputChange, isSuccess, errors]);

  return (
    <ModalWrapper 
      open={isOpen} 
      onOpenChange={resetAndClose}
      title="Book a Survey"
      description={formattedDate}
    >
      <div className="p-6">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-8 text-center space-y-4"
            >
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Booking Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Your request has been sent. {selectedSurveyor?.name} will contact you shortly.
                </p>
              </div>
              <Button onClick={resetAndClose}>
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {stepContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isSuccess && (
        <div className="p-6 flex items-center justify-between gap-4">
          <div className="flex gap-1">
            {[1, 2].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 w-4 rounded-full transition-all duration-300",
                  step === i ? "bg-primary w-8" : "bg-primary/20"
                )} 
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                <ChevronLeft className="mr-1.5 h-4 w-4" /> Back
              </Button>
            )}

            {step < 2 ? (
              <Button
                onClick={handleNext}
              >
                Next <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    Confirm <CheckCircle2 className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}
