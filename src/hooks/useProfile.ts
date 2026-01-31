import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {authApi, AuthUser, RecentActivity} from "@/services/AuthService";
import { useToast } from '@/hooks/use-toast';
import { AlarmClock } from 'lucide-react';

export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setUserActivities] = useState<RecentActivity[] | null>([]);

  const fetchUserActivities = async ()=> {
    
    try {
      const { data, error } = await  authApi.getUserActivities();
      if (error) throw error;
      setUserActivities(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }

  }
  const fetchProfile = async () => {

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await  authApi.getCurrentUser("");
      if (error) throw error;
      setProfile({
        id: data.Id,
        user_id: data.Id,
        first_name: data.FirstName,
        last_name: data.LastName,
        phone: data.Phone,
        avatar_url: null,
        created_at: '',
        updated_at: ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return null;

    try {
      const { data, error } = await authApi.UpdateProfile(
        updates.first_name || '',
        updates.last_name || '',
        updates.phone || ''
      )

      if (error) throw error;    
      setProfile({
        id: data.Id,
        user_id: data.Id,
        first_name: data.FirstName,
        last_name: data.LastName,
        phone: data.Phone,
        avatar_url: null,
        created_at: '',
        updated_at: ''
      } );
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
      return null;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    fetchUserActivities,
    recentActivities,
    updateProfile,
    refresh: fetchProfile
  };
};
