import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Briefcase, CheckCircle, Loader2, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/services/AuthService';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const industries = [
  { value: 'healthcare', label: 'Healthcare & Medical' },
  { value: 'it', label: 'Information Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'education', label: 'Education' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'retail', label: 'Retail & Sales' },
  { value: 'construction', label: 'Construction' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'logistics', label: 'Logistics & Transport' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'nonprofit', label: 'Non-Profit & NGO' },
  { value: 'government', label: 'Government & Public Sector' },
  { value: 'other', label: 'Other' },
  
];

const jobTypes = [
  { id: 'full-time', label: 'Full-time' },
  { id: 'part-time', label: 'Part-time' },
  { id: 'contract', label: 'Contract' },
  { id: 'remote', label: 'Remote' },
  { id: 'hybrid', label: 'Hybrid' },
];

const profileSchema = z.object({
  firstName: z.string().trim().min(2, { message: 'First name is required' }),
  lastName: z.string().trim().min(2, { message: 'Last name is required' }),
  phone: z.string().trim().min(10, { message: 'Please enter a valid phone number' }).max(20),
  industry: z.string().min(1, { message: 'Please select an industry' }),
  jobTypes: z.array(z.string()).min(1, { message: 'Please select at least one job type' }),
  yearsOfExperience: z.string().min(1, { message: 'Please select your experience level' }),
  preferredLocations: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function UserCompletion() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
   const isFirstTimeProfile = user ? !user.profileCompleted : true;
    const mustUploadCv = isFirstTimeProfile && !user?.cvUrl && !cvFile;

  // Example: you might enforce completion for certain roles/plans
  const mustCompleteForRole = user?.role === 'User' && isFirstTimeProfile; // adjust as needed

  const shouldDisableSkip = mustUploadCv || mustCompleteForRole;
  const skipDisabledReason = mustUploadCv
    ? 'Please upload your CV to continue.'
    : mustCompleteForRole
      ? 'Profile completion is required before you can continue.'
      : '';


  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      industry: '',
      jobTypes: [],
      yearsOfExperience: '',
      preferredLocations: '',
    },
  });

  useEffect(() => {
    if (user) {
      // Parse the JSON string if it exists
      let jobPrefs = { jobTypes: [], yearsOfExperience: '', preferredLocations: [] };
      try {
        if (user.jobPreferencesJson) {
          jobPrefs = JSON.parse(user.jobPreferencesJson);
        }
      } catch (e) {
        console.error("Failed to parse job preferences", e);
      }
     
      
      // Use reset to fill the form with existing user data
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        industry: user.industry || '',
        jobTypes: jobPrefs.jobTypes || [],
        yearsOfExperience: jobPrefs.yearsOfExperience || '',
        preferredLocations: jobPrefs.preferredLocations?.join(', ') || '',
      });
    }
  }, [user, form]);

  const handleSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);

    try {
      const jobPreferences = {
        jobTypes: data.jobTypes,
        yearsOfExperience: data.yearsOfExperience,
        preferredLocations:
          data.preferredLocations?.split(',').map((x) => x.trim()).filter(Boolean) || [],
      };

      // multipart form-data
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('phone', data.phone);
      formData.append('industry', data.industry);
      formData.append('jobPreferencesJson', JSON.stringify(jobPreferences));

      if (cvFile) {
        formData.append('cv', cvFile);
      }

      const { error } = await authApi.completeProfileWithCv(formData);

      if (error) {
        toast.error(error.message || 'Failed to complete profile');
        return;
      }

      toast.success('Profile completed successfully!');
      return;
      // const loginUser = await authApi.getCurrentAuthUser();
      // if (loginUser?.Role === 'Admin'){
      //     navigate('/admin');
      //     return;
      // }
      // else{
               
      //  navigate('/dashboard');
      //  return;
      // }

    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleSkip = async () => {
    if (shouldDisableSkip) {
      toast.error(skipDisabledReason || 'You cannot skip profile completion right now.');
      return;
    }

    try {
      await authApi.skipProfileCompletion();
      const loginUser = await authApi.getCurrentAuthUser();
      if (loginUser?.Role === 'Admin') navigate('/admin');
      else navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-serif text-2xl">Complete Your Profile</CardTitle>
            <CardDescription className="text-base">
              Help us find the best job opportunities for you by providing some additional information.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* First + Last name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Doe" className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input {...field} type="tel" placeholder="+44 7123 456789" className="pl-10 h-12" />
                        </div>
                      </FormControl>
                      <FormDescription>Employers may contact you at this number</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CV Upload */}
<FormItem>
  <FormLabel>CV Document</FormLabel>
  <FormControl>
    <div className="space-y-4">
      {/* 1. Show existing CV if it exists and no new file is selected */}
      {user?.cv && !cvFile && (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded border">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Current CV Uploaded</p>
              <a 
                href={user.cvUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-blue-600 hover:underline"
              >
                View current file
              </a>
            </div>
          </div>
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
      )}

      {/* 2. The File Input */}
      <div className="relative">
        <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="file"
          accept=".pdf"
          className="pl-10 h-12 pt-2.5"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            if (file && file.size > 5 * 1024 * 1024) {
              toast.error('CV must be 5MB or less');
              e.currentTarget.value = '';
              setCvFile(null);
              return;
            }
            setCvFile(file);
          }}
        />
      </div>

      {/* 3. Show new file name if selected */}
      {cvFile && (
        <p className="text-xs text-muted-foreground">
          Replacing with: <span className="font-medium text-foreground">{cvFile.name}</span>
        </p>
      )}
    </div>
  </FormControl>
  <FormDescription>
    {user?.cvUrl 
      ? "Upload a new file only if you want to replace your current CV." 
      : "Accepted: PDF. Max 5MB."}
  </FormDescription>
</FormItem>

                {/* Industry */}
                <FormField
  control={form.control}
  name="industry"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Preferred Industry</FormLabel>
      {/* Change defaultValue to value */}
      <Select 
        onValueChange={field.onChange} 
        value={field.value} 
      >
        <FormControl>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select your preferred industry" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {industries.map((industry) => (
            <SelectItem key={industry.value} value={industry.value}>
              {industry.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

                {/* Job Types */}
                <FormField
                  control={form.control}
                  name="jobTypes"
                  render={() => (
                    <FormItem>
                      <FormLabel>Job Type Preferences</FormLabel>
                      <FormDescription>Select all that apply</FormDescription>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                        {jobTypes.map((jobType) => (
                          <FormField
                            key={jobType.id}
                            control={form.control}
                            name="jobTypes"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(jobType.id)}
                                    onCheckedChange={(checked) =>
                                      checked
                                        ? field.onChange([...(field.value || []), jobType.id])
                                        : field.onChange((field.value || []).filter((v) => v !== jobType.id))
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">{jobType.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Years of Experience */}
                <FormField
  control={form.control}
  name="yearsOfExperience"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Years of Experience</FormLabel>
      {/* Change defaultValue to value */}
      <Select 
        onValueChange={field.onChange} 
        value={field.value}
      >
        <FormControl>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="0-1">Entry Level (0-1 years)</SelectItem>
          <SelectItem value="1-3">Junior (1-3 years)</SelectItem>
          <SelectItem value="3-5">Mid-Level (3-5 years)</SelectItem>
          <SelectItem value="5-10">Senior (5-10 years)</SelectItem>
          <SelectItem value="10+">Expert (10+ years)</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

                {/* Preferred Locations */}
                <FormField
                  control={form.control}
                  name="preferredLocations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Locations (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., London, Manchester, Birmingham" className="h-12" />
                      </FormControl>
                      <FormDescription>Enter cities separated by commas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Actions */}
             
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
    

                  <Button type="submit" variant="royal" className="sm:flex-1 h-12" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Complete Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
