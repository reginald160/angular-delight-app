import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Target, 
  TrendingUp,
  Loader2,
  FileText,
  Lightbulb
} from 'lucide-react';
import { UserCV, CVAnalysis, Job } from '@/hooks/useJobs';
import { useCVUpload } from '@/hooks/useCVUpload';
import { useState } from 'react';

interface ProfileImproveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userCV: UserCV | null;
  jobs: Job[];
  onRefresh: () => void;
}

export function ProfileImproveModal({ open, onOpenChange, userCV, jobs, onRefresh }: ProfileImproveModalProps) {
  const { analyzeCV, analyzing } = useCVUpload(onRefresh);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [manualCVText, setManualCVText] = useState('');

  const analysis = userCV?.analysis_result;

  const handleAnalyze = async () => {
    if (!userCV) return;
    
    const selectedJob = jobs.find(j => j.id === selectedJobId);
    const cvText = userCV.content_text || manualCVText || 'Please analyze based on general job market standards.';
    
    await analyzeCV(userCV.id, cvText, selectedJob ? {
      title: selectedJob.title,
      description: selectedJob.description,
      skills: selectedJob.skills
    } : undefined);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Improve Your Profile
          </DialogTitle>
          <DialogDescription>
            Get AI-powered insights to strengthen your CV and increase your match rate
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {!userCV ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Please upload your CV first to get personalized insights.</p>
            </div>
          ) : (
            <>
              {/* Analysis Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Analyze Your CV</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Compare against a specific job (optional)</Label>
                    <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a job to compare..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Analysis</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title} at {job.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!userCV.content_text && (
                    <div>
                      <Label>Paste your CV content for analysis</Label>
                      <Textarea
                        placeholder="Copy and paste your CV text here for AI analysis..."
                        value={manualCVText}
                        onChange={(e) => setManualCVText(e.target.value)}
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <Button 
                    onClick={handleAnalyze} 
                    disabled={analyzing}
                    className="w-full"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        {analysis ? 'Re-analyze CV' : 'Analyze CV'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {analysis && (
                <>
                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className={`text-3xl font-bold ${getScoreColor(analysis.cvStrength)}`}>
                          {analysis.cvStrength}%
                        </p>
                        <p className="text-sm text-muted-foreground">CV Strength</p>
                        <Progress 
                          value={analysis.cvStrength} 
                          className={`h-1 mt-2 [&>div]:${getProgressColor(analysis.cvStrength)}`} 
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className={`text-3xl font-bold ${getScoreColor(analysis.skillsMatch)}`}>
                          {analysis.skillsMatch}%
                        </p>
                        <p className="text-sm text-muted-foreground">Skills Match</p>
                        <Progress 
                          value={analysis.skillsMatch} 
                          className={`h-1 mt-2 [&>div]:${getProgressColor(analysis.skillsMatch)}`} 
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className={`text-3xl font-bold ${getScoreColor(analysis.profileCompletion)}`}>
                          {analysis.profileCompletion}%
                        </p>
                        <p className="text-sm text-muted-foreground">Completion</p>
                        <Progress 
                          value={analysis.profileCompletion} 
                          className={`h-1 mt-2 [&>div]:${getProgressColor(analysis.profileCompletion)}`} 
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Summary */}
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-muted-foreground">{analysis.overallSummary}</p>
                    </CardContent>
                  </Card>

                  {/* Strengths */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Key Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.keyStrengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Areas for Improvement */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.areasForImprovement.map((area, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                            {area}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Missing Skills */}
                  {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Target className="w-4 h-4 text-red-600" />
                          Missing Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingSkills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-red-600 border-red-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommendations */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
