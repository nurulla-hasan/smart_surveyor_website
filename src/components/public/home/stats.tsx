'use client';

import React from 'react';

const STATS = [
  { label: 'Surveys Completed', value: '1,200+' },
  { label: 'Accuracy Rate', value: '99.9%' },
  { label: 'Happy Clients', value: '500+' },
  { label: 'Districts Covered', value: '15+' },
];

export function Stats() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-foreground/2 -skew-y-3 origin-right" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {STATS.map((stat, index) => (
            <div key={index} className="space-y-4 group">
              <div className="text-4xl md:text-6xl font-black tracking-tighter text-foreground/90 group-hover:text-primary transition-colors duration-500">
                {stat.value}
              </div>
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
