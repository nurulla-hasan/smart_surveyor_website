/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon, LayoutDashboard, Settings, CalendarDays } from "lucide-react";
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
import { logOut, getCurrentUser } from "@/services/auth";
import { HeaderSearch } from "./header-search";
import { HeaderNotifications } from "./header-notifications";

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const fetchData = async () => {
      const user = await getCurrentUser();
      setUserData(user);
    };
    fetchData();
  }, []);

  const isClientRole = userData?.role === "client";

  const handleLogout = async () => {
    await logOut();
    router.refresh();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar backdrop-blur-md">
      <div className="flex h-16 items-center px-4 sm:px-8">
        {/* Client Navigation Links - Centered & Styled */}
        {mounted && isClientRole && (
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
          {/* Search Bar UI */}
          <HeaderSearch />

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

            {/* Notifications UI */}
            <HeaderNotifications />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 border cursor-pointer">
                  <AvatarImage src={userData?.profileImage} alt={userData?.name} />
                  <AvatarFallback className="font-bold uppercase tracking-tighter">
                    {userData?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black leading-none uppercase tracking-tighter">
                      {userData?.name || "Loading..."}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mounted && isClientRole ? (
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
                  onClick={handleLogout}
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
