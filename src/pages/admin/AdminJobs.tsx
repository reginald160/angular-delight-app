import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/hooks/useAdmin';
import { JobFormModal } from '@/components/admin/JobFormModal';
import { Job } from '@/hooks/useJobs';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Building,
  Loader2
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminJobs() {
  const { isAdmin, loading, jobs, createJob, updateJob, deleteJob } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (job: Partial<Job>) => {
    if (editingJob) {
      await updateJob(editingJob.id, job);
    } else {
      await createJob(job as any);
    }
    setEditingJob(null);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteJob(deleteId);
      setDeleteId(null);
    }
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `£${(min/1000).toFixed(0)}k - £${(max/1000).toFixed(0)}k`;
    return min ? `From £${(min/1000).toFixed(0)}k` : `Up to £${(max!/1000).toFixed(0)}k`;
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Manage Jobs</h1>
          <p className="text-muted-foreground">Create, edit, and delete job listings</p>
        </div>
        <Button onClick={() => { setEditingJob(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Job
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <Badge variant={job.is_active ? "default" : "secondary"}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building className="h-4 w-4" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                    <span>{job.job_type}</span>
                    <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(job)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setDeleteId(job.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredJobs.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No jobs found
            </CardContent>
          </Card>
        )}
      </div>

      <JobFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        job={editingJob}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
