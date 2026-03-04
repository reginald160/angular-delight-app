import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { InterviewDialog } from '@/components/jobs/InterviewDialog';
import { JobDetailsModal } from '@/components/jobs/JobDetailsModal';
import { CVUploadModal } from '@/components/jobs/CVUploadModal';
import { JobAlertModal } from '@/components/jobs/JobAlertModal';
import { ProfileImproveModal } from '@/components/jobs/ProfileImproveModal';
import { FilterSheet } from '@/components/jobs/FilterSheet';

import { useJobs, Job } from '@/hooks/useJobs';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';

import {
  Search,
  Filter,
  MapPin,
  Building,
  Clock,
  PoundSterling,
  BookmarkPlus,
  Bookmark,
  FileText,
  TrendingUp,
  Loader2,
  Calendar,
  Video,
  Users,
  BarChart3,
  Sparkles,
  CheckCircle,
  RefreshCcw,
  Briefcase,
} from 'lucide-react';

type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

type Interview = {
  id: string;
  jobTitle: string;
  company: string;
  location?: string | null;
  interviewAt: string; // ISO
  mode: 'Online' | 'In-person' | 'Phone';
  status: InterviewStatus;
  notes?: string | null;
};

type PagedResult<T> = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  items: T[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const PAGE_SIZE = 5;

export default function JobsDashboard() {
  const navigate = useNavigate();

  const {
    jobs,
    allJobs,
    savedJobs,
    alerts,
    userCV,
    loading,
    searchQuery,
    setSearchQuery,
    locationQuery,
    setLocationQuery,
    jobTypeFilter,
    setJobTypeFilter,
    toggleSaveJob,
    createAlert,
    deleteAlert,
    refreshCV,
    isJobSaved,
  } = useJobs();

  const { subscriptions, fetchUserSubscription } = useSubscription();

  // ---- Modals / UI state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Prep Notes dialog
  const [prepDialogOpen, setPrepDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  // ---- Interviews (paged)
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  const [interviewPage, setInterviewPage] = useState(1);
  const [interviewTotalPages, setInterviewTotalPages] = useState(1);
  const [interviewTotalCount, setInterviewTotalCount] = useState(0);
const ENABLE_AVAILABLE_JOBS = import.meta.env.VITE_ENABLE_AVAILABLE_JOBS === 'true';
  const hasMoreInterviews = interviewPage < interviewTotalPages;
    const { user } = useAuth();
    const firstName = user?.firstName;   // User metadata not available from custom API
    const location = useLocation();
    const [isSubVerified, setIsSubVerified] = useState(false);
    const { loading: jobsLoading} = useJobs(); // R

    useEffect(() => {
    const isProfilePage = location.pathname === '/dashboard/profile';
    
    if (user && !user.profileCompleted && !isProfilePage && user.role != "Admin") {
      // Redirect to profile page if not completed and not already there
      navigate('/dashboard/profile', { replace: true });
    }
  }, [user, navigate, location.pathname]);
  // ---- Subscription check (IMPORTANT: don't call fetchUserSubscription() directly in render)
  useEffect(() => {
    fetchUserSubscription();
  }, [fetchUserSubscription]);

  useEffect(() => {
    const verify = async () => {
      await fetchUserSubscription();
      setIsSubVerified(true); // Only mark verified after the API returns
    };
    verify();
  }, [fetchUserSubscription]);

 useEffect(() => {
    // Only redirect if:
    // - We have finished checking (isSubVerified is true)
    // - AND the result came back empty
    if (isSubVerified && !jobsLoading && subscriptions && subscriptions.length === 0) {
      navigate('/price');
    }
  }, [isSubVerified, jobsLoading, subscriptions, navigate]);

  // ---- Helpers
  const openJobDetails = (job: Job) => {
    setSelectedJob(job);
    setJobModalOpen(true);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `£${(min / 1000).toFixed(0)}k - £${(max / 1000).toFixed(0)}k`;
    return min ? `From £${(min / 1000).toFixed(0)}k` : `Up to £${(max! / 1000).toFixed(0)}k`;
  };

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

  const getInterviewStatusBadge = (status: InterviewStatus) => {
    switch (status) {
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

  const getModeIcon = (mode: Interview['mode']) => {
    if (mode === 'Online') return <Video className="w-4 h-4" />;
    if (mode === 'Phone') return <Users className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  const mapServerInterviewToUi = (x: any): Interview => {
    const statusMap = (s: any): InterviewStatus => {
      const str = typeof s === 'string' ? s.toLowerCase() : '';
      if (str === 'scheduled') return 'scheduled';
      if (str === 'completed') return 'completed';
      if (str === 'cancelled') return 'cancelled';
      if (str === 'rescheduled') return 'rescheduled';

      // numeric fallback (Scheduled=0, Rescheduled=1, Completed=2, Cancelled=3)
      if (s === 0) return 'scheduled';
      if (s === 1) return 'rescheduled';
      if (s === 2) return 'completed';
      if (s === 3) return 'cancelled';

      return 'scheduled';
    };

    const modeMap = (m: any): Interview['mode'] => {
      const str = typeof m === 'string' ? m.toLowerCase() : '';
      if (str === 'online') return 'Online';
      if (str === 'inperson' || str === 'in-person') return 'In-person';
      if (str === 'phone') return 'Phone';

      // numeric fallback (Online=0, InPerson=1, Phone=2)
      if (m === 0) return 'Online';
      if (m === 1) return 'In-person';
      if (m === 2) return 'Phone';

      return 'Online';
    };

    return {
      id: x.id,
      jobTitle: x.jobTitle,
      company: x.company,
      location: x.location ?? null,
      interviewAt: x.interviewAtUtc ?? x.interviewAt,
      mode: modeMap(x.mode),
      status: statusMap(x.status),
      notes: x.notes ?? null,
    };
  };

  const fetchInterviews = async (page = 1, append = false) => {
    setInterviewsLoading(true);

    try {
      const url = new URL(`${API_BASE_URL}/interviews/me`);
      url.searchParams.set('page', String(page));
      url.searchParams.set('pageSize', String(PAGE_SIZE));

      const token = sessionStorage.getItem('accessToken');

      const resp = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!resp.ok) throw new Error('Failed to fetch interviews');

      const data: PagedResult<any> = await resp.json();
      const mapped = (data.items || []).map(mapServerInterviewToUi);

      setInterviewPage(data.page);
      setInterviewTotalPages(data.totalPages);
      setInterviewTotalCount(data.totalCount);

      setInterviews((prev) => (append ? [...prev, ...mapped] : mapped));
    } catch {
      if (!append) {
        setInterviews([]);
        setInterviewPage(1);
        setInterviewTotalPages(1);
        setInterviewTotalCount(0);
      }
    } finally {
      setInterviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Profile stats
  const profileStats = userCV?.analysis_result
    ? [
        { label: 'Profile Completion', value: userCV.analysis_result.profileCompletion },
        { label: 'CV Strength', value: userCV.analysis_result.cvStrength },
        { label: 'Skills Match', value: userCV.analysis_result.skillsMatch },
      ]
    : [
        { label: 'Profile Completion', value: 0 },
        { label: 'CV Strength', value: 0 },
        { label: 'Skills Match', value: 0 },
      ];

  // ---- Analytics
  const analytics = useMemo(() => {
    const now = new Date();

    const upcoming = interviews.filter(
      (i) => i.status === 'scheduled' && new Date(i.interviewAt) >= now
    );

    const completed = interviews.filter((i) => i.status === 'completed').length;
    const cancelled = interviews.filter((i) => i.status === 'cancelled').length;

    const next = upcoming
      .slice()
      .sort((a, b) => +new Date(a.interviewAt) - +new Date(b.interviewAt))
      .at(0);

    return {
      totalInterviews: interviewTotalCount,
      upcomingCount: upcoming.length,
      completedCount: completed,
      cancelledCount: cancelled,
      nextInterview: next || null,
    };
  }, [interviews, interviewTotalCount]);

  const interviewReadinessScore = useMemo(() => {
    const base =
      (profileStats[0]?.value || 0) * 0.4 +
      (profileStats[1]?.value || 0) * 0.35 +
      (profileStats[2]?.value || 0) * 0.25;

    const bonus = Math.min(10, analytics.upcomingCount * 2);
    return Math.max(0, Math.min(100, Math.round(base + bonus)));
  }, [profileStats, analytics.upcomingCount]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Jobs 💼</h1>
        <p className="text-muted-foreground">Discover roles and track your interviews in one place</p>
      </div>

      {/* Search Bar */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Job title, skills, or company..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="City or postcode..."
                className="pl-10"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>

            <Button variant="outline" className="gap-2" onClick={() => setFilterOpen(true)}>
              <Filter className="w-4 h-4" />
              Filters
              {jobTypeFilter && (
                <Badge variant="secondary" className="ml-1">
                  1
                </Badge>
              )}
            </Button>

            <Button variant="royal">Search Jobs</Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview + Analytics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.upcomingCount}</p>
              <p className="text-xs text-muted-foreground">Upcoming Interviews</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.completedCount}</p>
              <p className="text-xs text-muted-foreground">Completed Interviews</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <BookmarkPlus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{savedJobs.length}</p>
              <p className="text-xs text-muted-foreground">Saved Jobs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{interviewReadinessScore}%</p>
              <p className="text-xs text-muted-foreground">Interview Readiness</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interviews */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Interviews
                </CardTitle>

                <CardDescription>
                  Your secured interview schedule and history
                  {analytics.nextInterview ? (
                    <span className="block mt-1 text-xs">
                      Next: <span className="font-medium">{analytics.nextInterview.company}</span> ·{' '}
                      {formatBrowserDateTime(analytics.nextInterview.interviewAt)}
                    </span>
                  ) : (
                    <span className="block mt-1 text-xs">No upcoming interviews yet.</span>
                  )}
                </CardDescription>
              </div>

              <Button variant="outline" onClick={() => fetchInterviews(1, false)} className="gap-2">
                <RefreshCcw className="w-4 h-4" />
                Refresh
              </Button>
            </CardHeader>

            <CardContent>
              {interviewsLoading && interviews.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : interviews.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  <Sparkles className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  No interviews found yet.
                  <div className="text-xs mt-2">
                    Tip: keep your profile strong and set job alerts to get opportunities faster.
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {interviews
                      .slice()
                      .sort((a, b) => +new Date(a.interviewAt) - +new Date(b.interviewAt))
                      .map((i) => (
                        <Card key={i.id} className="border-muted">
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div>
                                    <h3 className="font-semibold text-foreground">{i.jobTitle}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Building className="w-4 h-4" />
                                      {i.company}
                                    </div>
                                  </div>
                                  {getInterviewStatusBadge(i.status)}
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> {formatBrowserDateTime(i.interviewAt)}
                                  </span>

                                  <span className="flex items-center gap-1">
                                    {getModeIcon(i.mode)} {i.mode}
                                  </span>

                                  {i.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" /> {i.location}
                                    </span>
                                  )}
                                </div>

                                {i.notes && (
                                  <p className="text-xs text-muted-foreground mt-2">
                                    <span className="font-medium">Notes:</span> {i.notes}
                                  </p>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => {
                                    setSelectedInterview(i);
                                    setPrepDialogOpen(true);
                                  }}
                                >
                                  <FileText className="w-4 h-4" />
                                  Prep Notes
                                </Button>

                                <Button variant="royal" size="sm" className="gap-2">
                                  <TrendingUp className="w-4 h-4" />
                                  Improve
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Showing {interviews.length} of {interviewTotalCount}
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={interviewsLoading || !hasMoreInterviews}
                      onClick={() => fetchInterviews(interviewPage + 1, true)}
                    >
                      {interviewsLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : hasMoreInterviews ? (
                        'Load more'
                      ) : (
                        'No more'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Available Jobs */}
          {ENABLE_AVAILABLE_JOBS ? (
            <>
              <h2 className="font-serif text-xl font-bold pt-2">
                {searchQuery || locationQuery ? 'Search Results' : 'Recommended For You'}
              </h2>

              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No jobs found matching your criteria.
                    </CardContent>
                  </Card>
                ) : (
                  jobs.map((job) => (
                    <Card
                      key={job.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openJobDetails(job)}
                    >
                      {/* ... Job Card Content */}
                    </Card>
                  ))
                )}
              </div>
            </>
          ) : (
            /* Fallback UI when Jobs are disabled */
            <div className="pt-4">
              <Card className="bg-muted/30 border-dashed">
                <CardContent className="p-8 text-center">
                  <Briefcase className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <h3 className="font-medium text-muted-foreground">Job Search Temporarily Unavailable</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We are currently updating our job board. Please check back later.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Strength</CardTitle>
              <CardDescription>
                {userCV ? 'Improve your profile to get more matches' : 'Upload your CV to get started'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {profileStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="font-medium">{stat.value}%</span>
                  </div>
                  <Progress value={stat.value} className="h-2" />
                </div>
              ))}

              <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Interview Readiness</p>
                    <p className="text-xs text-muted-foreground">
                      Your current readiness is <span className="font-medium">{interviewReadinessScore}%</span>. Improve your CV and
                      profile for better matches.
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setProfileModalOpen(true)}>
                Improve Profile
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setCvModalOpen(true)}
              >
                <FileText className="w-4 h-4" />
                {userCV ? 'Manage CV' : 'Upload CV'}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setAlertModalOpen(true)}
              >
                <Search className="w-4 h-4" />
                Set Job Alerts
                {alerts.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {alerts.length}
                  </Badge>
                )}
              </Button>

              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="w-4 h-4" />
                Salary Insights
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <JobDetailsModal
        job={selectedJob}
        open={jobModalOpen}
        onOpenChange={setJobModalOpen}
        onApply={() => {}}
        onToggleSave={toggleSaveJob}
        isSaved={selectedJob ? isJobSaved(selectedJob.id) : false}
        hasApplied={false}
      />

      <CVUploadModal
        open={cvModalOpen}
        onOpenChange={setCvModalOpen}
        currentCV={userCV}
        onRefresh={refreshCV}
      />

      <JobAlertModal
        open={alertModalOpen}
        onOpenChange={setAlertModalOpen}
        alerts={alerts}
        onCreate={createAlert}
        onDelete={deleteAlert}
      />

      <ProfileImproveModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        userCV={userCV}
        jobs={allJobs}
        onRefresh={refreshCV}
      />

      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        jobTypeFilter={jobTypeFilter}
        onJobTypeChange={setJobTypeFilter}
      />

      <InterviewDialog
        open={prepDialogOpen}
        onOpenChange={setPrepDialogOpen}
        interview={selectedInterview}
      />
    </DashboardLayout>
  );
}
