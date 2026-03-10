import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Home, Briefcase, Car, ArrowRight, CheckCircle, Clock, AlertCircle, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/AuthService';
import { useProfile } from '@/hooks/useProfile';
import { useJobs } from '@/hooks/useJobs';
import { CVUploadModal } from '@/components/jobs/CVUploadModal';
import { ProfileImproveModal } from '@/components/jobs/ProfileImproveModal';
import { useEffect, useState } from 'react';
import FormattedDateTime from '@/components/ui/datetime';
import { useNavigate } from 'react-router-dom';



const services = [
  {
    title: 'Visa Support',
    description: 'Track your visa applications and get expert guidance',
    icon: FileText,
    path: '/dashboard/visa',
    color: 'bg-blue-500/10 text-blue-600',
    stats: { active: 2, pending: 1 },
  },
  {
    title: 'Housing',
    description: 'Find your perfect home in the UK',
    icon: Home,
    path: '/dashboard/housing',
    color: 'bg-green-500/10 text-green-600',
    stats: { saved: 5, viewed: 12 },
  },
  {
    title: 'Jobs',
    description: 'Discover career opportunities across the UK',
    icon: Briefcase,
    path: '/dashboard/jobs',
    color: 'bg-purple-500/10 text-purple-600',
    stats: { applied: 3, interviews: 1 },
  },
  {
    title: 'Driving',
    description: 'License conversion and driving resources',
    icon: Car,
    path: '/dashboard/driving',
    color: 'bg-orange-500/10 text-orange-600',
    stats: { progress: '60%', tests: 2 },
  },
];


const recentActivity = [
  { type: 'visa', message: 'Visa application status updated', time: '2 hours ago', status: 'success' },
  { type: 'job', message: 'New job match found', time: '5 hours ago', status: 'info' },
  { type: 'housing', message: 'Viewing scheduled for tomorrow', time: '1 day ago', status: 'pending' },
  { type: 'driving', message: 'Theory test booking confirmed', time: '2 days ago', status: 'success' },
];

export default function Dashboard() {
  
  const { user,refreshUser } = useAuth();
  const firstName = user?.FirstName;
  const { fetchUserActivities, recentActivities } = useProfile();
  const { userCV, userCVAnalysis, refreshCV, allJobs } = useJobs();
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const profileStats = userCVAnalysis ? [
    { label: 'Profile Completion', value: userCVAnalysis.profileCompletion },
    { label: 'CV Strength', value: userCVAnalysis.cvStrength },
    { label: 'Skills Match', value: userCVAnalysis.skillsMatch },
  ] : [
    { label: 'Profile Completion', value: 0 },
    { label: 'CV Strength', value: 0 },
    { label: 'Skills Match', value: 0 },
  ];

  useEffect(() => {
    refreshUser();
    fetchUserActivities();
  }, []);

//   useEffect(() => {
//   if (user && user.profileCompleted === false) {
//     navigate('/completeProfile', { replace: true });
//   }
// }, [user, navigate]);


  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your UK journey. Select a service to get started.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Action Needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      {/* <h2 className="font-serif text-xl font-bold text-foreground mb-4">Your Services</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.path} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${service.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Link to={service.path}>
                    <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={service.path}>
                  <Button variant="outline" className="w-full">
                    Go to {service.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div> */}

      {/* Bottom Grid: Recent Activity + Profile Strength & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500/10' :
                      activity.status === 'pending' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : activity.status === 'pending' ? (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.message}</p>
                     
                      <p>
                         <FormattedDateTime 
                    dateString={activity.time} 
                    className="text-xs text-muted-foreground" 
                     />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Profile Strength & Quick Actions */}
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
           
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CVUploadModal open={cvModalOpen} onOpenChange={setCvModalOpen} currentCV={userCV} onRefresh={refreshCV} />
      <ProfileImproveModal open={profileModalOpen} onOpenChange={setProfileModalOpen} userCV={userCV} jobs={allJobs} onRefresh={refreshCV} />
    </DashboardLayout>
  );
}
