import { Button } from "@/components/ui/button";
import { Save, Send, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PreviewActionsProps {
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  onSchedule: (date: string) => Promise<void>;
  isSaving: boolean;
  isPublishing: boolean;
  isScheduling: boolean;
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
  hasContent: boolean;
}

export function PreviewActions({
  onSaveDraft,
  onPublish,
  onSchedule,
  isSaving,
  isPublishing,
  isScheduling,
  scheduledDate,
  setScheduledDate,
  hasContent
}: PreviewActionsProps) {
  return (
    <div className="flex gap-3 mt-6">
      <Button
        variant="outline"
        className="flex-1"
        onClick={onSaveDraft}
        disabled={isSaving || !hasContent}
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? "Saving..." : "Save as Draft"}
      </Button>
      
      <Button
        variant="outline"
        className="flex-1"
        onClick={onPublish}
        disabled={isPublishing || !hasContent}
      >
        <Send className="w-4 h-4 mr-2" />
        {isPublishing ? "Publishing..." : "Publish Now"}
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex-1"
            disabled={!hasContent}
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
              onClick={() => onSchedule(scheduledDate)}
              disabled={isScheduling || !scheduledDate}
            >
              {isScheduling ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}