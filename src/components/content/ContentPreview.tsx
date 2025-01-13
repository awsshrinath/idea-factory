import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, ArrowUp, Save, Send, Clock, Edit2 } from "lucide-react";
import { ContentFormData } from "@/pages/Content";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ContentPreviewProps {
  formData: ContentFormData;
}

export function ContentPreview({ formData }: ContentPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(formData.description);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (previewRef.current) {
        const scrollTop = previewRef.current.scrollTop;
        setShowScrollButton(scrollTop > 100);
      }
    };

    const previewElement = previewRef.current;
    if (previewElement) {
      previewElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (previewElement) {
        previewElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    let observer: ResizeObserver | null = null;
    let animationFrameId: number | null = null;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        entries.forEach(() => {
          // Handle resize if needed in the future
        });
      });
    };

    if (previewRef.current) {
      observer = new ResizeObserver((entries) => {
        handleResize(entries);
      });
      
      observer.observe(previewRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (previewRef.current) {
      previewRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const saveAsDraft = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save content",
      });
      return;
    }

    if (!formData.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add some content before saving",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Simulate a delay for testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Insert dummy data
      const { data: contentData, error: contentError } = await supabase
        .from('generated_content')
        .insert([{
          description: formData.description,
          platform: formData.platforms,
          tone: formData.tone,
          language: formData.language,
          ai_model: formData.aiModel,
          status: 'draft',
          version: 1,
          user_id: userId,
          generated_text: `[DRAFT] Generated content for ${formData.platforms.join(', ')}`,
          hashtags: ['#test', '#draft', '#demo']
        }])
        .select()
        .single();

      if (contentError) {
        console.error('Content Error:', contentError);
        throw contentError;
      }

      // Log dummy activity
      await supabase
        .from('recent_activity')
        .insert([{
          user_id: userId,
          activity_type: 'content_draft',
          details: {
            content_id: contentData?.id,
            platforms: formData.platforms,
            action: 'saved_draft',
            test_mode: true
          }
        }]);

      toast({
        title: "Success",
        description: "Content saved as draft. This is a test version.",
      });

      // Navigate to home after successful save
      navigate("/");

    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save draft. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const publishNow = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to publish content",
      });
      return;
    }

    if (!formData.description) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add some content before publishing",
      });
      return;
    }

    if (formData.platforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one platform to publish to",
      });
      return;
    }

    try {
      setIsPublishing(true);
      
      // Simulate a delay for testing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Insert dummy published content
      const { data: contentData, error: contentError } = await supabase
        .from('generated_content')
        .insert([{
          description: formData.description,
          platform: formData.platforms,
          tone: formData.tone,
          language: formData.language,
          ai_model: formData.aiModel,
          status: 'published',
          version: 1,
          user_id: userId,
          generated_text: `[TEST] Published content for ${formData.platforms.join(', ')}`,
          hashtags: ['#published', '#test', '#demo'],
          seo_score: Math.random() * 100 // Random SEO score for testing
        }])
        .select()
        .single();

      if (contentError) {
        console.error('Content Error:', contentError);
        throw contentError;
      }

      // Log dummy activity
      await supabase
        .from('recent_activity')
        .insert([{
          user_id: userId,
          activity_type: 'content_published',
          details: {
            content_id: contentData?.id,
            platforms: formData.platforms,
            action: 'published',
            test_mode: true
          }
        }]);

      // Update test metrics
      await supabase
        .from('user_metrics')
        .upsert({
          user_id: userId,
          total_content: 1,
          engagement_rate: Math.random() * 100,
          top_content: {
            recent_post: contentData?.id,
            performance: 'Test Performance'
          }
        });

      toast({
        title: "Success",
        description: `Test publish successful! Content would be posted to: ${formData.platforms.join(', ')}`,
      });

      // Navigate to home after successful publish
      navigate("/");

    } catch (error) {
      console.error('Error publishing:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish content. Please try again.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const schedulePost = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to schedule posts",
      });
      return;
    }

    try {
      setIsScheduling(true);
      const { error: scheduledError } = await supabase
        .from('scheduled_posts')
        .insert({
          content: formData.description,
          platform: formData.platforms,
          scheduled_date: scheduledDate,
          user_id: userId
        });

      if (scheduledError) throw scheduledError;

      toast({
        title: "Success",
        description: "Post scheduled successfully",
      });
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule post",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const getPreviewContent = () => {
    if (!formData.description) {
      return "Your content preview will appear here...";
    }
    return isEditing ? editedContent : formData.description;
  };

  const getCharacterLimit = (platform: string) => {
    switch (platform) {
      case "twitter":
        return 280;
      case "linkedin":
        return 3000;
      case "facebook":
        return 2000;
      default:
        return Infinity;
    }
  };

  const getPlatformPreview = (platform: string, content: string) => {
    const commonClasses = "p-6 rounded-lg border transition-all duration-300 hover:shadow-xl group relative";
    
    switch (platform) {
      case "linkedin":
        return (
          <div className={cn(
            commonClasses,
            "border-[#0077B5]/20 bg-white/5 hover:border-[#0077B5]/50"
          )}>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-foreground">John Doe</h4>
                <p className="text-sm text-muted-foreground">Marketing Director • 2nd</p>
              </div>
            </div>
            <div 
              className={cn(
                "prose prose-invert max-w-none",
                isEditing ? "border border-dashed border-primary/50 p-2 rounded" : ""
              )}
              contentEditable={isEditing}
              onBlur={(e) => setEditedContent(e.currentTarget.textContent || "")}
              suppressContentEditableWarning
            >
              {content}
            </div>
          </div>
        );
      
      case "twitter":
        return (
          <div className={cn(
            commonClasses,
            "border-[#1DA1F2]/20 bg-white/5 hover:border-[#1DA1F2]/50"
          )}>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-foreground">John Doe</h4>
                <p className="text-sm text-muted-foreground">@johndoe</p>
              </div>
            </div>
            <div 
              className={cn(
                "prose prose-invert max-w-none",
                isEditing ? "border border-dashed border-primary/50 p-2 rounded" : ""
              )}
              contentEditable={isEditing}
              onBlur={(e) => setEditedContent(e.currentTarget.textContent || "")}
              suppressContentEditableWarning
            >
              {content}
            </div>
          </div>
        );
      
      case "facebook":
        return (
          <div className={cn(
            commonClasses,
            "border-[#1877F2]/20 bg-white/5 hover:border-[#1877F2]/50"
          )}>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-foreground">John Doe</h4>
                <p className="text-xs text-muted-foreground">Just now • 🌎</p>
              </div>
            </div>
            <div 
              className={cn(
                "prose prose-invert max-w-none",
                isEditing ? "border border-dashed border-primary/50 p-2 rounded" : ""
              )}
              contentEditable={isEditing}
              onBlur={(e) => setEditedContent(e.currentTarget.textContent || "")}
              suppressContentEditableWarning
            >
              {content}
            </div>
          </div>
        );
    }
  };

  return (
    <Card 
      ref={previewRef}
      className="border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#1D2433] to-[#283047] backdrop-blur-sm animate-fade-in hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] rounded-xl max-h-[600px] overflow-y-auto relative"
    >
      <CardHeader className="p-6 sticky top-0 bg-gradient-to-br from-[#1D2433] to-[#283047] z-10 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          <Eye className="w-6 h-6" />
          Live Preview
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "transition-colors duration-300",
            isEditing && "text-primary hover:text-primary/80"
          )}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {formData.platforms.map((platform) => {
            const content = getPreviewContent();
            const limit = getCharacterLimit(platform);
            const count = content.length;

            return (
              <div key={platform} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium capitalize text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                    {platform}
                  </h3>
                  <span className={cn(
                    "text-sm",
                    count > limit ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {count}/{limit} characters
                  </span>
                </div>
                {getPlatformPreview(platform, content)}
              </div>
            );
          })}

          {formData.platforms.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted/20 flex items-center justify-center">
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground animate-pulse">
                Select a platform to see the preview
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={saveAsDraft}
              disabled={isSaving || !formData.description}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save as Draft"}
            </Button>
            
            <Button
              variant="outline"
              className="flex-1"
              onClick={publishNow}
              disabled={isPublishing || !formData.description}
            >
              <Send className="w-4 h-4 mr-2" />
              {isPublishing ? "Publishing..." : "Publish Now"}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={!formData.description}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Schedule Date and Time</Label>
                    <Input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full"
                    onClick={schedulePost}
                    disabled={isScheduling || !scheduledDate}
                  >
                    {isScheduling ? "Scheduling..." : "Confirm Schedule"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>

      <Button
        size="icon"
        variant="secondary"
        className={cn(
          "fixed bottom-4 right-4 rounded-full transition-all duration-300 opacity-0 translate-y-full",
          showScrollButton && "opacity-100 translate-y-0"
        )}
        onClick={scrollToTop}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </Card>
  );
}