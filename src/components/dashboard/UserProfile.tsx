
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Settings, User, LogOut, Crown, ChevronDown } from "lucide-react";

export const UserProfile = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 h-auto py-2 px-3 hover:bg-slate-700/30 transition-all duration-300 group rounded-xl border border-slate-700/40 hover:border-slate-600/60"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-indigo-500/30 group-hover:ring-indigo-400/50 transition-all duration-300">
              <AvatarImage src="/placeholder.svg" alt="User Avatar" />
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-semibold">
                AC
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-200">Alex Creator</span>
                <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs px-2 py-0.5 border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              </div>
              <span className="text-xs text-slate-400">alex@creator.dev</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-200 transition-colors" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-slate-800/95 border-slate-700/60 backdrop-blur-sm shadow-xl"
      >
        <div className="p-3 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg" alt="User Avatar" />
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-semibold">
                AC
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">Alex Creator</span>
                <Badge className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs px-2 py-0.5 border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              </div>
              <span className="text-xs text-slate-400">alex@creator.dev</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-8/12 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                </div>
                <span className="text-xs text-slate-400">8/10 tokens used</span>
              </div>
            </div>
          </div>
        </div>
        
        <DropdownMenuItem className="hover:bg-slate-700/50 transition-colors cursor-pointer">
          <User className="h-4 w-4 mr-2" />
          Profile Settings
        </DropdownMenuItem>
        
        <DropdownMenuItem className="hover:bg-slate-700/50 transition-colors cursor-pointer">
          <Settings className="h-4 w-4 mr-2" />
          Preferences
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-slate-700/50" />
        
        <DropdownMenuItem className="hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
