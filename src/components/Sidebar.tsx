
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const location = useLocation();

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
      if (!mobileOpen) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
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
          className="fixed top-4 left-4 z-50 bg-slate-800/80 backdrop-blur-sm rounded-full shadow-md h-10 w-10 flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-lg border border-slate-700/50"
        >
          {mobileOpen ? <X className="h-5 w-5 text-slate-200" /> : <Menu className="h-5 w-5 text-slate-200" />}
        </Button>
      )}

      {/* Desktop sidebar */}
      <div
        className={cn(
          "h-screen fixed left-0 top-0 z-40 flex flex-col glass border-r border-slate-700/60 transition-all duration-300",
          isMobile 
            ? mobileOpen 
              ? "translate-x-0 opacity-100 w-64" 
              : "-translate-x-full opacity-0 w-0"
            : collapsed 
              ? "w-16" 
              : "w-64",
          "bg-slate-900/90 backdrop-blur-md",
        )}
      >
        <div className="flex items-center justify-between p-6">
          {!(collapsed && !isMobile) && (
            <h1 className="text-xl font-heading font-black bg-gradient-to-r from-slate-300 to-indigo-400 bg-clip-text text-transparent truncate">
              Content AI
            </h1>
          )}
          {!isMobile && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto hover:scale-110 transition-all duration-300 hover:bg-slate-700/50 rounded-xl text-slate-300 hover:text-slate-100"
                    onClick={toggleSidebar}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{collapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 relative group",
                            isMobile && "py-4",
                            isActive 
                              ? "bg-slate-700/50 text-indigo-400 border-l-4 border-indigo-500 shadow-lg shadow-indigo-500/20" 
                              : "hover:bg-slate-700/30 hover:scale-105 hover:shadow-md hover:border hover:border-slate-600/40 text-slate-300 hover:text-slate-100"
                          )}
                          onClick={() => isMobile && setMobileOpen(false)}
                        >
                          <item.icon className={cn(
                            "h-5 w-5 transition-all duration-300",
                            isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200",
                            "group-hover:scale-110"
                          )} />
                          {!(collapsed && !isMobile) && (
                            <span className={cn(
                              "text-sm font-semibold transition-colors duration-300",
                              isActive ? "text-indigo-400" : "group-hover:text-slate-100"
                            )}>
                              {item.label}
                            </span>
                          )}
                          {isActive && (
                            <div className="absolute right-2 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                          )}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && !isMobile && (
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile overlay backdrop */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-30 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
          onClick={() => {
            setMobileOpen(false);
            document.body.classList.remove('sidebar-open');
          }}
        />
      )}
    </>
  );
}
