
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lightbulb, Sparkles, Target, Zap } from "lucide-react";
import { useState } from "react";

const tips = [
  {
    title: "Optimal Posting Times",
    description: "Post between 9-11 AM and 7-9 PM for maximum engagement. Your audience is most active during these windows.",
    icon: Target,
    gradient: "from-emerald-900/30 to-green-900/20",
    iconBg: "bg-gradient-to-br from-emerald-600/20 to-green-600/20",
    borderColor: "border-emerald-500/20",
    category: "Strategy",
  },
  {
    title: "Visual Content Impact",
    description: "Posts with high-quality visuals get 94% more views. Use AI-generated images to boost your engagement rates.",
    icon: Sparkles,
    gradient: "from-purple-900/30 to-violet-900/20",
    iconBg: "bg-gradient-to-br from-purple-600/20 to-violet-600/20",
    borderColor: "border-purple-500/20",
    category: "Content",
  },
  {
    title: "Hashtag Optimization",
    description: "Use 5-10 relevant hashtags per post. Mix popular and niche tags for better discoverability and reach.",
    icon: Zap,
    gradient: "from-blue-900/30 to-indigo-900/20",
    iconBg: "bg-gradient-to-br from-blue-600/20 to-indigo-600/20",
    borderColor: "border-blue-500/20",
    category: "Growth",
  },
  {
    title: "Engagement Strategy",
    description: "Respond to comments within 2 hours to boost your content's algorithm performance and build community.",
    icon: Lightbulb,
    gradient: "from-amber-900/30 to-orange-900/20",
    iconBg: "bg-gradient-to-br from-amber-600/20 to-orange-600/20",
    borderColor: "border-amber-500/20",
    category: "Community",
  },
];

export const TipsCarousel = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const tip = tips[currentTip];
  const Icon = tip.icon;

  return (
    <section className="mb-12 animate-fadeIn" style={{ animationDelay: "800ms" }}>
      <div className="flex items-center gap-3 mb-8">
        <h2 className="enterprise-heading text-3xl">Pro Tips</h2>
        <Lightbulb className="h-6 w-6 text-amber-400 animate-pulse" />
      </div>
      
      <Card className={`
        premium-card premium-card-hover relative overflow-hidden
        bg-gradient-to-br from-white/[0.04] to-white/[0.01] ${tip.gradient}
        ${tip.borderColor} hover:border-white/[0.15]
        transform transition-all duration-500 ease-out
        hover:scale-[1.01] elevation-2 hover:elevation-3
      `}>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            {/* Icon Section */}
            <div className={`
              h-16 w-16 rounded-xl ${tip.iconBg} 
              flex items-center justify-center ${tip.borderColor}
              shadow-lg border transform transition-all duration-300
              hover:scale-110 hover:rotate-3 flex-shrink-0
            `}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            
            {/* Content Section */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="premium-subheading text-xl">{tip.title}</h3>
                    <span className="premium-badge bg-white/10 text-white/80 border-white/20 text-xs">
                      {tip.category}
                    </span>
                  </div>
                  <p className="premium-body text-base leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  {tips.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTip(index)}
                      className={`
                        h-2 w-8 rounded-full transition-all duration-300
                        ${index === currentTip 
                          ? 'bg-white/60 shadow-sm' 
                          : 'bg-white/20 hover:bg-white/30'
                        }
                      `}
                    />
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={prevTip}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={nextTip}
                    size="sm"
                    variant="ghost"
                    className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
