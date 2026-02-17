import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Home, Briefcase, Car, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/AuthService';
import { useProfile } from '@/hooks/useProfile';
import { useEffect, useMemo } from 'react';
import { SERVICE_CONFIG } from '@/services/appService';

const ALL_SERVICES = [
  {
    id: 'visa',
    title: 'Visa Support',
    description: 'Track your visa applications and get expert guidance',
    icon: FileText,
    path: '/dashboard/visa',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    id: 'housing',
    title: 'Housing',
    description: 'Find your perfect home in the UK',
    icon: Home,
    path: '/dashboard/housing',
    color: 'bg-green-500/10 text-green-600',
  },
  {
    id: 'jobs',
    title: 'Jobs',
    description: 'Discover career opportunities across the UK',
    icon: Briefcase,
    path: '/dashboard/jobs',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    id: 'driving',
    title: 'Driving',
    description: 'License conversion and driving resources',
    icon: Car,
    path: '/dashboard/driving',
    color: 'bg-orange-500/10 text-orange-600',
  },
];

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
  const { user } = useAuth();
  const firstName = user?.firstName;   // User metadata not available from custom API
  const {fetchUserActivities, recentActivities} = useProfile();

  const enabledServices = useMemo(() => {
    return services.filter(service => 
      SERVICE_CONFIG[service.id as keyof typeof SERVICE_CONFIG]
    );
  }, []);

  useEffect(() => {
  fetchUserActivities();
}, []);


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

      {/* Services Grid - Only display if enabled in SERVICE_CONFIG */}
      <h2 className="font-serif text-xl font-bold text-foreground mb-4">Your Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {useMemo(() => 
          ALL_SERVICES.filter(service => 
            SERVICE_CONFIG[service.id as keyof typeof SERVICE_CONFIG]
          ), []).map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-xl ${service.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <Link to={service.path}>
                    <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
                <CardTitle className="text-xl mt-4">{service.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={service.path}>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Access {service.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State Fallback */}
      {useMemo(() => 
        ALL_SERVICES.filter(service => 
          SERVICE_CONFIG[service.id as keyof typeof SERVICE_CONFIG]
        ), []).length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl mb-8">
          <p className="text-muted-foreground">No services are currently active for your portal.</p>
        </div>
      )}

      {/* Recent Activity */}
      <h2 className="font-serif text-xl font-bold text-foreground mb-4">Recent Activity</h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
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
                    <p className="text-xs text-muted-foreground">
                    {new Date(activity.time).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>

                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-muted-foreground">No recent activity to show.</p>
            )}
          </div>
        </CardContent>
      </Card>

    </DashboardLayout>
  );
}
