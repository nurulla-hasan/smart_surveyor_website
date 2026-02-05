 
'use client';

import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { BookingCalendar } from '../../dashboard/bookings/booking-calendar';
import { SurveyorSelector } from './surveyor-selector';
import { BookingDialog } from './booking-dialog';
import { useState } from 'react';

interface BookingSectionProps {
  surveyors: { id: string; name: string; role: string; image: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export function BookingSection({ surveyors, selectedId, onSelect, selectedDate, onDateSelect }: BookingSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const selectedSurveyor = surveyors.find(s => s.id === selectedId);

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black tracking-tight">Check Availability</CardTitle>
              <CardDescription className="text-base font-medium">Select a date to start your journey</CardDescription>
            </div>
            <div className="w-full md:w-auto">
              <SurveyorSelector 
                surveyors={surveyors} 
                selectedId={selectedId} 
                onSelect={onSelect} 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="bg-background/40 rounded-3xl p-4 border border-border/50 my-8">
            <BookingCalendar 
              selectedDate={selectedDate}
              onSelect={onDateSelect}
              surveyorId={selectedId}
            />
          </div>
          
          <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/70">Legend</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-500/20" />
                  <span className="text-sm font-bold text-muted-foreground">Booked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-destructive ring-4 ring-destructive/20" />
                  <span className="text-sm font-bold text-muted-foreground">Off-Day</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
                  <span className="text-sm font-bold text-muted-foreground">Selected</span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-primary/50 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative bg-background/60 backdrop-blur-xl rounded-3xl p-6 border border-primary/10 flex flex-col justify-between h-full shadow-lg">
                <div className="mb-4">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Target Date</div>
                  <div className="text-lg font-black text-foreground">
                    {selectedDate ? format(selectedDate, 'EEE, MMM do, yyyy') : 'Not Selected'}
                  </div>
                </div>
                <Button 
                  size="lg"
                  disabled={!selectedDate}
                  onClick={() => setIsDialogOpen(true)}
                >
                  Proceed to Book <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <BookingDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedSurveyor={selectedSurveyor}
        selectedDate={selectedDate}
      />
    </>
  );
}
