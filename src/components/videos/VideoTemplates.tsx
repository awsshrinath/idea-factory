
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  Rocket, 
  ShoppingBag, 
  PresentationChart, 
  Quote, 
  MessageSquareText
} from "lucide-react";

interface VideoTemplateProps {
  onSelect: (template: string) => void;
}

type Template = {
  id: string;
  icon: React.ReactNode;
  title: string;
  prompt: string;
};

export function VideoTemplates({ onSelect }: VideoTemplateProps) {
  const templates: Template[] = [
    {
      id: "product-teaser",
      icon: <ShoppingBag />,
      title: "Product Teaser",
      prompt: "Create a short, captivating teaser for our new product that highlights its key features and benefits.",
    },
    {
      id: "inspirational",
      icon: <Sparkles />,
      title: "Inspirational Quote",
      prompt: "Create an inspiring video with beautiful visuals and motivational quotes about perseverance and success.",
    },
    {
      id: "product-launch",
      icon: <Rocket />,
      title: "Product Launch",
      prompt: "Create an exciting product launch video that builds anticipation and showcases our new offering.",
    },
    {
      id: "explainer",
      icon: <PresentationChart />,
      title: "Explainer Video",
      prompt: "Create a clear, concise explainer video about our service that breaks down complex concepts simply.",
    },
    {
      id: "testimonial",
      icon: <Quote />,
      title: "Testimonial",
      prompt: "Create a video showcasing customer testimonials with professional styling and engaging transitions.",
    },
    {
      id: "tutorial",
      icon: <MessageSquareText />,
      title: "Tutorial",
      prompt: "Create a step-by-step tutorial video showing how to use our product's main features effectively.",
    }
  ];

  return (
    <div className="w-full mb-4">
      <label className="text-sm font-medium text-foreground block mb-2">
        Quick Templates
      </label>
      <ScrollArea className="w-full whitespace-nowrap pb-2" orientation="horizontal">
        <div className="flex gap-2">
          {templates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              size="sm"
              onClick={() => onSelect(template.prompt)}
              className="flex items-center gap-2 border-white/10 bg-muted/50 hover:border-primary/30 hover:bg-muted/80 transition-all duration-300 transform hover:scale-[1.03]"
            >
              {template.icon}
              <span>{template.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
