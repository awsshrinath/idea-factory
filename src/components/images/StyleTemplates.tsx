import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface TemplateItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prompt: string;
  style: string;
}

// Sample templates - ideally these would come from an API or database
const templates: TemplateItem[] = [
  {
    id: "template-1",
    title: "Futuristic Robot",
    description: "A sleek robot with futuristic design elements in a cyberpunk city",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80",
    prompt: "A sleek humanoid robot with glowing blue eyes and chrome body standing in a neon-lit cyberpunk city street with tall skyscrapers and flying cars",
    style: "cyberpunk"
  },
  {
    id: "template-2",
    title: "Fantasy Landscape",
    description: "Magical floating islands with waterfalls and rainbow bridges",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=500&q=80",
    prompt: "Magical floating islands with cascading waterfalls, connected by shimmering rainbow bridges, surrounded by fluffy clouds and flying creatures",
    style: "realistic"
  },
  {
    id: "template-3",
    title: "Anime Character",
    description: "Stylized anime character with distinctive features",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80",
    prompt: "Young anime warrior with spiky blue hair, wearing a futuristic battle armor with glowing elements, holding an energy sword, dynamic pose",
    style: "anime"
  },
  {
    id: "template-4",
    title: "Abstract Art",
    description: "Colorful abstract art composition with geometric shapes",
    imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a5a84282?w=500&q=80",
    prompt: "Vibrant abstract composition with fluid shapes in primary colors, geometric patterns and splashes, digital art style with clean lines",
    style: "3d"
  },
  {
    id: "template-5",
    title: "Cute Animal",
    description: "Adorable animal character in watercolor style",
    imageUrl: "https://images.unsplash.com/photo-1567032715385-e1f4a4416610?w=500&q=80",
    prompt: "Adorable fluffy fox with big expressive eyes sitting in a blooming meadow with butterflies and wildflowers, watercolor painting style",
    style: "watercolor"
  },
  {
    id: "template-6",
    title: "Urban Sketch",
    description: "Hand-drawn urban scene with detailed architecture",
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=500&q=80",
    prompt: "Detailed pencil sketch of a busy city street corner with old European architecture, people walking, small shops with awnings, street lamps",
    style: "sketch"
  }
];

interface StyleTemplatesProps {
  onSelectTemplate?: (template: TemplateItem) => void;
}

export function StyleTemplates({ onSelectTemplate }: StyleTemplatesProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTemplateClick = (template: TemplateItem) => {
    // If there's an external handler, use it
    if (onSelectTemplate) {
      onSelectTemplate(template);
      return;
    }

    // Otherwise, dispatch a custom event that ImageGenerationForm will listen for
    window.dispatchEvent(new CustomEvent('template-selected', { 
      detail: { 
        prompt: template.prompt,
        style: template.style
      }
    }));
    
    toast({
      title: "Template Applied",
      description: `"${template.title}" template has been applied.`,
    });
  };

  return (
    <div className="w-full mb-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">Visual Prompt Templates</h2>
        <p className="text-xs text-muted-foreground">Click to apply template</p>
      </div>
      
      <ScrollArea className="pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "overflow-hidden cursor-pointer border border-white/10 transition-all duration-300 bg-muted/10",
                "hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:border-white/30 hover:scale-[1.02]",
              )}
              onClick={() => handleTemplateClick(template)}
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={template.imageUrl}
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
                {hoveredId === template.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-3 text-center animate-fadeIn">
                    <p className="text-xs text-white leading-tight">
                      {template.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-2 bg-black/40">
                <p className="text-sm font-medium truncate">{template.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
