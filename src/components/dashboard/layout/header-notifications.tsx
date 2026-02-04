/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getNotifications, markAsRead, markAllAsRead, clearAllNotifications } from "@/services/notifications";

export function HeaderNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const fetchNotifications = async () => {
      const res = await getNotifications();
      if (res?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const res = await markAsRead(id);
    if (res?.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead();
    if (res?.success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const handleClearAll = async () => {
    const res = await clearAllNotifications();
    if (res?.success) {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = (notif: any) => {
    if (!notif.isRead) handleMarkAsRead(notif.id);
    
    // Determine link (backend might not have it for old notifications)
    let targetLink = notif.link;
    if (!targetLink) {
      if (notif.type === 'NEW_BOOKING' || notif.type === 'STATUS_UPDATE') {
        targetLink = '/bookings'; // Fallback to bookings list
      }
    }
    
    if (targetLink) {
      router.push(targetLink);
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative text-muted-foreground hover:text-foreground"
        disabled
      >
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unreadCount > 0 && (
            <Badge variant="secondary" className="font-normal">{unreadCount} new</Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-75 overflow-y-auto p-1 space-y-2">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications.
            </div>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 cursor-pointer rounded-md transition-colors",
                  !notif.isRead ? "bg-accent/50" : "hover:bg-accent"
                )}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    notif.isRead ? "bg-transparent" : "bg-primary"
                  )} />
                  <span className="font-semibold text-sm">{notif.title}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {format(new Date(notif.createdAt), "MMM d")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {notif.message}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="flex flex-col">
          {unreadCount > 0 && (
            <DropdownMenuItem 
              className="justify-center text-xs text-primary font-medium cursor-pointer" 
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </DropdownMenuItem>
          )}
          {notifications.length > 0 && (
            <DropdownMenuItem 
              className="justify-center text-xs text-destructive font-medium cursor-pointer" 
              onClick={handleClearAll}
            >
              Clear all
            </DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
