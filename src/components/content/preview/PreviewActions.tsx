import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Edit, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface PreviewActionsProps {
  content: string;
  onEdit: () => void;
  onSave?: () => void;
  wordCount: number;
  characterCount: number;
}

export function PreviewActions({ 
  content, 
  onEdit, 
  onSave, 
  wordCount, 
  characterCount 
}: PreviewActionsProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Content copied",
      description: "The content has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Content downloaded",
      description: "The content has been downloaded as a text file.",
    });
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited
        ? "This content has been removed from your favorites."
        : "This content has been added to your favorites.",
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Badge variant="secondary">
          {wordCount} words
        </Badge>
        <Badge variant="secondary">
          {characterCount} chars
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleFavorite}>
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button variant="outline" size="icon" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="default" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Content
        </Button>
      </div>
    </div>
  );
}
