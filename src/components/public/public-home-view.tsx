/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Navbar } from './home/navbar';
import { Hero } from './home/hero';
import { SurveyorProfile } from './home/surveyor-profile';
import { BookingSection } from './home/booking-section';
import { Stats } from './home/stats';
import { Footer } from './home/footer';

// Fake Data for Design
const FAKE_SURVEYORS = [
  {
    id: '1',
    name: 'Golap Hasan',
    role: 'Senior Surveyor',
    rating: 4.9,
    reviews: 124,
    experience: '10+ Years',
    location: 'Dinajpur, Bangladesh',
    image: 'https://github.com/shadcn.png',
    bio: 'Expert in land measurements, topographic surveys, and digital mapping with over a decade of field experience.'
  },
  {
    id: '2',
    name: 'Nurulla Hasan',
    role: 'GIS Specialist',
    rating: 4.8,
    reviews: 89,
    experience: '8 Years',
    location: 'Dhaka, Bangladesh',
    image: 'https://github.com/shadcn.png',
    bio: 'Specialized in Geographic Information Systems (GIS) and precise boundary surveys for residential and commercial projects.'
  },
  {
    id: '3',
    name: 'Abdur Rahman',
    role: 'Topographic Expert',
    rating: 4.7,
    reviews: 56,
    experience: '5 Years',
    location: 'Rangpur, Bangladesh',
    image: 'https://github.com/shadcn.png',
    bio: 'Focused on topographic mapping and construction site surveys with high-precision equipment.'
  }
];

export default function PublicHomeView({ user }: { user?: any }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSurveyorId, setSelectedSurveyorId] = useState<string>(FAKE_SURVEYORS[0].id);

  const surveyor = FAKE_SURVEYORS.find(s => s.id === selectedSurveyorId) || FAKE_SURVEYORS[0];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar user={user} />
      
      <main>
        <Hero 
          surveyors={FAKE_SURVEYORS} 
          selectedId={selectedSurveyorId} 
          onSelect={setSelectedSurveyorId} 
        />
        
        <section className="py-24">
          <div className="container mx-auto px-4">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <SurveyorProfile surveyor={surveyor} />
              </div>

              <div className="lg:col-span-7">
                <BookingSection 
                  surveyors={FAKE_SURVEYORS} 
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
