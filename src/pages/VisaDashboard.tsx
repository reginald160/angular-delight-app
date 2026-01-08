import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Download,
  Calendar,
  MapPin
} from 'lucide-react';

const visaApplications = [
  {
    id: 1,
    type: 'Skilled Worker Visa',
    status: 'in_progress',
    progress: 65,
    submittedDate: '2024-01-15',
    expectedDecision: '2024-03-15',
    reference: 'GWF0123456789',
  },
  {
    id: 2,
    type: 'Spouse Visa',
    status: 'approved',
    progress: 100,
    submittedDate: '2023-11-01',
    decisionDate: '2024-01-10',
    reference: 'GWF9876543210',
  },
];

const visaTypes = [
  { name: 'Skilled Worker', description: 'For employment with a UK sponsor', duration: '5 years' },
  { name: 'Student Visa', description: 'For studying at UK institutions', duration: '2-5 years' },
  { name: 'Family Visa', description: 'For joining family in the UK', duration: '2.5-5 years' },
  { name: 'Visitor Visa', description: 'For tourism and short visits', duration: '6 months' },
];

const requiredDocuments = [
  { name: 'Valid Passport', status: 'complete' },
  { name: 'Proof of English', status: 'complete' },
  { name: 'Financial Evidence', status: 'pending' },
  { name: 'Tuberculosis Test', status: 'not_started' },
  { name: 'Criminal Record Certificate', status: 'pending' },
];

export default function VisaDashboard() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Visa Support 🛂
          </h1>
          <p className="text-muted-foreground">
            Track your visa applications and access immigration resources
          </p>
        </div>
        <Button variant="royal" className="gap-2">
          <Plus className="w-4 h-4" />
          New Application
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Applications</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-xs text-muted-foreground">Days to Decision</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-serif text-xl font-bold">Your Applications</h2>
          {visaApplications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{app.type}</CardTitle>
                    <CardDescription>Ref: {app.reference}</CardDescription>
                  </div>
                  <Badge variant={app.status === 'approved' ? 'default' : 'secondary'}>
                    {app.status === 'approved' ? 'Approved' : 'In Progress'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{app.progress}%</span>
                    </div>
                    <Progress value={app.progress} className="h-2" />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Submitted: {app.submittedDate}
                    </div>
                    {app.expectedDecision && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Expected: {app.expectedDecision}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Documents
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Visa Types */}
          <h2 className="font-serif text-xl font-bold pt-4">Explore Visa Types</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {visaTypes.map((visa) => (
              <Card key={visa.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{visa.name}</CardTitle>
                  <CardDescription>{visa.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{visa.duration}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Checklist</CardTitle>
              <CardDescription>Required documents for your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requiredDocuments.map((doc) => (
                  <div key={doc.name} className="flex items-center gap-3">
                    {doc.status === 'complete' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : doc.status === 'pending' ? (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className={`text-sm ${doc.status === 'complete' ? 'line-through text-muted-foreground' : ''}`}>
                      {doc.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MapPin className="w-4 h-4" />
                Find Visa Center
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar className="w-4 h-4" />
                Book Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" />
                Immigration Rules
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
