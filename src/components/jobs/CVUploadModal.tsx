import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Upload, Loader2, Trash2 } from 'lucide-react';
import { useCVUpload } from '@/hooks/useCVUpload';
import { UserCV } from '@/hooks/useJobs';
import { useRef } from 'react';

interface CVUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCV: UserCV | null;
  onRefresh: () => void;
}

export function CVUploadModal({ open, onOpenChange, currentCV, onRefresh }: CVUploadModalProps) {
  const { uploadCV, deleteCV, uploading } = useCVUpload(onRefresh);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadCV(file);
    }
  };

  const handleDelete = async () => {
    if (currentCV) {
      await deleteCV(currentCV.id, currentCV.file_path);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Your CV</DialogTitle>
          <DialogDescription>
            Upload your CV in PDF or Word format. Your CV will be used when applying for jobs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {currentCV ? (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{currentCV.file_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(currentCV.file_size)} • Uploaded {new Date(currentCV.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ) : null}

          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium">{currentCV ? 'Replace your CV' : 'Upload your CV'}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF or Word document, max 10MB
                </p>
              </>
            )}
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
