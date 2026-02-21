import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { authApi, AuthUser } from "@/services/AuthService";
import axios from "axios";
import { CVAnalysis } from './useJobs';

export function useCVUpload(onSuccess?: () => void) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const uploadCV = async (file: File) => {
    if (!user) {
      toast.error('Please sign in to upload your CV');
      return null;
    }

    if (!file.type.includes('pdf') && !file.type.includes('word') && !file.type.includes('document')) {
      toast.error('Please upload a PDF or Word document');
      return null;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return null;
    }

    setUploading(true);

    try {
      // Upload to storage
      const fileName = `${Date.now()}-${file.name}`;
       const formData = new FormData();
      formData.append("file", file, fileName); // must match API parameter name: IFormFile file
        const endpoint = authApi.getBaseUrl() + "/files/upload";

        const token = localStorage.getItem("accessToken");
       const response = await axios.post(endpoint, formData, {
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
 
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const percent = Math.round((evt.loaded * 100) / evt.total);
          //setProgress(percent);
        },
      });

      if(response.status !== 200) {

        toast.error('Failed to upload CV');
        return;
      }

      const filePath = response.data.filePath;
         setUploading(false);
      
      toast.success('CV uploaded successfully!');
      onSuccess?.();
      return filePath;
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error('Failed to upload CV');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const analyzeCV = async (cvId: string, cvText: string, job?: { title: string; description?: string | null; skills?: string[] | null }) => {
    if (!user) {
      toast.error('Please sign in');
      return null;
    }

    setAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-cv', {
        body: {
          cvText: cvText || 'CV content not available. Please provide general feedback for improving a CV.',
          jobTitle: job?.title || 'General Position',
          jobDescription: job?.description || '',
          jobSkills: job?.skills || []
        }
      });

      if (error) {
        throw error;
      }

      if (data?.analysis) {
        
       
        // Save analysis results to the CV record
        await  authApi.UpdateCVAnalysis(data?.analysis);
     

        toast.success('CV analysis complete!');
        onSuccess?.();
        return data.analysis;
      }

      throw new Error('No analysis returned');
    } catch (error) {
      console.error('Error analyzing CV:', error);
      toast.error('Failed to analyze CV. Please try again.');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteCV = async (cvId: string, filePath: string) => {
    try {
      // Delete from storage

      const response = await authApi.deleteCVFile();
      if (response.error) {
        console.error('Error deleting CV:', response.error);
        toast.error('Failed to delete CV');
        return;
      }
      
      toast.success('CV deleted');
      onSuccess?.();
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error('Failed to delete CV');
    }
  };

  return {
    uploadCV,
    analyzeCV,
    deleteCV,
    uploading,
    analyzing
  };
}
