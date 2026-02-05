/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback } from 'react';
import { Navbar } from './home/navbar';
import { Hero } from './home/hero';
import { SurveyorSelector } from './home/surveyor-selector';
import { SurveyorProfile } from './home/surveyor-profile';
import { BookingSection } from './home/booking-section';
import { Stats } from './home/stats';
import { Footer } from './home/footer';
import { Surveyor } from '@/types/surveyor.type';

export default function PublicHomeView({ 
  user, 
  initialSurveyors
}: { 
  user?: any;
  initialSurveyors: Surveyor[];
}) {
  const [surveyors, setSurveyors] = useState<Surveyor[]>(initialSurveyors);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSurveyorId, setSelectedSurveyorId] = useState<string>(
    initialSurveyors[0]?.id || ""
  );

  const surveyor = surveyors.find(s => s.id === selectedSurveyorId) || surveyors[0];

  // Update surveyors list when selector fetches new data
  const handleSurveyorDataChange = useCallback((newData: Surveyor[]) => {
    setSurveyors(newData);
  }, []);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar user={user} />
      
      <main>
        <Hero />
        
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <SurveyorSelector 
              initialSurveyors={initialSurveyors} 
              selectedId={selectedSurveyorId} 
              onSelect={setSelectedSurveyorId} 
              onDataChange={handleSurveyorDataChange}
            />
          </div>
        </section>
        
        <section id="booking-section" className="py-24">
          <div className="container mx-auto px-4">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <SurveyorProfile surveyor={surveyor} />
              </div>

              <div className="lg:col-span-7">
                <BookingSection 
                  surveyors={surveyors} 
                  selectedId={selectedSurveyorId} 
                  onSelect={setSelectedSurveyorId} 
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>
            </div>
          </div>
        </section>

        <Stats />
      </main>

      <Footer />
    </div>
  );
}
