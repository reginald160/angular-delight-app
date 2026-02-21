import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, Building, Clock, Loader2, Video, Phone, Users } from 'lucide-react';
import { format } from 'date-fns';

interface Interview {
  id: string;
  job_title: string;
  company: string;
  interview_date: string;
  location: string | null;
  interview_type: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  scheduled: { label: 'Scheduled', variant: 'default' },
  completed: { label: 'Completed', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  rescheduled: { label: 'Rescheduled', variant: 'outline' },
};

const typeIcons: Record<string, React.ReactNode> = {
  'in-person': <Users className="h-4 w-4" />,
  'video': <Video className="h-4 w-4" />,
  'phone': <Phone className="h-4 w-4" />,
};

export default function MyInterviews() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchInterviews = async () => {
      const { data, error } = await supabase
        .from('user_interviews')
        .select('*')
        .eq('user_id', user.Id)
        .order('interview_date', { ascending: true });

      if (!error) setInterviews((data as Interview[]) || []);
      setLoading(false);
    };
    fetchInterviews();
  }, [user]);

  const upcoming = interviews.filter(i => i.status === 'scheduled' || i.status === 'rescheduled');
  const past = interviews.filter(i => i.status === 'completed' || i.status === 'cancelled');

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
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">My Interviews</h1>
        <p className="text-muted-foreground">Interviews secured on your behalf by our team</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{interviews.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{upcoming.length}</p>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{interviews.filter(i => i.status === 'completed').length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{interviews.filter(i => i.status === 'cancelled').length}</p>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-xl font-semibold mb-4">Upcoming Interviews</h2>
          <div className="space-y-4">
            {upcoming.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-semibold mb-4">Past Interviews</h2>
          <div className="space-y-4">
            {past.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </div>
      )}

      {interviews.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">No interviews yet</h3>
            <p>Our team is working on securing interviews for you. Check back soon!</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

function InterviewCard({ interview }: { interview: Interview }) {
  const status = statusConfig[interview.status] || statusConfig.scheduled;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{interview.job_title}</h3>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" /> {interview.company}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {format(new Date(interview.interview_date), 'PPP p')}
              </span>
              {interview.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {interview.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                {typeIcons[interview.interview_type] || <Clock className="h-4 w-4" />}
                {interview.interview_type}
              </span>
            </div>
            {interview.notes && (
              <p className="mt-3 text-sm bg-muted/50 rounded-lg p-3">{interview.notes}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
