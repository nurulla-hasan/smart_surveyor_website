'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getPublicSurveyors } from '@/services/surveyors';
import { useSmartFilter } from '@/hooks/useSmartFilter';
import { Surveyor } from '@/types/surveyor.type';

interface SelectorSurveyor {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface SurveyorSelectorProps {
  initialSurveyors: Surveyor[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDataChange?: (data: Surveyor[]) => void;
}

export function SurveyorSelector({ initialSurveyors, selectedId, onSelect, onDataChange }: SurveyorSelectorProps) {
  const { updateFilter, getFilter } = useSmartFilter();
  
  const search = getFilter("search") || "";
  const page = parseInt(getFilter("page")) || 1;

  const [surveyors, setSurveyors] = useState<SelectorSurveyor[]>(
    initialSurveyors.map(s => ({
      id: s.id,
      name: s.name,
      role: s.role || s.companyName || "Professional Surveyor",
      image: s.profileImage || ""
    }))
  );
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSurveyors = useCallback(async (searchTerm: string, pageNum: number) => {
    setLoading(true);
    try {
      const response = await getPublicSurveyors({
        search: searchTerm,
        page: String(pageNum),
        limit: "6"
      });

      if (response?.success) {
        // Map backend data to frontend component needs
        const rawSurveyors: Surveyor[] = response.data.surveyors;
        const mappedSurveyors: SelectorSurveyor[] = rawSurveyors.map((s) => ({
          id: s.id,
          name: s.name,
          role: s.role || s.companyName || "Professional Surveyor",
          image: s.profileImage || ""
        }));
        
        setSurveyors(mappedSurveyors);
        setTotalPages(response.data.meta.totalPages);
        
        // Notify parent about raw data change for Profile view
        if (onDataChange) {
          onDataChange(rawSurveyors);
        }
      }
    } catch (error) {
      console.error("Failed to fetch surveyors:", error);
    } finally {
      setLoading(false);
    }
  }, [onDataChange]);

  // Handle search and page changes from URL
  useEffect(() => {
    fetchSurveyors(search, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  // Handle input change with debounce from useSmartFilter
  const handleSearchChange = (value: string) => {
    updateFilter("search", value, 500);
  };

  // Handle page change using useSmartFilter
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateFilter("page", newPage);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
        <Users className="h-3.5 w-3.5" />
        Choose Your Expert
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Find the Right Surveyor for Your Project</h2>
      
      <div className="relative group max-w-md mx-auto">
        <Input 
          placeholder="Search by name, company or bio..." 
          className="pl-12 h-12 rounded-2xl border-border/50 focus:ring-primary/20 bg-background/50 backdrop-blur-sm"
          defaultValue={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary/80 group-focus-within:text-primary transition-all">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mt-6">
        {surveyors.length > 0 ? (
          surveyors.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`flex items-center gap-4 p-3 pr-6 rounded-2xl border transition-all text-left w-fit min-w-50 ${
                selectedId === s.id 
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                  : 'border-border/50 hover:border-primary/30 hover:bg-muted/30'
              }`}
            >
              <Avatar className="h-10 w-10 border-2 border-background">
                <AvatarImage src={s.image || undefined} />
                <AvatarFallback>{s.name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <div className="font-bold text-sm text-foreground truncate">{s.name}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold truncate">{s.role}</div>
              </div>
              {selectedId === s.id && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          ))
        ) : !loading && (
          <div className="col-span-full py-8 text-muted-foreground text-sm font-medium italic">
            No surveyors found matching &quot;{search}&quot;
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={page === 1 || loading}
            onClick={() => handlePageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={page === totalPages || loading}
            onClick={() => handlePageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
