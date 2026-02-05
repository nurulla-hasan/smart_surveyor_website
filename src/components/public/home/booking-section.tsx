 
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { ArrowRight, Calendar, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { BookingCalendar } from '../../dashboard/bookings/booking-calendar';
import { BookingDialog } from './booking-dialog';
import { Surveyor } from '@/types/surveyor.type';
import { cn } from '@/lib/utils';

interface BookingSectionProps {
  // user: any;
  surveyors: Surveyor[];
  selectedId: string;
  onSelect: (id: string) => void;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function BookingSection({ surveyors, selectedId, selectedDate, onDateSelect }: BookingSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedSurveyor = useMemo(() => 
    surveyors.find(s => s.id === selectedId || s._id === selectedId),
  [surveyors, selectedId]);

  const handleOpenDialog = useCallback(() => {
    if (selectedDate) {
      setIsDialogOpen(true);
    }
  }, [selectedDate]);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  return (
    <section className="py-12" id="booking-section">
      <div className="container mx-auto max-w-5xl">
        <Card className="pt-0 border-none shadow-xl bg-background/60 backdrop-blur-md overflow-hidden rounded-3xl">
          <CardHeader className="border-b border-border/40 bg-muted/10 px-8 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Availability</span>
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Schedule with {selectedSurveyor?.name}
                </CardTitle>
              </div>
              {selectedDate && (
                <div className="hidden md:flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                  <span className="text-sm font-medium text-primary">
                    Selected: {format(selectedDate, 'MMMM do, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Calendar Column */}
              <div className="lg:col-span-7">
                <div className="bg-background/40 rounded-2xl p-4 border border-border/40 shadow-inner">
                  <BookingCalendar 
                    selectedDate={selectedDate}
                    onSelect={onDateSelect}
                    surveyorId={selectedId}
                    disableBookedDates={true}
                  />
                </div>
              </div>

              {/* Info Column */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                      <Info className="h-3.5 w-3.5" />
                      Status Guide
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Available', color: 'bg-background border border-border' },
                        { label: 'Booked', color: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' },
                        { label: 'Off-Day', color: 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.4)]' },
                        { label: 'Selected', color: 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <div className={cn("h-3 w-3 rounded-full", item.color)} />
                          <span className="text-sm font-medium text-muted-foreground/80">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-muted/20 border border-border/40 space-y-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Target Date</p>
                      <p className="text-lg font-bold text-foreground">
                        {selectedDate ? format(selectedDate, 'EEEE, MMM do') : 'Select a date'}
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20 active:scale-[0.98]"
                      disabled={!selectedDate}
                      onClick={handleOpenDialog}
                    >
                      Continue to Booking
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground/60 italic mt-6">
                  * Final availability will be confirmed after your request is processed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BookingDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        selectedSurveyor={selectedSurveyor}
        selectedDate={selectedDate}
      />
    </section>
  );
}
