 
'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const FEATURE_CARDS = [
  {
    icon: ShieldCheck,
    title: "Verified Experts",
    description: "Work with licensed and highly experienced land surveyors.",
    color: "bg-blue-500/10",
    iconColor: "text-blue-500"
  },
  {
    icon: Target,
    title: "High Precision",
    description: "Millimeter-level accuracy using the latest digital instruments.",
    color: "bg-primary/10",
    iconColor: "text-primary"
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Get your survey reports faster with our optimized digital workflow.",
    color: "bg-orange-500/10",
    iconColor: "text-orange-500"
  }
];

export function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <section className="relative min-h-[calc(100vh-64px)] py-20 overflow-hidden bg-background flex items-center">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-primary/15 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-10">
            <div className="space-y-6">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary border-primary/20">
                ✨ The Future of Land Surveying
              </Badge>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-foreground leading-[1.05]">
                Precision that <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">Defines</span> Success.
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
                Unlock unmatched accuracy with our state-of-the-art digital platform. 
                Where expertise meets innovation for every project.
              </p>
            </div>

            <div className="flex flex-wrap gap-5">
              <Button size="lg" className="h-14 px-8 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1" asChild>
                <a href="#booking-section" className="flex items-center gap-2">
                  Get Started <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-lg font-bold border-2 hover:bg-muted/50 transition-all">
                Our Services
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-10 pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-foreground">1.2k+</span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Successful Projects</span>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-foreground">99.9%</span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accuracy Guaranteed</span>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-foreground">24/7</span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Expert Support</span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            {/* Main Visual Composition with Carousel */}
            <div className="relative z-20 group max-w-lg w-full">
              <div className="absolute -inset-6 bg-linear-to-tr from-primary/20 to-transparent rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
              
              <Carousel 
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {FEATURE_CARDS.map((feature, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-card border border-border/50 rounded-[3rem] p-6 shadow-2xl backdrop-blur-sm overflow-hidden">
                        <div className="aspect-square bg-muted rounded-[2.5rem] flex items-center justify-center overflow-hidden border border-border/40">
                          <div className="relative flex flex-col items-center gap-8 p-12 text-center">
                            <div className={`w-28 h-28 rounded-4xl ${feature.color} flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-inner`}>
                              <feature.icon className={`h-14 w-14 ${feature.iconColor} -rotate-12 group-hover:rotate-0 transition-transform duration-500`} />
                            </div>
                            <div className="space-y-3">
                              <h3 className="text-3xl font-black tracking-tight">{feature.title}</h3>
                              <p className="text-base text-muted-foreground max-w-60 font-medium leading-relaxed">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-4 lg:hidden">
                  <CarouselPrevious className="relative left-0 translate-x-0" />
                  <CarouselNext className="relative right-0 translate-x-0" />
                </div>
              </Carousel>
              
              {/* Floating UI Elements */}
              <div className="absolute -top-8 -right-8 bg-background/90 backdrop-blur-xl border border-border/50 p-5 rounded-3xl shadow-2xl animate-bounce duration-3000 z-30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase tracking-tighter">Verified</div>
                    <div className="text-xs font-bold text-muted-foreground">Licensed Pro</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-10 -left-10 bg-background/90 backdrop-blur-xl border border-border/50 p-6 rounded-3xl shadow-2xl z-30">
                <div className="flex items-center gap-5">
                  <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-background bg-muted flex items-center justify-center text-xs font-black shadow-sm">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-black leading-tight">
                    Trusted by <br />
                    <span className="text-primary text-sm">1,000+ Clients</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
