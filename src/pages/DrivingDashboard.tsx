import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Car, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText,
  MapPin,
  Award,
  Play,
  Target
} from 'lucide-react';

const learningProgress = {
  theoryTest: {
    progress: 75,
    practiceTests: 12,
    averageScore: 85,
    passScore: 86,
  },
  practicalTest: {
    lessonsCompleted: 15,
    totalLessons: 30,
    nextLesson: 'Wednesday, 3:00 PM',
    instructor: 'Mike Johnson',
  },
};

const theoryTopics = [
  { name: 'Road Signs', progress: 100, status: 'complete' },
  { name: 'Road Rules', progress: 85, status: 'in_progress' },
  { name: 'Hazard Perception', progress: 60, status: 'in_progress' },
  { name: 'Vehicle Safety', progress: 40, status: 'in_progress' },
  { name: 'Environmental Issues', progress: 0, status: 'not_started' },
];

const upcomingEvents = [
  { type: 'lesson', title: 'Driving Lesson', date: 'Wed, Jan 17', time: '3:00 PM', instructor: 'Mike Johnson' },
  { type: 'test', title: 'Theory Test', date: 'Sat, Jan 27', time: '10:30 AM', location: 'DVSA Test Centre' },
];

const resources = [
  { title: 'Highway Code', description: 'Official guide to UK roads', icon: BookOpen },
  { title: 'Practice Tests', description: 'Mock theory exams', icon: FileText },
  { title: 'Find Test Centre', description: 'Book your test', icon: MapPin },
  { title: 'Video Lessons', description: 'Visual learning', icon: Play },
];

export default function DrivingDashboard() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Driving 🚗
        </h1>
        <p className="text-muted-foreground">
          Your journey to a UK driving license starts here
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">75%</p>
              <p className="text-xs text-muted-foreground">Theory Ready</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">15</p>
              <p className="text-xs text-muted-foreground">Lessons Done</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Practice Tests</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">85%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theory Test Progress */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Theory Test Preparation</CardTitle>
                  <CardDescription>Track your learning progress</CardDescription>
                </div>
                <Badge variant="outline" className={learningProgress.theoryTest.averageScore >= learningProgress.theoryTest.passScore ? 'border-green-600 text-green-600' : 'border-yellow-600 text-yellow-600'}>
                  {learningProgress.theoryTest.averageScore}% avg
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {theoryTopics.map((topic) => (
                  <div key={topic.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="flex items-center gap-2">
                        {topic.status === 'complete' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : topic.status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                        )}
                        {topic.name}
                      </span>
                      <span className="font-medium">{topic.progress}%</span>
                    </div>
                    <Progress value={topic.progress} className="h-2" />
                  </div>
                ))}
                <Button variant="royal" className="w-full mt-4 gap-2">
                  <Play className="w-4 h-4" />
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Practical Lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Practical Lessons</CardTitle>
              <CardDescription>
                {learningProgress.practicalTest.lessonsCompleted} of {learningProgress.practicalTest.totalLessons} lessons completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress 
                  value={(learningProgress.practicalTest.lessonsCompleted / learningProgress.practicalTest.totalLessons) * 100} 
                  className="h-3"
                />
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Next Lesson</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {learningProgress.practicalTest.nextLesson}
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    {learningProgress.practicalTest.instructor}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1">Reschedule</Button>
                <Button variant="outline" className="flex-1">Book More</Button>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          <h2 className="font-serif text-xl font-bold pt-4">Learning Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.title} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {event.type === 'lesson' ? (
                      <Car className="w-4 h-4 text-blue-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-green-600" />
                    )}
                    <span className="font-medium text-sm">{event.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{event.date} at {event.time}</p>
                    {event.instructor && <p>Instructor: {event.instructor}</p>}
                    {event.location && (
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar className="w-4 h-4" />
                Book Theory Test
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Car className="w-4 h-4" />
                Find Instructor
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Apply for License
              </Button>
            </CardContent>
          </Card>

          {/* License Exchange */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">License Exchange</CardTitle>
              <CardDescription>
                Already have a foreign license? You may be able to exchange it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="royal" className="w-full">
                Check Eligibility
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
