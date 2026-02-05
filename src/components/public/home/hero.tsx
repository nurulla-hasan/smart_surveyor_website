'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroProps {
  surveyors: { id: string; name: string; role: string; image: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function Hero({ surveyors, selectedId, onSelect }: HeroProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="outline">
            ✨ Professional Land Surveying Services
          </Badge>
          
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Precision You Can <span className="text-primary bg-clip-text bg-linear-to-r from-primary to-primary/60">Trust</span>, <br />
              Results You Can See.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the future of land surveying with our expert team and cutting-edge digital platform. 
              Accuracy, efficiency, and reliability in every project.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
            <Button size="lg">
              Book a Survey <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              Our Services
            </Button>
          </div>

          {/* Surveyor Selector integrated into Hero section */}
          
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground/60 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground/80">100%</span> Verified Professionals
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground/80">99.9%</span> Accuracy Rate
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-border" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground/80">24/7</span> Project Tracking
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
