import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Crown, 
  Play
} from 'lucide-react';

export const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-white/[0.08] backdrop-blur-xl shadow-xl hover:shadow-2xl transform transition-all duration-500 ease-out hover:scale-[1.01] hover:-translate-y-1 animate-fadeIn">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative p-8 md:p-12">
        {/* Header with badge and title */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Badge className="badge-premium px-3 py-1 text-xs">
              <Crown className="h-3 w-3 mr-1" />
              Premium Access
            </Badge>
            <h1 className="text-4xl font-bold text-white mt-3 leading-tight tracking-tight">
              Unlock AI Superpowers
            </h1>
          </div>
          <span className="text-7xl text-purple-400/20 opacity-60 absolute top-1/2 right-6 transform -translate-y-1/2 pointer-events-none">
            <Sparkles className="h-24 w-24" />
          </span>
        </div>
        
        {/* Description and CTA */}
        <p className="text-lg text-white/70 mb-8 leading-relaxed font-medium max-w-2xl">
          Supercharge your content creation with AI. Generate stunning visuals, engaging content, and automate your social media strategy.
        </p>
        <Button className="w-full md:w-auto h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
          Start Creating
          <Play className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </section>
  );
};
