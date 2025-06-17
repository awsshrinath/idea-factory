
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Video, Instagram, Youtube } from "lucide-react";

type AspectRatioOption = {
  id: string;
  label: string;
  ratio: string;
  icon: React.ReactNode;
};

interface AspectRatioSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  const options: AspectRatioOption[] = [
    {
      id: "16:9",
      label: "YouTube (16:9)",
      ratio: "16:9",
      icon: <Youtube className="w-4 h-4" />,
    },
    {
      id: "9:16",
      label: "Reels (9:16)",
      ratio: "9:16",
      icon: <Instagram className="w-4 h-4" />,
    },
    {
      id: "1:1",
      label: "Square (1:1)",
      ratio: "1:1",
      icon: <Video className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => (
        <Button
          key={option.id}
          variant={value === option.id ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(option.id)}
          className={cn(
            "flex items-center gap-2 transition-all",
            value === option.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          {option.icon}
          <span>{option.label}</span>
        </Button>
      ))}
    </div>
  );
}
