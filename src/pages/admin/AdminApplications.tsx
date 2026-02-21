import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Building, MapPin, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { notificationService, CreateNotificationRequest } from '@/services/NotificationService';

interface Application {
  id: string;
  user_id: string;
  job_title: string;
  company: string;
  location: string | null;
  job_type: string | null;
  applied_date: string;
  status: string;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
}

const emptyForm = {
  user_id: '',
  job_title: '',
  company: '',
  location: '',
  job_type: 'Full-time',
  status: 'applied',
  notes: '',
  admin_notes: '',
};

export default function AdminApplications() {
  const { isAdmin, loading: adminLoading, users } = useAdmin();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('admin_job_applications')
      .select('*')
      .order('applied_date', { ascending: false });
    setApplications((data as Application[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchApplications();
  }, [isAdmin]);

  if (adminLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const filtered = applications.filter(a =>
    a.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserName = (userId: string) => {
    const u = users.find((u: any) => u.id === userId || u.user_id === userId);
    if (u) return `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || userId;
    return userId.slice(0, 8) + '...';
  };

  const handleOpen = (app?: Application) => {
    if (app) {
      setEditingId(app.id);
      setForm({
        user_id: app.user_id,
        job_title: app.job_title,
        company: app.company,
        location: app.location || '',
        job_type: app.job_type || 'Full-time',
        status: app.status,
        notes: app.notes || '',
        admin_notes: app.admin_notes || '',
      });
    } else {
      setEditingId(null);
      setForm(emptyForm);
    }
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.user_id || !form.job_title || !form.company) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    const payload = {
      user_id: form.user_id,
      job_title: form.job_title,
      company: form.company,
      location: form.location || null,
      job_type: form.job_type,
      status: form.status,
      notes: form.notes || null,
      admin_notes: form.admin_notes || null,
    };

    if (editingId) {
      const { error } = await supabase.from('admin_job_applications').update(payload).eq('id', editingId);
      if (error) { toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' }); return; }
      toast({ title: 'Success', description: 'Application updated' });
    } else {
      const { error } = await supabase.from('admin_job_applications').insert(payload);
      if (error) { toast({ title: 'Error', description: 'Failed to create', variant: 'destructive' }); return; }
      // Notify the user
      try {
        const notification: CreateNotificationRequest = {
          user_id: form.user_id,
          title: 'New Job Application',
          message: `We've applied to ${form.job_title} at ${form.company} on your behalf!`,
          type: 'info',
        };
        await notificationService.SendNotificationAsync(notification);
      } catch (e) {
        console.error('Failed to send notification', e);
      }
      toast({ title: 'Success', description: 'Application created & user notified' });
    }
    setFormOpen(false);
    fetchApplications();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('admin_job_applications').delete().eq('id', deleteId);
    setDeleteId(null);
    toast({ title: 'Deleted', description: 'Application removed' });
    fetchApplications();
  };

  const statusVariant = (s: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (s === 'applied') return 'default';
    if (s === 'interview' || s === 'offered') return 'secondary';
    if (s === 'rejected') return 'destructive';
    return 'outline';
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Manage Applications</h1>
          <p className="text-muted-foreground">Apply to jobs on behalf of users and track status</p>
        </div>
        <Button onClick={() => handleOpen()}>
          <Plus className="h-4 w-4 mr-2" /> Add Application
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search applications..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.map(app => (
          <Card key={app.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{app.job_title}</h3>
                    <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Building className="h-4 w-4" /> {app.company}</span>
                    {app.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {app.location}</span>}
                    {app.job_type && <span>{app.job_type}</span>}
                    <span>Applied: {format(new Date(app.applied_date), 'PPP')}</span>
                    <Badge variant="outline">User: {getUserName(app.user_id)}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleOpen(app)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setDeleteId(app.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No applications found</CardContent></Card>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Application' : 'Apply on Behalf of User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User *</Label>
              <Select value={form.user_id} onValueChange={v => setForm(f => ({ ...f, user_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent>
                  {users.map((u: any) => (
                    <SelectItem key={u.id || u.user_id} value={u.id || u.user_id}>
                      {u.first_name || ''} {u.last_name || ''} ({u.email || ''})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Job Title *</Label><Input value={form.job_title} onChange={e => setForm(f => ({ ...f, job_title: e.target.value }))} /></div>
              <div><Label>Company *</Label><Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
              <div>
                <Label>Job Type</Label>
                <Select value={form.job_type} onValueChange={v => setForm(f => ({ ...f, job_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="reviewing">Under Review</SelectItem>
                  <SelectItem value="interview">Interview Stage</SelectItem>
                  <SelectItem value="offered">Offered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Notes (visible to user)</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            <div><Label>Admin Notes (internal)</Label><Textarea value={form.admin_notes} onChange={e => setForm(f => ({ ...f, admin_notes: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Create & Notify'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
