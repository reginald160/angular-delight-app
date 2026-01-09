-- Create jobs table for available positions
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  job_type TEXT DEFAULT 'Full-time',
  description TEXT,
  requirements TEXT[],
  skills TEXT[],
  posted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_cvs table for storing CV metadata
CREATE TABLE public.user_cvs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  content_text TEXT, -- Extracted text for AI analysis
  analysis_result JSONB, -- AI analysis results
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  cv_id UUID REFERENCES public.user_cvs(id),
  status TEXT NOT NULL DEFAULT 'applied',
  cover_letter TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create saved_jobs table
CREATE TABLE public.saved_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create job_alerts table
CREATE TABLE public.job_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  keywords TEXT[],
  locations TEXT[],
  job_types TEXT[],
  min_salary INTEGER,
  is_active BOOLEAN DEFAULT true,
  email_frequency TEXT DEFAULT 'daily',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

-- Jobs are public to view
CREATE POLICY "Jobs are viewable by everyone"
ON public.jobs FOR SELECT USING (is_active = true);

-- User CVs policies
CREATE POLICY "Users can view their own CVs"
ON public.user_cvs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own CVs"
ON public.user_cvs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs"
ON public.user_cvs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs"
ON public.user_cvs FOR DELETE USING (auth.uid() = user_id);

-- Job applications policies
CREATE POLICY "Users can view their own applications"
ON public.job_applications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications"
ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
ON public.job_applications FOR UPDATE USING (auth.uid() = user_id);

-- Saved jobs policies
CREATE POLICY "Users can view their saved jobs"
ON public.saved_jobs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save jobs"
ON public.saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave jobs"
ON public.saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- Job alerts policies
CREATE POLICY "Users can view their own alerts"
ON public.job_alerts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts"
ON public.job_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
ON public.job_alerts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
ON public.job_alerts FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false);

-- Storage policies for CVs bucket
CREATE POLICY "Users can upload their own CVs to storage"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own CVs from storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CVs from storage"
ON storage.objects FOR DELETE
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert sample jobs for testing
INSERT INTO public.jobs (title, company, location, salary_min, salary_max, job_type, description, requirements, skills) VALUES
('Senior Software Engineer', 'Tech Corp Ltd', 'London', 75000, 95000, 'Full-time', 'We are looking for an experienced software engineer to join our team.', ARRAY['5+ years experience', 'Strong problem-solving skills', 'Team leadership experience'], ARRAY['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL']),
('Product Manager', 'Innovation Hub', 'Manchester', 65000, 80000, 'Full-time', 'Lead product strategy and execution for our SaaS platform.', ARRAY['3+ years PM experience', 'Technical background preferred', 'Agile methodology'], ARRAY['Product Strategy', 'Agile', 'Data Analysis', 'Stakeholder Management']),
('Data Analyst', 'Analytics Pro', 'Remote', 45000, 55000, 'Hybrid', 'Analyze data and provide insights to drive business decisions.', ARRAY['2+ years experience', 'Strong SQL skills', 'BI tool experience'], ARRAY['SQL', 'Python', 'Tableau', 'Excel', 'Statistics']),
('Full Stack Developer', 'StartUp UK', 'Bristol', 55000, 70000, 'Full-time', 'Build and maintain web applications from front to back.', ARRAY['3+ years full stack experience', 'Cloud experience', 'API design'], ARRAY['React', 'Node.js', 'AWS', 'MongoDB', 'GraphQL']),
('Technical Lead', 'Enterprise Solutions', 'Birmingham', 80000, 100000, 'Full-time', 'Lead a team of developers and architect solutions.', ARRAY['7+ years experience', 'Architecture experience', 'People management'], ARRAY['System Design', 'Microservices', 'DevOps', 'Team Leadership']),
('Frontend Developer', 'Creative Agency', 'London', 50000, 65000, 'Full-time', 'Create beautiful and performant user interfaces.', ARRAY['3+ years frontend experience', 'Design sensibility', 'Performance optimization'], ARRAY['React', 'TypeScript', 'CSS', 'Figma', 'Testing']),
('DevOps Engineer', 'Cloud Systems Inc', 'Edinburgh', 60000, 80000, 'Remote', 'Manage cloud infrastructure and CI/CD pipelines.', ARRAY['4+ years DevOps experience', 'Kubernetes expertise', 'Security mindset'], ARRAY['AWS', 'Kubernetes', 'Docker', 'Terraform', 'Jenkins']),
('UX Designer', 'Design Studio', 'London', 45000, 60000, 'Hybrid', 'Design user-centered experiences for web and mobile.', ARRAY['3+ years UX experience', 'Portfolio required', 'Research skills'], ARRAY['Figma', 'User Research', 'Prototyping', 'Wireframing', 'Design Systems']);