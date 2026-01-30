/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface SearchableOption {
  value: string;
  label: string;
  original?: any;
}

interface SearchableSelectProps {
  onSelect: (value: string, original?: any) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  fetchOptions: (search: string) => Promise<SearchableOption[]>;
  defaultValue?: string;
  defaultLabel?: string;
  className?: string;
}

export function SearchableSelect({
  onSelect,
  placeholder = "নির্বাচন করুন...",
  searchPlaceholder = "খুঁজুন...",
  emptyMessage = "কোনো ফলাফল পাওয়া যায়নি।",
  fetchOptions,
  defaultValue = "",
  defaultLabel = "",
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [label, setLabel] = React.useState(defaultLabel);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [options, setOptions] = React.useState<SearchableOption[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Sync internal value and label with props
  React.useEffect(() => {
    setValue(defaultValue);
    if (defaultLabel) {
      setLabel(defaultLabel);
    } else if (defaultValue === "") {
      setLabel("");
    } else if (options.length > 0) {
      const selectedOption = options.find((opt) => opt.value === defaultValue);
      if (selectedOption) {
        setLabel(selectedOption.label);
      }
    }
  }, [defaultValue, defaultLabel, options]);

  // Fetch options with debounce
  React.useEffect(() => {
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchOptions(searchTerm);
        setOptions(results);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, fetchOptions]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
        >
          {label || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={searchPlaceholder} 
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        setValue(option.value);
                        setLabel(option.label);
                        onSelect(option.value, option.original);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
