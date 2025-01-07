import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paintbrush, ImageIcon, Wand2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  prompt: z.string().min(1, "Please enter a prompt"),
  style: z.string().min(1, "Please select a style"),
  aspectRatio: z.string().min(1, "Please select an aspect ratio"),
});

const styles = [
  { value: "realistic", label: "Realistic", gradient: "bg-gradient-primary" },
  { value: "artistic", label: "Artistic", gradient: "bg-gradient-creative" },
  { value: "cartoon", label: "Cartoon", gradient: "bg-gradient-casual" },
  { value: "3d", label: "3D Render", gradient: "bg-gradient-friendly" },
];

const aspectRatios = [
  { value: "1:1", label: "Square (1:1)" },
  { value: "16:9", label: "Landscape (16:9)" },
  { value: "9:16", label: "Portrait (9:16)" },
  { value: "4:3", label: "Classic (4:3)" },
];

export function ImageGenerationForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      style: "",
      aspectRatio: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      console.log(values);
      toast({
        title: "Image generation started",
        description: "Your image will be ready soon.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate image. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Prompt</FormLabel>
              <FormControl>
                <Input
                  placeholder="Describe the image you want to generate..."
                  className="bg-background border-white/10 focus:border-primary transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Style</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background border-white/10 focus:border-primary transition-colors">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {styles.map((style) => (
                      <SelectItem 
                        key={style.value} 
                        value={style.value}
                        className={`${style.gradient} text-foreground hover:shadow-glow transition-all duration-300`}
                      >
                        <div className="flex items-center gap-2">
                          <Paintbrush className="h-4 w-4" />
                          {style.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aspectRatio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Aspect Ratio</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background border-white/10 focus:border-primary transition-colors">
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {aspectRatios.map((ratio) => (
                      <SelectItem key={ratio.value} value={ratio.value}>
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          {ratio.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-secondary hover:bg-gradient-primary shadow-glow hover:shadow-card-hover transition-all duration-300 group"
          disabled={isGenerating}
        >
          <Wand2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
          {isGenerating ? "Generating..." : "Generate Image"}
        </Button>
      </form>
    </Form>
  );
}