import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { ContentFormData } from "@/pages/Content";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PlatformPreview } from "./preview/PlatformPreview";
import { PreviewActions } from "./preview/PreviewActions";
import { CharacterCounter } from "./preview/CharacterCounter";
import debounce from 'lodash/debounce';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(formData.description);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sync edited content with form data when not in edit mode
  useEffect(() => {
    if (!isEditing) {
      setEditedContent(formData.description);
    }
  }, [formData.description, isEditing]);

  const validateFormData = () => {
    if (!formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a description for your content",
      });
      return false;
    }

    if (formData.platforms.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select at least one platform",
      });
      return false;
    }

    return true;
  };

  const saveAsDraft = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to save content",
        });
        return;
      }

      if (!validateFormData()) {
        return;
      }

      setIsSaving(true);
      
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
          user_id: user.id,
          generated_text: editedContent,
          edited_content: isEditing ? editedContent : null,
          is_edited: isEditing,
          hashtags: []
        }])
        .select()
        .single();

      if (contentError) throw contentError;

      if (!contentData) {
        throw new Error('No data returned after saving');
      }

      // Record the activity
      await supabase
        .from('recent_activity')
        .insert([{
          user_id: user.id,
          activity_type: 'content_draft',
          details: {
            content_id: contentData.id,
            platforms: formData.platforms,
            action: 'saved_draft'
          }
        }]);

      toast({
        title: "Success",
        description: "Content saved as draft",
      });

      navigate("/");

    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save draft. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const publishNow = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to publish content",
        });
        return;
      }

      if (!validateFormData()) {
        return;
      }

      setIsPublishing(true);
      
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
          user_id: user.id,
          generated_text: editedContent,
          edited_content: isEditing ? editedContent : null,
          is_edited: isEditing,
          hashtags: [],
          seo_score: Math.floor(Math.random() * 100)
        }])
        .select()
        .single();

      if (contentError) throw contentError;

      if (!contentData) {
        throw new Error('No data returned after publishing');
      }

      // Record the activity
      await supabase
        .from('recent_activity')
        .insert([{
          user_id: user.id,
          activity_type: 'content_published',
          details: {
            content_id: contentData.id,
            platforms: formData.platforms,
            action: 'published'
          }
        }]);

      toast({
        title: "Success",
        description: `Content published to: ${formData.platforms.join(', ')}`,
      });

      navigate("/");

    } catch (error: any) {
      console.error('Error publishing:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to publish content. Please try again.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const schedulePost = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "You must be logged in to schedule posts",
        });
        return;
      }

      if (!validateFormData()) {
        return;
      }

      setIsScheduling(true);
      const { error: scheduledError } = await supabase
        .from('scheduled_posts')
        .insert({
          content: editedContent,
          platform: formData.platforms,
          scheduled_date: scheduledDate,
          user_id: user.id
        });

      if (scheduledError) throw scheduledError;

      toast({
        title: "Success",
        description: "Post scheduled successfully",
      });
    } catch (error: any) {
      console.error('Error scheduling post:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to schedule post",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <Card 
      ref={previewRef}
      className="border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] bg-gradient-to-br from-[#1D2433] to-[#283047] backdrop-blur-sm animate-fade-in hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] rounded-xl max-h-[600px] overflow-y-auto relative"
    >
      <CardHeader className="p-6 sticky top-0 bg-gradient-to-br from-[#1D2433] to-[#283047] z-10">
        <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          <Eye className="w-6 h-6" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {formData.platforms.map((platform) => (
            <div key={platform} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium capitalize text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                  {platform}
                </h3>
                <CharacterCounter 
                  platform={platform}
                  count={editedContent.length}
                />
              </div>
              <PlatformPreview
                platform={platform}
                content={editedContent}
                isEditing={isEditing}
                onContentChange={setEditedContent}
              />
            </div>
          ))}

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

          <PreviewActions
            onSaveDraft={saveAsDraft}
            onPublish={publishNow}
            onSchedule={schedulePost}
            onToggleEdit={() => setIsEditing(!isEditing)}
            isSaving={isSaving}
            isPublishing={isPublishing}
            isScheduling={isScheduling}
            isEditing={isEditing}
            scheduledDate={scheduledDate}
            setScheduledDate={setScheduledDate}
            hasContent={Boolean(formData.description)}
          />
        </div>
      </CardContent>
    </Card>
  );
}