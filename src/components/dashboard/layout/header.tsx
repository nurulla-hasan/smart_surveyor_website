/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { getInitials } from "@/lib/utils";
import { logOut, getCurrentUser } from "@/services/auth";
import { HeaderSearch } from "./header-search";
import { HeaderNotifications } from "./header-notifications";

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const fetchData = async () => {
      const user = await getCurrentUser();
      setUserData(user);
    };
    fetchData();

    // Listen for custom profile update event
    const handleProfileUpdate = () => {
      fetchData();
    };

    window.addEventListener("profile-updated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profile-updated", handleProfileUpdate);
  }, []);

  const handleLogout = async () => {
    await logOut();
    router.refresh();
    router.push("/home");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar backdrop-blur-md">
      <div className="flex h-16 items-center px-4 sm:px-8">
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
              {mounted &&
                (resolvedTheme === "dark" ? (
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
                  <AvatarImage
                    src={userData?.profileImage}
                    alt={userData?.name}
                  />
                  <AvatarFallback className="font-bold uppercase tracking-tighter">
                    {getInitials(userData?.name) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black leading-none">
                      {userData?.name || "Loading..."}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
