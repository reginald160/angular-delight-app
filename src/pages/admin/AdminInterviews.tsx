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
import { Plus, Search, Edit, Trash2, Calendar, Building, MapPin, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Interview {
  id: string;
  user_id: string;
  job_title: string;
  company: string;
  interview_date: string;
  location: string | null;
  interview_type: string;
  status: string;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
}

const emptyForm = {
  user_id: '',
  job_title: '',
  company: '',
  interview_date: '',
  location: '',
  interview_type: 'in-person',
  status: 'scheduled',
  notes: '',
  admin_notes: '',
};

export default function AdminInterviews() {
  const { isAdmin, loading: adminLoading, users } = useAdmin();
  const { toast } = useToast();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchInterviews = async () => {
    const { data } = await supabase
      .from('user_interviews')
      .select('*')
      .order('interview_date', { ascending: false });
    setInterviews((data as Interview[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchInterviews();
  }, [isAdmin]);

  if (adminLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const filtered = interviews.filter(i =>
    i.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserName = (userId: string) => {
    const u = users.find((u: any) => u.id === userId || u.user_id === userId);
    if (u) return `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || userId;
    return userId.slice(0, 8) + '...';
  };

  const handleOpen = (interview?: Interview) => {
    if (interview) {
      setEditingId(interview.id);
      setForm({
        user_id: interview.user_id,
        job_title: interview.job_title,
        company: interview.company,
        interview_date: interview.interview_date ? new Date(interview.interview_date).toISOString().slice(0, 16) : '',
        location: interview.location || '',
        interview_type: interview.interview_type,
        status: interview.status,
        notes: interview.notes || '',
        admin_notes: interview.admin_notes || '',
      });
    } else {
      setEditingId(null);
      setForm(emptyForm);
    }
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.user_id || !form.job_title || !form.company || !form.interview_date) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    const payload = {
      user_id: form.user_id,
      job_title: form.job_title,
      company: form.company,
      interview_date: new Date(form.interview_date).toISOString(),
      location: form.location || null,
      interview_type: form.interview_type,
      status: form.status,
      notes: form.notes || null,
      admin_notes: form.admin_notes || null,
    };

    if (editingId) {
      const { error } = await supabase.from('user_interviews').update(payload).eq('id', editingId);
      if (error) { toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' }); return; }
      toast({ title: 'Success', description: 'Interview updated' });
    } else {
      const { error } = await supabase.from('user_interviews').insert(payload);
      if (error) { toast({ title: 'Error', description: 'Failed to create', variant: 'destructive' }); return; }
      toast({ title: 'Success', description: 'Interview created' });
    }
    setFormOpen(false);
    fetchInterviews();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('user_interviews').delete().eq('id', deleteId);
    setDeleteId(null);
    toast({ title: 'Deleted', description: 'Interview removed' });
    fetchInterviews();
  };

  const statusVariant = (s: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (s === 'scheduled') return 'default';
    if (s === 'completed') return 'secondary';
    if (s === 'cancelled') return 'destructive';
    return 'outline';
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Manage Interviews</h1>
          <p className="text-muted-foreground">Schedule and track interviews for users</p>
        </div>
        <Button onClick={() => handleOpen()}>
          <Plus className="h-4 w-4 mr-2" /> Add Interview
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search interviews..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.map(interview => (
          <Card key={interview.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{interview.job_title}</h3>
                    <Badge variant={statusVariant(interview.status)}>{interview.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Building className="h-4 w-4" /> {interview.company}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(interview.interview_date), 'PPP p')}</span>
                    {interview.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {interview.location}</span>}
                    <span>Type: {interview.interview_type}</span>
                    <Badge variant="outline">User: {getUserName(interview.user_id)}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleOpen(interview)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setDeleteId(interview.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No interviews found</CardContent></Card>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Interview' : 'Add Interview'}</DialogTitle>
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
            <div><Label>Date & Time *</Label><Input type="datetime-local" value={form.interview_date} onChange={e => setForm(f => ({ ...f, interview_date: e.target.value }))} /></div>
            <div><Label>Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={form.interview_type} onValueChange={v => setForm(f => ({ ...f, interview_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In Person</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Notes (visible to user)</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
            <div><Label>Admin Notes (internal)</Label><Textarea value={form.admin_notes} onChange={e => setForm(f => ({ ...f, admin_notes: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Interview</AlertDialogTitle>
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
