
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/layout/sidebar";
import { LandPlot, Menu, Bell, Search, Sun, Moon, FileText, CalendarDays, Calculator, PlusCircle, LayoutDashboard, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Static Notifications Data for UI Demo
const STATIC_NOTIFICATIONS = [
  {
    id: "1",
    title: "নতুন বুকিং",
    description: "নুরুন্নবী হোসেন একটি নতুন সার্ভে বুক করেছেন।",
    date: new Date().toISOString(),
    type: "new",
    link: "#",
  },
  {
    id: "2",
    title: "মিসড অ্যাপয়েন্টমেন্ট",
    description: "আজকের সাভারের সার্ভে কালীন সময় পার হয়ে গেছে।",
    date: new Date().toISOString(),
    type: "missed",
    link: "#",
  },
];

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const isClient = false;

  const handleSelect = (href: string) => {
    setSearchOpen(false)
    router.push(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar backdrop-blur-md">
      <div className="flex h-16 items-center px-4 sm:px-8">
        {/* Brand Logo for Clients / Mobile Sidebar for Surveyors */}
        <div className="flex items-center gap-4">
          {!isClient ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Main navigation sidebar for accessing dashboard pages.
                </SheetDescription>
                <Sidebar 
                  className="flex w-full border-none" 
                  onItemClick={() => setOpen(false)}
                />
              </SheetContent>
            </Sheet>
          ) : (
            <Link href="/portal" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                <LandPlot className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight hidden md:inline-block">Smart Surveyor</span>
            </Link>
          )}
        </div>

        {/* Client Navigation Links - Centered & Styled */}
        {isClient && (
          <nav className="flex items-center bg-muted/50 p-1 rounded-xl ml-8">
            <Link 
              href="/portal" 
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                pathname === "/portal" 
                  ? "bg-background text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              ড্যাশবোর্ড
            </Link>
            <Link 
              href="/book-survey" 
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-all",
                pathname === "/book-survey" 
                  ? "bg-background text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              বুকিং করুন
            </Link>
          </nav>
        )}

        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
            {/* Static Search Bar UI */}
            {!isClient && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>

                <CommandDialog 
                  open={searchOpen} 
                  onOpenChange={setSearchOpen}
                >
                  <CommandInput 
                      placeholder="ক্লায়েন্ট, বুকিং, রিপোর্ট খুঁজুন..." 
                  />
                  <CommandList>
                    <CommandEmpty>কোনো ফলাফল পাওয়া যায়নি।</CommandEmpty>
                    <CommandSeparator />
                    <CommandGroup heading="কুইক অ্যাকশন">
                      <CommandItem onSelect={() => handleSelect('/bookings')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>নতুন বুকিং</span>
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
            )}

          <nav className="flex items-center gap-2">
            {/* Simple Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && (resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              ))}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Static Notifications UI */}
            {!isClient && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground hover:text-foreground"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <DropdownMenuLabel className="flex items-center justify-between">
                      বিজ্ঞপ্তি
                      <Badge variant="secondary" className="font-normal">২ নতুন</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-75 overflow-y-auto">
                      {STATIC_NOTIFICATIONS.map((notif) => (
                          <DropdownMenuItem 
                              key={notif.id} 
                              className="flex flex-col items-start gap-1 p-4 cursor-pointer"
                              onClick={() => handleSelect(notif.link)}
                          >
                              <div className="flex items-center gap-2 w-full">
                                  <div className={cn(
                                      "h-2 w-2 rounded-full",
                                      notif.type === 'missed' ? "bg-red-500" : "bg-blue-500"
                                  )} />
                                  <span className="font-semibold text-sm">{notif.title}</span>
                                  <span className="ml-auto text-[10px] text-muted-foreground">
                                      {format(new Date(notif.date), "MMM d")}
                                  </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                  {notif.description}
                              </p>
                          </DropdownMenuItem>
                      ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-xs text-primary font-medium cursor-pointer" onClick={() => handleSelect('/bookings')}>
                      সব বুকিং দেখুন
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>{"GH"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {"নুরুন্নবী হোসেন"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {"nurullah@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isClient ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/portal" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        পোর্টাল ড্যাশবোর্ড
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/book-survey" className="flex items-center gap-2 cursor-pointer">
                        <CalendarDays className="h-4 w-4" />
                        সার্ভে বুকিং
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/portal/settings" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" />
                        প্রোফাইল সেটিংস
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="h-4 w-4" />
                        অ্যাডমিন ড্যাশবোর্ড
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="h-4 w-4" />
                        সেটিংস
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() => console.log("Logout clicked")}
                >
                  লগ আউট
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
