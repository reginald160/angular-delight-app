import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus } from 'lucide-react';
import { Job } from '@/hooks/useJobs';

interface JobFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job | null;
  onSubmit: (job: Partial<Job>) => Promise<any>;
}

export const JobFormModal = ({ open, onOpenChange, job, onSubmit }: JobFormModalProps) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company: job?.company || '',
    location: job?.location || '',
    description: job?.description || '',
    job_type: job?.job_type || 'Full-time',
    salary_min: job?.salary_min?.toString() || '',
    salary_max: job?.salary_max?.toString() || '',
    requirements: job?.requirements?.join('\n') || '',
    skills: job?.skills?.join(', ') || '',
    is_active: job?.is_active ?? true
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await onSubmit({
      title: formData.title,
      company: formData.company,
      location: formData.location,
      description: formData.description || null,
      job_type: formData.job_type,
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      requirements: formData.requirements.split('\n').filter(r => r.trim()) || null,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s) || null,
      is_active: formData.is_active,
      expires_at: null
    });

    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {job ? 'Edit Job' : 'Add New Job'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Software Engineer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g. Tech Corp Ltd"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g. London, UK"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_type">Job Type</Label>
              <Select
                value={formData.job_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, job_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_min">Min Salary (£)</Label>
              <Input
                id="salary_min"
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData(prev => ({ ...prev, salary_min: e.target.value }))}
                placeholder="e.g. 40000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_max">Max Salary (£)</Label>
              <Input
                id="salary_max"
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData(prev => ({ ...prev, salary_max: e.target.value }))}
                placeholder="e.g. 60000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Job description..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (one per line)</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="5+ years experience&#10;Bachelor's degree&#10;Strong communication skills"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="JavaScript, React, Node.js, TypeScript"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {job ? 'Update Job' : 'Create Job'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
