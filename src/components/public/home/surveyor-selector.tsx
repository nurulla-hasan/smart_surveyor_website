'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

interface Surveyor {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface SurveyorSelectorProps {
  surveyors: Surveyor[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function SurveyorSelector({ surveyors, selectedId, onSelect }: SurveyorSelectorProps) {
  return (
    <div className="max-w-xl mx-auto space-y-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
        <Users className="h-3.5 w-3.5" />
        Choose Your Expert
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Find the Right Surveyor for Your Project</h2>
      <Select value={selectedId} onValueChange={onSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a surveyor" />
        </SelectTrigger>
        <SelectContent>
          {surveyors.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={s.image} />
                  <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-bold text-foreground">{s.name}</div>
                  <div className="text-sm text-muted-foreground">{s.role}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
