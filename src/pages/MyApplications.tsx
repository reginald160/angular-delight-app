import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Building, MapPin, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface AdminApplication {
  id: string;
  job_title: string;
  company: string;
  location: string | null;
  job_type: string | null;
  applied_date: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  applied: { label: 'Applied', variant: 'default' },
  reviewing: { label: 'Under Review', variant: 'outline' },
  interview: { label: 'Interview Stage', variant: 'secondary' },
  offered: { label: 'Offered', variant: 'default' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

export default function MyApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data, error } = await supabase
        .from('admin_job_applications')
        .select('*')
        .eq('user_id', user.Id)
        .order('applied_date', { ascending: false });

      if (!error) setApplications((data as AdminApplication[]) || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Applications For You</h1>
        <p className="text-muted-foreground">Jobs our team has applied to on your behalf</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(statusConfig).map(([key, config]) => (
          <Card key={key}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {applications.filter(a => a.status === key).length}
              </p>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {applications.map(app => {
          const status = statusConfig[app.status] || statusConfig.applied;
          return (
            <Card key={app.id}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{app.job_title}</h3>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" /> {app.company}
                      </span>
                      {app.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {app.location}
                        </span>
                      )}
                      {app.job_type && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" /> {app.job_type}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Applied {format(new Date(app.applied_date), 'PPP')}
                      </span>
                    </div>
                    {app.notes && (
                      <p className="mt-3 text-sm bg-muted/50 rounded-lg p-3">{app.notes}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {applications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold text-lg mb-2">No applications yet</h3>
              <p>Our team will apply to suitable positions for you. Check back soon!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
