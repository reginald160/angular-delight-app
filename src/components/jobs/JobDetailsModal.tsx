import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Building, 
  PoundSterling, 
  Clock, 
  BookmarkPlus, 
  Bookmark,
  Send,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { Job } from '@/hooks/useJobs';
import { useState } from 'react';

interface JobDetailsModalProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (jobId: string, coverLetter?: string) => Promise<boolean>;
  onToggleSave: (jobId: string) => void;
  isSaved: boolean;
  hasApplied: boolean;
}

export function JobDetailsModal({
  job,
  open,
  onOpenChange,
  onApply,
  onToggleSave,
  isSaved,
  hasApplied
}: JobDetailsModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  if (!job) return null;

  const handleApply = async () => {
    setApplying(true);
    const success = await onApply(job.id, coverLetter);
    setApplying(false);
    if (success) {
      setShowApplyForm(false);
      setCoverLetter('');
    }
  };

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return 'Competitive';
    if (job.salary_min && job.salary_max) {
      return `£${job.salary_min.toLocaleString()} - £${job.salary_max.toLocaleString()}`;
    }
    return job.salary_min ? `From £${job.salary_min.toLocaleString()}` : `Up to £${job.salary_max?.toLocaleString()}`;
  };

  const postedDate = new Date(job.posted_at);
  const daysAgo = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24));
  const postedText = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-serif mb-2">{job.title}</DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="w-4 h-4" />
                <span className="font-medium">{job.company}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleSave(job.id)}
              className={isSaved ? 'text-primary' : ''}
            >
              {isSaved ? <Bookmark className="w-5 h-5 fill-current" /> : <BookmarkPlus className="w-5 h-5" />}
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Key Details */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <PoundSterling className="w-4 h-4" />
              <span>{formatSalary()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span>{job.job_type}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Posted {postedText}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About the Role</h3>
            <p className="text-muted-foreground">{job.description || 'No description provided.'}</p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Apply Section */}
          {hasApplied ? (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 rounded-lg text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">You have already applied for this position</span>
            </div>
          ) : showApplyForm ? (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
                <Textarea
                  id="cover-letter"
                  placeholder="Tell the employer why you're a great fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleApply} disabled={applying} className="flex-1">
                  {applying ? 'Submitting...' : 'Submit Application'}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => setShowApplyForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button onClick={() => setShowApplyForm(true)} className="flex-1" variant="royal">
                Apply Now
                <Send className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" onClick={() => onToggleSave(job.id)}>
                {isSaved ? 'Saved' : 'Save Job'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
