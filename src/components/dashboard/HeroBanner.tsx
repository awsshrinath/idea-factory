
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const HeroBanner = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const stats = [
    { label: "Active Creators", value: "10K+", icon: Users },
    { label: "Content Generated", value: "50K+", icon: Zap },
    { label: "Growth Rate", value: "300%", icon: TrendingUp },
  ];

  return (
    <section className="mb-12 animate-fadeIn" style={{ animationDelay: "100ms" }}>
      <div className={cn(
        "premium-card premium-card-hover rounded-3xl p-8 lg:p-12",
        "bg-gradient-to-br from-indigo-900/20 via-purple-900/15 to-pink-900/10",
        "border-indigo-500/20 hover:border-indigo-400/30",
        "relative overflow-hidden group cursor-pointer",
        "transform transition-all duration-500 hover:scale-[1.01]",
        "elevation-3 hover:elevation-4"
      )}>
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Animated background elements */}
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
          <Sparkles className="h-24 w-24 text-indigo-400 animate-pulse" />
        </div>
        
        <div className={cn(
          "relative z-10 grid gap-8",
          isMobile ? "grid-cols-1 text-center" : "grid-cols-1 lg:grid-cols-2"
        )}>
          {/* Content Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge className="badge-premium px-4 py-2 text-sm font-bold">
                ✨ New Features Available
              </Badge>
              
              <h1 className={cn(
                "font-bold leading-tight tracking-tight",
                "bg-gradient-to-r from-white via-indigo-200 to-purple-200",
                "bg-clip-text text-transparent",
                isMobile ? "text-3xl" : "text-4xl lg:text-5xl"
              )}>
                Create Premium Content
                <br />
                <span className="text-indigo-300">In Seconds</span>
              </h1>
              
              <p className={cn(
                "premium-body text-lg leading-relaxed text-white/80",
                isMobile ? "text-base" : "text-lg"
              )}>
                Transform your ideas into professional content with AI-powered tools. 
                Generate posts, images, and videos that drive engagement across all platforms.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/content")}
                size="lg"
                className={cn(
                  "premium-button h-14 px-8 text-base font-semibold",
                  "bg-gradient-to-r from-indigo-600 to-purple-600",
                  "hover:shadow-xl hover:shadow-indigo-500/25",
                  "border border-indigo-500/20 hover:border-indigo-400/40",
                  "group-hover:scale-105 transition-transform duration-300"
                )}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Creating
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                onClick={() => navigate("/videos")}
                variant="outline"
                size="lg"
                className={cn(
                  "h-14 px-8 text-base font-semibold",
                  "bg-white/5 hover:bg-white/15",
                  "border-2 border-white/20 hover:border-white/40",
                  "text-white hover:text-white",
                  "backdrop-blur-sm transition-all duration-300"
                )}
              >
                Explore Videos
              </Button>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className={cn(
            "space-y-6",
            isMobile ? "mt-8" : "lg:pl-8"
          )}>
            <div className="space-y-4">
              <h3 className="premium-subheading text-xl text-indigo-200">
                Trusted by creators worldwide
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className={cn(
                        "glass-card rounded-xl p-4 text-center",
                        "hover:bg-white/[0.08] transition-all duration-300",
                        "border border-white/10 hover:border-white/20",
                        "group/stat cursor-pointer"
                      )}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                          <Icon className="h-4 w-4 text-indigo-400 group-hover/stat:scale-110 transition-transform" />
                        </div>
                      </div>
                      <div className="premium-stats text-2xl mb-1">{stat.value}</div>
                      <div className="premium-caption text-xs text-white/70">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="glass-card rounded-xl p-4 border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-green-500/5">
              <p className="premium-body text-sm flex items-center gap-3 text-emerald-300">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                </div>
                Join thousands of creators who've boosted their engagement by 300% with our AI tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
