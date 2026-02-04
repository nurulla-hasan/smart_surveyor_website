/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Search, CalendarDays, User, PlusCircle, FileText, Calculator } from "lucide-react";
import { getBookings } from "@/services/bookings";
import { getClients } from "@/services/clients";
import { getReports } from "@/services/reports";

export function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<{ 
    bookings: any[], 
    clients: any[],
    reports: any[] 
  }>({ bookings: [], clients: [], reports: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 2) {
        setIsSearching(true);
        setHasSearched(false);
        try {
          // Add filter=all to bookings search to search across all tabs
          const [bookingsRes, clientsRes, reportsRes] = await Promise.all([
            getBookings({ search: searchTerm, filter: 'all' }),
            getClients({ search: searchTerm }),
            getReports({ search: searchTerm })
          ]);
          setSearchResults({
            bookings: bookingsRes?.data?.bookings || [],
            clients: clientsRes?.data?.clients || [],
            reports: reportsRes?.data?.reports || []
          });
          setHasSearched(true);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ bookings: [], clients: [], reports: [] });
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Close search when route changes (optional, but good UX if using Link, here we use router.push)
  // Actually we handle closing in handleSelect.

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  // Keyboard shortcut to open search (Ctrl+K or Cmd+K) - Optional but common
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Search className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Search clients, bookings, reports..."
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          {isSearching && (
            <div className="p-4 text-center text-sm text-muted-foreground italic">
              Searching...
            </div>
          )}
          
          {!isSearching && hasSearched && searchTerm.length > 2 && searchResults.bookings.length === 0 && searchResults.clients.length === 0 && searchResults.reports.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No results found for &quot;{searchTerm}&quot;.</p>
              <p className="text-xs text-muted-foreground mt-1">Try searching with another name or phone number.</p>
            </div>
          )}
          
          {searchResults.bookings.length > 0 && (
            <CommandGroup heading="Bookings (List)">
              {searchResults.bookings.map((booking: any) => (
                <CommandItem 
                  key={booking.id} 
                  onSelect={() => handleSelect(`/bookings?tab=${booking.status === 'scheduled' ? 'upcoming' : booking.status === 'cancelled' ? 'past' : 'pending'}`)}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.clientName || booking.client?.name || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">{booking.propertyAddress || booking.location || 'N/A'}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchResults.clients.length > 0 && (
            <CommandGroup heading="Clients (List)">
              {searchResults.clients.map((client: any) => (
                <CommandItem key={client.id} onSelect={() => handleSelect(`/clients`)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{client.name} - {client.phone}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchResults.reports.length > 0 && (
            <CommandGroup heading="Reports (List)">
              {searchResults.reports.map((report: any) => (
                <CommandItem key={report.id} onSelect={() => handleSelect(`/reports`)}>
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{report.title}</span>
                    <span className="text-xs text-muted-foreground">{report.client?.name || 'N/A'} - {report.mouzaName || 'N/A'}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleSelect('/bookings')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>New Booking</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('/reports/new')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>নতুন রিপোর্ট</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('/calculator')}>
              <Calculator className="mr-2 h-4 w-4" />
              <span>ল্যান্ড ক্যালকুলেটর</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
