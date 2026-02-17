import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  Clock,
  PoundSterling,
  BookmarkPlus,
  Bookmark,
  Send,
  FileText,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useJobs, Job } from '@/hooks/useJobs';
import { JobDetailsModal } from '@/components/jobs/JobDetailsModal';
import { CVUploadModal } from '@/components/jobs/CVUploadModal';
import { JobAlertModal } from '@/components/jobs/JobAlertModal';
import { ProfileImproveModal } from '@/components/jobs/ProfileImproveModal';
import { FilterSheet } from '@/components/jobs/FilterSheet';
import { useSubscription } from '@/hooks/useSubscription'
import { useNavigate } from 'react-router-dom';

export default function JobsDashboard() {
  const {
    jobs,
    allJobs,
    applications,
    savedJobs,
    alerts,
    userCV,
    loading,
    stats,
    searchQuery,
    setSearchQuery,
    locationQuery,
    setLocationQuery,
    jobTypeFilter,
    setJobTypeFilter,
    applyForJob,
    toggleSaveJob,
    createAlert,
    deleteAlert,
    refreshCV,
    isJobSaved,
    hasApplied
  } = useJobs();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { subscriptions}   = useSubscription();
  const navigate = useNavigate();
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview': return 'bg-green-600';
      case 'applied': return 'bg-blue-600';
      case 'reviewing': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  useEffect(() => {
     if (!loading && subscriptions && subscriptions.length === 0) 
      {
    navigate("/price");
    return;
   }
  }, [subscriptions, loading,]);

  const openJobDetails = (job: Job) => {
    setSelectedJob(job);
    setJobModalOpen(true);
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `£${(min/1000).toFixed(0)}k - £${(max/1000).toFixed(0)}k`;
    return min ? `From £${(min/1000).toFixed(0)}k` : `Up to £${(max!/1000).toFixed(0)}k`;
  };

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
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Jobs 💼</h1>
        <p className="text-muted-foreground">Discover career opportunities across the United Kingdom</p>
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
              {jobTypeFilter && <Badge variant="secondary" className="ml-1">1</Badge>}
            </Button>
            <Button variant="royal">Search Jobs</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.applied}</p>
              <p className="text-xs text-muted-foreground">Applied</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.interviews}</p>
              <p className="text-xs text-muted-foreground">Interviews</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <BookmarkPlus className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.saved}</p>
              <p className="text-xs text-muted-foreground">Saved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.views}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications & Jobs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Your Applications */}
          {applications.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold">Your Applications</h2>
              </div>
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <Card key={app.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{app.job?.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building className="w-4 h-4" />
                                {app.job?.company}
                              </div>
                            </div>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {app.job?.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <PoundSterling className="w-4 h-4" /> {formatSalary(app.job?.salary_min || null, app.job?.salary_max || null)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {app.job?.job_type}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => app.job && openJobDetails(app.job)}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Available Jobs */}
          <h2 className="font-serif text-xl font-bold pt-4">
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
                <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openJobDetails(job)}>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{job.title}</h3>
                          {hasApplied(job.id) && (
                            <Badge variant="outline" className="text-green-600 border-green-600">Applied</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Building className="w-4 h-4" />
                          {job.company}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <PoundSterling className="w-4 h-4" /> {formatSalary(job.salary_min, job.salary_max)}
                          </span>
                          <span className="text-xs">{job.job_type}</span>
                        </div>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => toggleSaveJob(job.id)}>
                          {isJobSaved(job.id) ? (
                            <Bookmark className="w-4 h-4 fill-current text-primary" />
                          ) : (
                            <BookmarkPlus className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="royal" size="sm" onClick={() => openJobDetails(job)} disabled={hasApplied(job.id)}>
                          {hasApplied(job.id) ? 'Applied' : 'Apply Now'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
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
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setCvModalOpen(true)}>
                <FileText className="w-4 h-4" />
                {userCV ? 'Manage CV' : 'Upload CV'}
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setAlertModalOpen(true)}>
                <Search className="w-4 h-4" />
                Set Job Alerts
                {alerts.length > 0 && <Badge variant="secondary" className="ml-auto">{alerts.length}</Badge>}
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
        onApply={applyForJob}
        onToggleSave={toggleSaveJob}
        isSaved={selectedJob ? isJobSaved(selectedJob.id) : false}
        hasApplied={selectedJob ? hasApplied(selectedJob.id) : false}
      />
      <CVUploadModal open={cvModalOpen} onOpenChange={setCvModalOpen} currentCV={userCV} onRefresh={refreshCV} />
      <JobAlertModal open={alertModalOpen} onOpenChange={setAlertModalOpen} alerts={alerts} onCreate={createAlert} onDelete={deleteAlert} />
      <ProfileImproveModal open={profileModalOpen} onOpenChange={setProfileModalOpen} userCV={userCV} jobs={allJobs} onRefresh={refreshCV} />
      <FilterSheet open={filterOpen} onOpenChange={setFilterOpen} jobTypeFilter={jobTypeFilter} onJobTypeChange={setJobTypeFilter} />
    </DashboardLayout>
  );
}
