import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Read file content as text (for PDFs, we'll just store the filename for now)
      let contentText = '';
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        contentText = await file.text();
      }

      // Mark all existing CVs as non-primary
      await supabase
        .from('user_cvs')
        .update({ is_primary: false })
        .eq('user_id', user.id);

      // Save CV metadata
      const { data: cvData, error: dbError } = await supabase
        .from('user_cvs')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          content_text: contentText || null,
          is_primary: true
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      toast.success('CV uploaded successfully!');
      onSuccess?.();
      return cvData;
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
        await supabase
          .from('user_cvs')
          .update({ analysis_result: data.analysis })
          .eq('id', cvId);

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
      await supabase.storage.from('cvs').remove([filePath]);
      
      // Delete from database
      await supabase.from('user_cvs').delete().eq('id', cvId);
      
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
