import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/hooks/useJobs';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  phone: string | null;
  created_at: string;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const checkAdminRole = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs((data || []) as Job[]);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const createJob = async (job: Omit<Job, 'id' | 'created_at' | 'posted_at'>) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert(job)
        .select()
        .single();

      if (error) throw error;
      
      setJobs(prev => [data as Job, ...prev]);
      toast({
        title: 'Success',
        description: 'Job created successfully'
      });
      return data;
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job',
        variant: 'destructive'
      });
      return null;
    }
  };

  const updateJob = async (jobId: string, updates: Partial<Job>) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;
      
      setJobs(prev => prev.map(j => j.id === jobId ? data as Job : j));
      toast({
        title: 'Success',
        description: 'Job updated successfully'
      });
      return data;
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job',
        variant: 'destructive'
      });
      return null;
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      
      setJobs(prev => prev.filter(j => j.id !== jobId));
      toast({
        title: 'Success',
        description: 'Job deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete job',
        variant: 'destructive'
      });
    }
  };

  const sendNotification = async (
    userId: string | 'all',
    title: string,
    message: string,
    type: string = 'info'
  ) => {
    if (!user) return;

    try {
      if (userId === 'all') {
        // Send to all users
        const { data: allUsers } = await supabase
          .from('profiles')
          .select('user_id');

        if (allUsers) {
          const notifications = allUsers.map(u => ({
            user_id: u.user_id,
            title,
            message,
            type,
            created_by: user.id
          }));

          const { error } = await supabase
            .from('notifications')
            .insert(notifications);

          if (error) throw error;
        }
      } else {
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            title,
            message,
            type,
            created_by: user.id
          });

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Notification sent successfully'
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send notification',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchJobs();
    }
  }, [isAdmin]);

  return {
    isAdmin,
    loading,
    users,
    jobs,
    createJob,
    updateJob,
    deleteJob,
    sendNotification,
    refreshUsers: fetchUsers,
    refreshJobs: fetchJobs
  };
};
