import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, Zap, Target, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: Zap, text: "Lightning Fast AI" },
  { icon: Target, text: "Precision Results" },
  { icon: Rocket, text: "Enterprise Ready" }
];

const benefits = [
  "Generate stunning visuals in seconds",
  "Create engaging content for any platform",
  "Scale your creative workflow",
  "Professional-grade AI tools"
];

export function HeroBanner() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-slate-900/80 border border-white/10 rounded-2xl">
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <img
          src="/blobs/gradient-blob.svg"
          alt="Gradient Blob"
          className="w-full"
        />
      </div>

      <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center lg:items-start justify-between">
        <div className="space-y-6 lg:max-w-lg">
          <div className="space-y-2">
            <h1 className="enterprise-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Unleash the Power of AI
            </h1>
            <p className="premium-body text-lg md:text-xl">
              Supercharge your creativity with cutting-edge AI tools.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {features.map((feature) => (
              <Badge key={feature.text} variant="secondary" className="gap-2">
                <feature.icon className="h-4 w-4" />
                {feature.text}
              </Badge>
            ))}
          </div>

          <div className="space-y-2 mb-8">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center text-sm premium-body">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mr-3 flex-shrink-0"></div>
                {benefit}
              </div>
            ))}
          </div>

          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300" onClick={() => navigate('/images')}>
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="mt-8 lg:mt-0 lg:max-w-md">
          <img
            src="/hero-image.webp"
            alt="AI Interface"
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
