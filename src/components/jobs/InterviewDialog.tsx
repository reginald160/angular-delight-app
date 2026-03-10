import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Building, MapPin, Video, Users } from 'lucide-react';

type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

type Interview = {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  interviewAt: string;
  mode: 'Online' | 'In-person' | 'Phone';
  status: InterviewStatus;
  notes?: string;
  meetingLink?: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: Interview | null;
}

export   function InterviewDialog({ open, onOpenChange, interview }: Props) {
  if (!interview) return null;

  const formatBrowserDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getModeIcon = () => {
    if (interview.mode === 'Online') return <Video className="w-4 h-4" />;
    if (interview.mode === 'Phone') return <Users className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  const getStatusBadge = () => {
    switch (interview.status) {
      case 'scheduled':
        return <Badge className="bg-blue-600">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'rescheduled':
        return <Badge className="bg-yellow-600">Rescheduled</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-600">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Interview Prep Notes
            {getStatusBadge()}
          </DialogTitle>
          <DialogDescription>
            Prepare confidently for your upcoming interview.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold text-lg">{interview.jobTitle}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Building className="w-4 h-4" />
              {interview.company}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatBrowserDateTime(interview.interviewAt)}
            </span>
            <span className="flex items-center gap-1">
              {getModeIcon()}
              {interview.mode}
            </span>
            {interview.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {interview.location}
              </span>
            )}
          </div>

          {interview.meetingLink && (
            <div className="text-sm">
              <span className="font-medium">Meeting Link:</span>{' '}
              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Join Interview
              </a>
            </div>
          )}

          <div className="border rounded-lg p-4 bg-muted/40">
            <p className="text-sm font-medium mb-2">Notes</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {interview.notes || 'No preparation notes added yet.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
