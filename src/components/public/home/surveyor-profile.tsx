'use client';

import React from 'react';
import { MapPin, Star, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Surveyor {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  experience: string;
  location: string;
  image: string;
  bio: string;
}

interface SurveyorProfileProps {
  surveyor: Surveyor;
}

export function SurveyorProfile({ surveyor }: SurveyorProfileProps) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="h-40 bg-linear-to-br from-primary via-primary/80 to-primary/60 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-size-[24px_24px]" />
        </div>
        <CardContent>
          <div className="flex flex-col items-center -mt-20 text-center space-y-6">
            <div className="relative">
              <Avatar>
                <AvatarImage src={surveyor.image} alt={surveyor.name} />
                <AvatarFallback>{surveyor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-2 right-2 bg-green-500 h-6 w-6 rounded-full border-4 border-background" />
            </div>
            
            <div className="space-y-2">
              <CardTitle>{surveyor.name}</CardTitle>
              <CardDescription>
                {surveyor.role}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-10 py-4 bg-muted/30 px-8 rounded-3xl w-full">
              <div className="text-center flex-1">
                <div className="flex items-center justify-center text-orange-500 font-black text-xl mb-1">
                  <Star className="h-5 w-5 fill-current mr-1.5" /> {surveyor.rating}
                </div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{surveyor.reviews} Reviews</div>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="text-center flex-1">
                <div className="font-black text-foreground text-xl mb-1">{surveyor.experience}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Experience</div>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/20 py-3 rounded-2xl">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">{surveyor.location}</span>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-primary/0 rounded-2xl blur opacity-25" />
                <p className="relative text-base text-muted-foreground italic leading-relaxed px-4">
                  &quot;{surveyor.bio}&quot;
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-sm font-black">Verified</div>
              <div className="text-xs font-bold text-muted-foreground">Licensed Pro</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-sm font-black">Punctual</div>
              <div className="text-xs font-bold text-muted-foreground">On-time Delivery</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
