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
} from "lucide-react";

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

  return (
    <div
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col glass border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Content AI
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <item.icon className="h-5 w-5 text-muted-foreground" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}