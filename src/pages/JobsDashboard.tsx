import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Briefcase,
  Send,
  FileText,
  TrendingUp,
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  MapPin,
  Eye,
  BarChart3,
  Users,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { useJobs, Job } from '@/hooks/useJobs';
import { JobDetailsModal } from '@/components/jobs/JobDetailsModal';
import { CVUploadModal } from '@/components/jobs/CVUploadModal';
import { ProfileImproveModal } from '@/components/jobs/ProfileImproveModal';

export default function JobsDashboard() {
  const {
    allJobs,
    applications,
    savedJobs,
    userCV,
    loading,
    stats,
    applyForJob,
    toggleSaveJob,
    refreshCV,
    isJobSaved,
    hasApplied
  } = useJobs();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activityTab, setActivityTab] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'interview':
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 gap-1"><Calendar className="w-3 h-3" /> Interview</Badge>;
      case 'applied':
        return <Badge className="bg-blue-600 hover:bg-blue-700 gap-1"><Send className="w-3 h-3" /> Applied</Badge>;
      case 'reviewing':
        return <Badge className="bg-amber-600 hover:bg-amber-700 gap-1"><Eye className="w-3 h-3" /> Reviewing</Badge>;
      case 'offered':
        return <Badge className="bg-violet-600 hover:bg-violet-700 gap-1"><ThumbsUp className="w-3 h-3" /> Offered</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600 hover:bg-red-700 gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      case 'accepted':
        return <Badge className="bg-green-600 hover:bg-green-700 gap-1"><CheckCircle2 className="w-3 h-3" /> Accepted</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> {status}</Badge>;
    }
  };

  const openJobDetails = (job: Job) => {
    setSelectedJob(job);
    setJobModalOpen(true);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `£${(min / 1000).toFixed(0)}k - £${(max / 1000).toFixed(0)}k`;
    return min ? `From £${(min / 1000).toFixed(0)}k` : `Up to £${(max! / 1000).toFixed(0)}k`;
  };

  // Derive interview-specific data
  const interviews = applications.filter(a => a.status === 'interview');
  const reviewing = applications.filter(a => a.status === 'reviewing');
  const offered = applications.filter(a => a.status === 'offered');
  const rejected = applications.filter(a => a.status === 'rejected');

  const filteredApplications = activityTab === 'all'
    ? applications
    : applications.filter(a => a.status === activityTab);

  // Stats calculations
  const totalApplications = applications.length;
  const interviewRate = totalApplications > 0
    ? Math.round((interviews.length / totalApplications) * 100)
    : 0;
  const successRate = totalApplications > 0
    ? Math.round((offered.length / totalApplications) * 100)
    : 0;

  const profileStats = userCV?.analysis_result ? [
    { label: 'Profile Completion', value: userCV.analysis_result.profileCompletion },
    { label: 'CV Strength', value: userCV.analysis_result.cvStrength },
    { label: 'Skills Match', value: userCV.analysis_result.skillsMatch },
  ] : [
    { label: 'Profile Completion', value: 0 },
    { label: 'CV Strength', value: 0 },
    { label: 'Skills Match', value: 0 },
  ];

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
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Job Activity 💼</h1>
        <p className="text-muted-foreground">Track your applications, interviews, and career progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalApplications}</p>
              <p className="text-xs text-muted-foreground">Total Applied</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{interviews.length}</p>
              <p className="text-xs text-muted-foreground">Interviews</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/10">
              <ThumbsUp className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{offered.length}</p>
              <p className="text-xs text-muted-foreground">Offers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{interviewRate}%</p>
              <p className="text-xs text-muted-foreground">Interview Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{successRate}%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Activity Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Interviews */}
          {interviews.length > 0 && (
            <Card className="border-emerald-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
                </div>
                <CardDescription>Your scheduled interviews</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {interviews.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    onClick={() => app.job && openJobDetails(app.job)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-600/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{app.job?.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Building className="w-3 h-3" />{app.job?.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{app.job?.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-600">Interview</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* All Applications Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Application Activity</CardTitle>
                  <CardDescription>Complete history of your job applications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activityTab} onValueChange={setActivityTab} className="w-full">
                <TabsList className="mb-4 w-full justify-start flex-wrap h-auto gap-1">
                  <TabsTrigger value="all" className="text-xs">All ({applications.length})</TabsTrigger>
                  <TabsTrigger value="applied" className="text-xs">Applied ({applications.filter(a => a.status === 'applied').length})</TabsTrigger>
                  <TabsTrigger value="reviewing" className="text-xs">Reviewing ({reviewing.length})</TabsTrigger>
                  <TabsTrigger value="interview" className="text-xs">Interview ({interviews.length})</TabsTrigger>
                  <TabsTrigger value="offered" className="text-xs">Offered ({offered.length})</TabsTrigger>
                  <TabsTrigger value="rejected" className="text-xs">Rejected ({rejected.length})</TabsTrigger>
                </TabsList>

                <TabsContent value={activityTab}>
                  {filteredApplications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-muted-foreground/40 mb-3" />
                      <p className="text-muted-foreground font-medium">No applications found</p>
                      <p className="text-sm text-muted-foreground/70">
                        {activityTab === 'all' ? "You haven't applied to any jobs yet." : `No applications with "${activityTab}" status.`}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Position</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Salary</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applied</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredApplications.map((app) => (
                            <TableRow key={app.id} className="cursor-pointer" onClick={() => app.job && openJobDetails(app.job)}>
                              <TableCell className="font-medium">{app.job?.title || 'N/A'}</TableCell>
                              <TableCell>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Building className="w-3 h-3" />{app.job?.company || 'N/A'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="w-3 h-3" />{app.job?.location || 'N/A'}
                                </span>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatSalary(app.job?.salary_min || null, app.job?.salary_max || null)}
                              </TableCell>
                              <TableCell>{getStatusBadge(app.status)}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </TableCell>
                              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" onClick={() => app.job && openJobDetails(app.job)}>
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Interview Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Pipeline Overview
              </CardTitle>
              <CardDescription>Your application funnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Applied', count: applications.filter(a => a.status === 'applied').length, color: 'bg-blue-600' },
                { label: 'Reviewing', count: reviewing.length, color: 'bg-amber-500' },
                { label: 'Interview', count: interviews.length, color: 'bg-emerald-600' },
                { label: 'Offered', count: offered.length, color: 'bg-violet-600' },
                { label: 'Rejected', count: rejected.length, color: 'bg-red-500' },
              ].map((stage) => (
                <div key={stage.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{stage.label}</span>
                    <span className="font-semibold">{stage.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stage.color} transition-all`}
                      style={{ width: `${totalApplications > 0 ? (stage.count / totalApplications) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Modals */}
      <JobDetailsModal
        job={selectedJob}
        open={jobModalOpen}
        onOpenChange={setJobModalOpen}
        onApply={applyForJob}
        onToggleSave={toggleSaveJob}
        isSaved={selectedJob ? isJobSaved(selectedJob.id) : false}
        hasApplied={selectedJob ? hasApplied(selectedJob.id) : false}
      />
      <CVUploadModal open={cvModalOpen} onOpenChange={setCvModalOpen} currentCV={userCV} onRefresh={refreshCV} />
      <ProfileImproveModal open={profileModalOpen} onOpenChange={setProfileModalOpen} userCV={userCV} jobs={allJobs} onRefresh={refreshCV} />
    </DashboardLayout>
  );
}
