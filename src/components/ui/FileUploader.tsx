
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/api/useFileUpload';
import { Upload, X, File as FileIcon, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  accept?: Record<string, string[]>;
  maxSize?: number;
  bucket?: string;
  folder?: string;
  onUploadComplete?: (files: { url: string; path: string; name: string }[]) => void;
  className?: string;
  multiple?: boolean;
}

export function FileUploader({
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'video/*': ['.mp4', '.mov', '.avi', '.mkv']
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  bucket = 'images',
  folder = '',
  onUploadComplete,
  className,
  multiple = false
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    file: File;
    progress: number;
    url?: string;
    path?: string;
    error?: string;
  }>>([]);

  const { upload, isLoading } = useFileUpload();
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const filesToUpload = acceptedFiles.map(file => ({
      file,
      progress: 0
    }));

    setUploadedFiles(filesToUpload);

    const uploadPromises = filesToUpload.map(async (fileData, index) => {
      try {
        setUploadedFiles(prev => 
          prev.map((f, i) => i === index ? { ...f, progress: 50 } : f)
        );

        const result = await new Promise<{ url: string; path: string }>((resolve, reject) => {
          upload({ file: fileData.file, bucket, folder }, {
            onSuccess: resolve,
            onError: reject
          });
        });

        setUploadedFiles(prev => 
          prev.map((f, i) => i === index ? { 
            ...f, 
            progress: 100, 
            url: result.url, 
            path: result.path 
          } : f)
        );

        return {
          url: result.url,
          path: result.path,
          name: fileData.file.name
        };
      } catch (error) {
        setUploadedFiles(prev => 
          prev.map((f, i) => i === index ? { 
            ...f, 
            error: error instanceof Error ? error.message : 'Upload failed' 
          } : f)
        );
        throw error;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean);
      
      if (successfulUploads.length > 0) {
        onUploadComplete?.(successfulUploads);
        toast({
          title: "Upload successful",
          description: `${successfulUploads.length} file(s) uploaded successfully`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Some files failed to upload",
      });
    }
  }, [upload, bucket, folder, onUploadComplete, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
    if (file.type.startsWith('video/')) return <VideoIcon className="h-8 w-8" />;
    return <FileIcon className="h-8 w-8" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive 
            ? "border-purple-400 bg-purple-400/10" 
            : "border-white/20 hover:border-white/40",
          isLoading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-white/60" />
        {isDragActive ? (
          <p className="text-purple-400">Drop the files here...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-white/80">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-white/60">
              Max file size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          {uploadedFiles.map((fileData, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="text-white/60">
                {getFileIcon(fileData.file)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {fileData.file.name}
                </p>
                <p className="text-xs text-white/60">
                  {(fileData.file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                {fileData.progress > 0 && fileData.progress < 100 && (
                  <Progress value={fileData.progress} className="mt-1 h-1" />
                )}
                {fileData.error && (
                  <p className="text-xs text-red-400 mt-1">{fileData.error}</p>
                )}
                {fileData.url && (
                  <p className="text-xs text-green-400 mt-1">Upload complete</p>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFile(index)}
                className="text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
