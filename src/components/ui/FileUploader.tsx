
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File } from 'lucide-react';
import { Button } from './button';
import { useFileUpload } from '@/hooks/api/useFileUpload';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onUploadComplete?: (url: string, path: string) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  bucket?: string;
  folder?: string;
}

export function FileUploader({
  onUploadComplete,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  maxSize = 10 * 1024 * 1024, // 10MB
  bucket = 'images',
  folder = ''
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { upload, isLoading } = useFileUpload();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    
    acceptedFiles.forEach(async (file) => {
      try {
        const result = await upload({ file, bucket, folder });
        if (result) {
          onUploadComplete?.(result.url, result.path);
          toast({
            title: "Upload Successful",
            description: `${file.name} has been uploaded successfully.`
          });
        }
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive"
        });
      }
    });
  }, [upload, onUploadComplete, bucket, folder, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: true
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(files => files.filter(file => file !== fileToRemove));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop files here, or click to select files"
          }
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Max file size: {Math.round(maxSize / 1024 / 1024)}MB
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files:</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file)}
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
