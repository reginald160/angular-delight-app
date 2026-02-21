
-- Table for interviews secured for users
CREATE TABLE public.user_interviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  interview_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  interview_type TEXT NOT NULL DEFAULT 'in-person',
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  admin_notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interviews" ON public.user_interviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage interviews" ON public.user_interviews
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_user_interviews_updated_at
  BEFORE UPDATE ON public.user_interviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table for jobs applied by admin on behalf of users
CREATE TABLE public.admin_job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  job_type TEXT DEFAULT 'Full-time',
  applied_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'applied',
  notes TEXT,
  admin_notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own admin applications" ON public.admin_job_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage admin applications" ON public.admin_job_applications
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_admin_job_applications_updated_at
  BEFORE UPDATE ON public.admin_job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
