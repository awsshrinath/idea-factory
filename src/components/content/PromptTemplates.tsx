import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { FileText, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateItem {
  id: string;
  title: string;
  prompt: string;
  icon: string;
  color: string;
}

const templates: TemplateItem[] = [
  {
    id: "product-launch",
    title: "Product Launch",
    icon: "🚀",
    color: "from-blue-500 to-purple-500",
    prompt: "Announce the launch of [product name], a new [product type] that helps [target audience] solve [problem]. Highlight key features like [feature 1], [feature 2], and how it compares to alternatives. Include a call to action for early access or demos."
  },
  {
    id: "thought-leadership",
    title: "Thought Leadership",
    icon: "💡",
    color: "from-amber-400 to-orange-500",
    prompt: "Share insights on the future of [industry] and how [emerging trend] is transforming the way we [key activity]. Discuss the challenges of [common problem] and offer a unique perspective on how [solution approach] can create new opportunities."
  },
  {
    id: "motivational",
    title: "Motivational",
    icon: "✨",
    color: "from-pink-500 to-rose-500",
    prompt: "Create an inspirational post about [topic] that encourages [target audience] to overcome [challenge]. Include a memorable quote and personal reflection on why this message matters in today's professional environment."
  },
  {
    id: "announcement",
    title: "Announcement",
    icon: "📢",
    color: "from-emerald-400 to-cyan-500",
    prompt: "Share exciting news about [event/milestone] happening on [date]. Explain why this matters to [audience] and how it relates to [industry trend]. Invite people to [specific action] and mention any special details they should know."
  },
  {
    id: "industry-tips",
    title: "Industry Tips",
    icon: "📋",
    color: "from-indigo-400 to-blue-500",
    prompt: "Share 5 practical tips for professionals in [industry] looking to improve their [skill/area]. For each tip, provide a brief explanation and an actionable takeaway that readers can implement immediately."
  },
  {
    id: "case-study",
    title: "Case Study",
    icon: "📊",
    color: "from-violet-500 to-purple-600",
    prompt: "Present a case study of how [company/individual] achieved [specific result] by implementing [strategy/solution]. Outline the challenge, approach, implementation, and results with specific metrics. Conclude with lessons learned and recommendations."
  }
];

interface PromptTemplatesProps {
  onSelectTemplate: (template: TemplateItem) => void;
}

export function PromptTemplates({ onSelectTemplate }: PromptTemplatesProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [scrollPosition, setScrollPosition] = useState(0);
  const maxScroll = templates.length * 180 - (isMobile ? 320 : 900);

  const scrollLeft = () => {
    const newPosition = Math.max(0, scrollPosition - 400);
    setScrollPosition(newPosition);
    const scrollContainer = document.getElementById('templates-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollLeft = newPosition;
    }
  };

  const scrollRight = () => {
    const newPosition = Math.min(maxScroll, scrollPosition + 400);
    setScrollPosition(newPosition);
    const scrollContainer = document.getElementById('templates-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollLeft = newPosition;
    }
  };

  return (
    <div className="w-full mb-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h2 className="font-semibold font-heading text-foreground">Prompt Templates</h2>
        </div>
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={scrollLeft} 
              disabled={scrollPosition <= 0}
              className="h-7 w-7 rounded-full hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={scrollRight} 
              disabled={scrollPosition >= maxScroll}
              className="h-7 w-7 rounded-full hover:bg-background"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
      
      <ScrollArea 
        id="templates-scroll-container"
        className="w-full pb-2"
      >
        <div className="flex gap-2 min-w-max p-1">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "overflow-hidden cursor-pointer min-w-[160px] max-w-[160px]",
                "transition-all duration-300 border-white/5",
                "hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
                "hover:border-white/20 hover:scale-[1.02]",
                "hover:ring-1 hover:ring-white/10"
              )}
              onClick={() => onSelectTemplate(template)}
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={cn(
                "p-3 flex flex-col gap-2 h-full",
                `bg-template-${template.id.split('-')[0]}`,
                "opacity-80 hover:opacity-100 transition-opacity"
              )}>
                <div className="flex justify-between items-center">
                  <span className="text-2xl">{template.icon}</span>
                  <span className="text-xs font-medium px-2 py-0.5 bg-black/20 rounded-full text-white/90">
                    Template
                  </span>
                </div>
                <h3 className="text-base font-medium text-white mt-1">{template.title}</h3>
                <p className="text-xs text-white/80 line-clamp-3">
                  {template.prompt.substring(0, 120)}...
                </p>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
