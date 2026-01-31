import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/hooks/useJobs';
import { LoginUser } from '@/services/AuthService';
import { authApi } from '@/services/AuthService';
import {CreateNotificationRequest, notificationService} from '@/services/NotificationService'
import {jobService} from '@/services/jobService'
interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string;
  phone: string | null;
  created_at: string;
  is_locked : boolean
}

export const useAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const checkAdminRole = async () => {
  
    try {

     const authUser = localStorage.getItem("authUser");
     const currentUser = JSON.parse(authUser) as LoginUser;
    if (!currentUser) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    if(currentUser.role === "Admin")
    {
      setIsAdmin(true);
         setLoading(false);
    }
    else{
          setIsAdmin(false);
          setLoading(false);
    }
   
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }

  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await authApi.getUsers();

      if (error) throw error;
      setUsers( (data || []) as unknown as UserProfile []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

    const handleLock = async ( userId: string) => {
    try {
      const { data, error } = await authApi.lockUp(userId);
      // if (error) throw error;
      // setUsers( (data || []) as unknown as UserProfile []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchJobs = async () => {
    
    try {
      const { data, error } = await  jobService.getAllJobs();

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
  const newNotification : CreateNotificationRequest =  {
            user_id: userId,
            title,
            message,
            type

          }
    try {
      if (userId === 'all') {
        // Send to all users
        // const { data: allUsers } = await authApi.getUsers()
         newNotification.user_id = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
        const{error} = await notificationService.SendNotificationToAllAsync(newNotification);
             
          if (error) throw error;


      } else {
       
        const { error } = await  notificationService.SendNotificationAsync(newNotification)
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
    handleLock,
    sendNotification,
    refreshUsers: fetchUsers,
    refreshJobs: fetchJobs
  };
};
