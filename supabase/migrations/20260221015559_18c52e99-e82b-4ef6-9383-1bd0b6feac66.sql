
-- Replace overly broad FOR ALL policies with specific ones

DROP POLICY "Admins can manage interviews" ON public.user_interviews;
CREATE POLICY "Admins can select interviews" ON public.user_interviews FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert interviews" ON public.user_interviews FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update interviews" ON public.user_interviews FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete interviews" ON public.user_interviews FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "Admins can manage admin applications" ON public.admin_job_applications;
CREATE POLICY "Admins can select admin applications" ON public.admin_job_applications FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert admin applications" ON public.admin_job_applications FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update admin applications" ON public.admin_job_applications FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete admin applications" ON public.admin_job_applications FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
