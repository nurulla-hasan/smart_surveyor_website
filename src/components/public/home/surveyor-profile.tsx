'use client';

import React from 'react';
import { MapPin, Star, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Surveyor } from '@/types/surveyor.type';

interface SurveyorProfileProps {
  surveyor: Surveyor;
}

export function SurveyorProfile({ surveyor }: SurveyorProfileProps) {
  const profileImage = surveyor?.profileImage || "";
  const initial = surveyor?.name?.charAt(0) || "?";

  return (
    <div className="space-y-6">
      <Card className="pt-0 overflow-hidden border-none shadow-2xl bg-background/50 backdrop-blur-sm">
        <div className="h-32 bg-linear-to-br from-primary/20 via-primary/10 to-transparent relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-size-[24px_24px]" />
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="relative p-1 bg-background rounded-full shadow-xl">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={profileImage || undefined} alt={surveyor?.name} className="object-cover" />
                <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 bg-green-500 h-5 w-5 rounded-full border-4 border-background shadow-sm" />
            </div>
          </div>
        </div>
        
        <CardContent className="pt-16 pb-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black tracking-tight">{surveyor?.name}</CardTitle>
              <CardDescription className="text-primary font-bold uppercase tracking-widest text-[10px]">
                {surveyor?.role || "Professional Surveyor"}
              </CardDescription>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-muted/30 p-4 rounded-3xl text-center border border-border/50">
                <div className="flex items-center justify-center text-orange-500 font-black text-xl mb-0.5">
                  <Star className="h-4 w-4 fill-current mr-1" /> {surveyor?.rating || 0}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {surveyor?.totalReviews || 0} Reviews
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-3xl text-center border border-border/50">
                <div className="font-black text-foreground text-xl mb-0.5">
                  {surveyor?.experience || "N/A"}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Experience
                </div>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground bg-primary/5 border border-primary/10 py-3 rounded-2xl">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-bold text-sm tracking-tight">{surveyor?.location || "Bangladesh"}</span>
              </div>

              <div className="relative group px-4">
                <div className="absolute -inset-1 bg-linear-to-r from-primary/10 to-primary/0 rounded-2xl blur opacity-25" />
                <p className="relative text-sm text-muted-foreground leading-relaxed italic">
                  &quot;{surveyor?.bio || "Expert surveyor dedicated to providing high-quality surveying services for residential and commercial projects."}&quot;
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
