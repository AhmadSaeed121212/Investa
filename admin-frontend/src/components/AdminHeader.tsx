import { useState } from "react";
import { Bell, Menu, Search, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  title?: string;
}

export function AdminHeader({ onToggleSidebar, title = "Dashboard" }: AdminHeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [openNotifications, setOpenNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Example notification data (replace with real data later)
  const notifications = [
    { id: 1, message: "New deposit request #DEP128", time: "2 min ago" },
    { id: 2, message: "Withdrawal WTH045 approved", time: "14 min ago" },
    { id: 3, message: "User USR019 banned", time: "1 hour ago" },
    { id: 4, message: "System backup completed", time: "3 hours ago" },
    { id: 5, message: "New user registered", time: "yesterday" },
  ];

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search bar - hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-48"
          />
        </div>

        {/* Notification Bell with Popover */}
        <Popover open={openNotifications} onOpenChange={setOpenNotifications}>
          <PopoverTrigger asChild>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center text-destructive-foreground">
                {notifications.length}
              </span>
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-80 sm:w-96 p-0"
          >
            <div className="border-b px-4 py-3 bg-muted/40">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-base">Notifications</h4>
                <span className="text-xs text-muted-foreground">
                  {notifications.length} new
                </span>
              </div>
            </div>

            <div className="max-h-[340px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-3 border-t bg-muted/30 text-center">
              <button className="text-sm text-primary hover:underline">
                View all notifications
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          title="Logout"
        >
          <LogOut className="w-5 h-5 sm:mr-2" />
          <span className="hidden sm:inline text-sm">Logout</span>
        </Button>
      </div>
    </header>
  );
}