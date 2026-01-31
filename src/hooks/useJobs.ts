import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { authApi, AuthUser } from "@/services/AuthService";
import { jobService } from '@/services/jobService';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  job_type: string;
  description: string | null;
  requirements: string[] | null;
  skills: string[] | null;
  posted_at: string;
  created_at?: string;
  expires_at?: string | null;
  is_active: boolean;
}

export interface JobApplication {
  id: string;
  job_id: string;
  status: string;
  applied_at: string;
  job?: Job;
}

export interface SavedJob {
  id: string;
  job_id: string;
  saved_at: string;
  job?: Job;
}

export interface JobAlert {
  id: string;
  keywords: string[] | null;
  locations: string[] | null;
  job_types: string[] | null;
  min_salary: number | null;
  is_active: boolean;
  email_frequency: string;
}

export interface UserCV {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  content_text: string | null;
  analysis_result: CVAnalysis | null;
  is_primary: boolean;
  created_at: string;
}

export interface CVAnalysis {
  cvStrength: number;
  skillsMatch: number;
  profileCompletion: number;
  keyStrengths: string[];
  areasForImprovement: string[];
  missingSkills?: string[];
  recommendations: string[];
  overallSummary: string;
}

export interface FileUploadDto {
  id: string;            // Guid -> string in JSON
  name: string;
  userId: string;        // Guid -> string
  type: string;
  path: string;
  size: number;          // double -> number
  total: number;         // long -> number (safe up to 2^53-1)
  totalBytes: number;    // long -> number
  dateUpdated: string;   // DateTimeOffset -> ISO string
}


export function useJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [userCV, setUserCV] = useState<UserCV | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState<string | null>(null);

  // Fetch all jobs
  const fetchJobs = async () => {
    
    const { data, error } = await jobService.getAllJobs();

    if (error) {
      console.error('Error fetching jobs:', error);
      return;
    }
    setJobs(data || []);
  };

  // Fetch user's applications
  const fetchApplications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('job_applications')
      .select('*, job:jobs(*)')
      .eq('user_id', user.Id)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      return;
    }
    setApplications(data || []);
  };

  // Fetch saved jobs
  const fetchSavedJobs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_jobs')
      .select('*, job:jobs(*)')
      .eq('user_id', user.Id)
      .order('saved_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved jobs:', error);
      return;
    }
    setSavedJobs(data || []);
  };

  // Fetch job alerts
  const fetchAlerts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('user_id', user.Id);

    if (error) {
      console.error('Error fetching alerts:', error);
      return;
    }
    setAlerts(data || []);
  };

  // Fetch user's primary CV
  const fetchUserCV = async () => {
    if (!user) return;

     const result = await authApi.getCV(user.Email);
     if(result.error || !result.data) {
      console.error("Error fetching CV:", result.error);
      setUserCV(null);
      return;
     }
     
    setUserCV({
        id: result.data?.id || user.Id,
        file_name: result.data?.name || user.CV,
        file_path: result.data?.path || user.CV,
        file_size: result.data?.size || 1024,
        content_text: "sample CV text",
        analysis_result: null,
        is_primary: false,
        created_at: result.data.dateUpdated || new Date().toISOString(),
      });
    
     setUserCV({
        id: user.Id,
        file_name: user.CV,
        file_path: user.CV,
        file_size: 1024,
        content_text: "sample CV text",
        analysis_result: null,
        is_primary: false,
        created_at: new Date().toISOString(),
      });


  };

  // Apply for a job
  const applyForJob = async (jobId: string, coverLetter?: string) => {
    if (!user) {
      toast.error('Please sign in to apply');
      return false;
    }

    const { error } = await supabase
      .from('job_applications')
      .insert({
        user_id: user.Id,
        job_id: jobId,
        cv_id: userCV?.id,
        cover_letter: coverLetter,
        status: 'applied'
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('You have already applied for this job');
      } else {
        toast.error('Failed to submit application');
        console.error('Error applying:', error);
      }
      return false;
    }

    toast.success('Application submitted successfully!');
    await fetchApplications();
    return true;
  };

  // Save/unsave a job
  const toggleSaveJob = async (jobId: string) => {
    if (!user) {
      toast.error('Please sign in to save jobs');
      return;
    }

    const isSaved = savedJobs.some(s => s.job_id === jobId);

    if (isSaved) {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.Id)
        .eq('job_id', jobId);

      if (error) {
        toast.error('Failed to unsave job');
        return;
      }
      toast.success('Job removed from saved');
    } else {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({ user_id: user.Id, job_id: jobId });

      if (error) {
        toast.error('Failed to save job');
        return;
      }
      toast.success('Job saved!');
    }

    await fetchSavedJobs();
  };

  // Create job alert
  const createAlert = async (alert: Partial<JobAlert>) => {
    if (!user) {
      toast.error('Please sign in to create alerts');
      return false;
    }

    const { error } = await supabase
      .from('job_alerts')
      .insert({
        user_id: user.Id,
        keywords: alert.keywords,
        locations: alert.locations,
        job_types: alert.job_types,
        min_salary: alert.min_salary,
        email_frequency: alert.email_frequency || 'daily'
      });

    if (error) {
      toast.error('Failed to create alert');
      console.error('Error creating alert:', error);
      return false;
    }

    toast.success('Job alert created!');
    await fetchAlerts();
    return true;
  };

  // Delete job alert
  const deleteAlert = async (alertId: string) => {
    const { error } = await supabase
      .from('job_alerts')
      .delete()
      .eq('id', alertId);

    if (error) {
      toast.error('Failed to delete alert');
      return;
    }

    toast.success('Alert deleted');
    await fetchAlerts();
  };

  // Filter jobs based on search
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = !locationQuery ||
      job.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    const matchesType = !jobTypeFilter || job.job_type === jobTypeFilter;

    return matchesSearch && matchesLocation && matchesType;
  });

  // Get stats
  const stats = {
    applied: applications.length,
    interviews: applications.filter(a => a.status === 'interview').length,
    saved: savedJobs.length,
    views: 156 // Placeholder
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchJobs(),
        fetchApplications(),
        fetchSavedJobs(),
        fetchAlerts(),
        fetchUserCV()
      ]);
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    jobs: filteredJobs,
    allJobs: jobs,
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
    refreshCV: fetchUserCV,
    refreshApplications: fetchApplications,
    isJobSaved: (jobId: string) => savedJobs.some(s => s.job_id === jobId),
    hasApplied: (jobId: string) => applications.some(a => a.job_id === jobId)
  };
}
