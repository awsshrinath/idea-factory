
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Image,
  Video,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: FileText, label: "Content", path: "/content" },
  { icon: Image, label: "Images", path: "/images" },
  { icon: Video, label: "Videos", path: "/videos" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      {/* Mobile menu button - fixed position */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm rounded-full shadow-md"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      )}

      {/* Desktop sidebar */}
      <div
        className={cn(
          "h-screen fixed left-0 top-0 z-40 flex flex-col glass border-r border-border transition-all duration-300",
          isMobile 
            ? mobileOpen 
              ? "translate-x-0 opacity-100 w-64" 
              : "-translate-x-full opacity-0 w-0"
            : collapsed 
              ? "w-16" 
              : "w-64",
          "bg-background/90 backdrop-blur-md",
        )}
      >
        <div className="flex items-center justify-between p-4">
          {!(collapsed && !isMobile) && (
            <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate">
              Content AI
            </h1>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={toggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => isMobile && setMobileOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  {!(collapsed && !isMobile) && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile overlay backdrop */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
