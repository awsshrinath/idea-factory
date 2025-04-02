
import { Button } from "@/components/ui/button";
import { Calendar, Save, Send, Clock, Edit2, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface PreviewActionsProps {
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  onSchedule: () => Promise<void>;
  onToggleEdit: () => void;
  isSaving: boolean;
  isPublishing: boolean;
  isScheduling: boolean;
  isEditing: boolean;
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
  hasContent: boolean;
}

export function PreviewActions({
  onSaveDraft,
  onPublish,
  onSchedule,
  onToggleEdit,
  isSaving,
  isPublishing,
  isScheduling,
  isEditing,
  scheduledDate,
  setScheduledDate,
  hasContent
}: PreviewActionsProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "mt-6",
      isMobile ? "flex flex-col gap-3" : "flex flex-wrap gap-3"
    )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isEditing ? "default" : "outline"}
              size="icon"
              onClick={onToggleEdit}
              className={cn(
                "relative hover:shadow-[0_0_8px_rgba(255,255,255,0.2)]",
                isMobile && "h-12 w-12 self-end mb-3"
              )}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isEditing ? "Exit Edit Mode" : "Edit Content"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        variant="outline"
        className={cn(
          "transition-all duration-300 hover:shadow-[0_0_12px_rgba(66,230,149,0.4)]",
          isMobile ? "w-full h-12" : "flex-1"
        )}
        onClick={onSaveDraft}
        isLoading={isSaving}
        disabled={isSaving || !hasContent}
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? "Saving..." : "Save as Draft"}
      </Button>
      
      <Button
        variant="outline"
        className={cn(
          "transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,198,255,0.4)]",
          isMobile ? "w-full h-12" : "flex-1"
        )}
        onClick={onPublish}
        isLoading={isPublishing}
        disabled={isPublishing || !hasContent}
      >
        <Send className="w-4 h-4 mr-2" />
        {isPublishing ? "Publishing..." : "Publish Now"}
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "transition-all duration-300 hover:shadow-[0_0_12px_rgba(255,65,108,0.4)]",
              isMobile ? "w-full h-12" : "flex-1"
            )}
            disabled={!hasContent}
          >
            <Calendar className="w-4 h-4 mr-2" />
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
              className="w-full bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] hover:shadow-[0_0_15px_rgba(255,65,108,0.4)] hover:scale-[1.03]"
              onClick={onSchedule}
              isLoading={isScheduling}
              disabled={isScheduling || !scheduledDate}
            >
              <Clock className="w-4 h-4 mr-2" />
              {isScheduling ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
