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
  Send,
  FileText,
  TrendingUp
} from 'lucide-react';

const jobApplications = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Tech Corp Ltd',
    location: 'London',
    salary: '75,000 - 95,000',
    status: 'interview',
    appliedDate: '2024-01-10',
    type: 'Full-time',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Innovation Hub',
    location: 'Manchester',
    salary: '65,000 - 80,000',
    status: 'applied',
    appliedDate: '2024-01-12',
    type: 'Full-time',
  },
  {
    id: 3,
    title: 'Data Analyst',
    company: 'Analytics Pro',
    location: 'Remote',
    salary: '45,000 - 55,000',
    status: 'reviewing',
    appliedDate: '2024-01-14',
    type: 'Hybrid',
  },
];

const recommendedJobs = [
  {
    id: 1,
    title: 'Full Stack Developer',
    company: 'StartUp UK',
    location: 'Bristol',
    salary: '55,000 - 70,000',
    posted: '2 days ago',
    match: 95,
  },
  {
    id: 2,
    title: 'Technical Lead',
    company: 'Enterprise Solutions',
    location: 'Birmingham',
    salary: '80,000 - 100,000',
    posted: '1 day ago',
    match: 88,
  },
];

const profileStats = [
  { label: 'Profile Completion', value: 85 },
  { label: 'CV Strength', value: 72 },
  { label: 'Skills Match', value: 90 },
];

export default function JobsDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview': return 'bg-green-600';
      case 'applied': return 'bg-blue-600';
      case 'reviewing': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Jobs 💼
        </h1>
        <p className="text-muted-foreground">
          Discover career opportunities across the United Kingdom
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Job title, skills, or company..." className="pl-10" />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="City or postcode..." className="pl-10" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
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
              <p className="text-2xl font-bold">3</p>
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
              <p className="text-2xl font-bold">1</p>
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
              <p className="text-2xl font-bold">8</p>
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
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold">Your Applications</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="space-y-4">
            {jobApplications.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{job.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="w-4 h-4" />
                            {job.company}
                          </div>
                        </div>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <PoundSterling className="w-4 h-4" /> {job.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {job.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recommended Jobs */}
          <h2 className="font-serif text-xl font-bold pt-4">Recommended For You</h2>
          <div className="space-y-4">
            {recommendedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {job.match}% Match
                        </Badge>
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
                          <PoundSterling className="w-4 h-4" /> {job.salary}
                        </span>
                        <span className="text-xs">{job.posted}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <BookmarkPlus className="w-4 h-4" />
                      </Button>
                      <Button variant="royal" size="sm">Apply Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Strength */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Strength</CardTitle>
              <CardDescription>Improve your profile to get more matches</CardDescription>
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
              <Button variant="outline" className="w-full">
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
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Upload CV
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Search className="w-4 h-4" />
                Set Job Alerts
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="w-4 h-4" />
                Salary Insights
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
