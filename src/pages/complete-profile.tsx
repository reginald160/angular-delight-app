import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Briefcase, CheckCircle, Loader2 } from 'lucide-react';
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
  phone: z.string().trim().min(10, { message: 'Please enter a valid phone number' }).max(20),
  industry: z.string().min(1, { message: 'Please select an industry' }),
  jobTypes: z.array(z.string()).min(1, { message: 'Please select at least one job type' }),
  yearsOfExperience: z.string().min(1, { message: 'Please select your experience level' }),
  preferredLocations: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileCompletion() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: '',
      industry: '',
      jobTypes: [],
      yearsOfExperience: '',
      preferredLocations: '',
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    
    try {
      const jobPreferences = {
        jobTypes: data.jobTypes,
        yearsOfExperience: data.yearsOfExperience,
        preferredLocations: data.preferredLocations?.split(',').map(loc => loc.trim()).filter(Boolean) || [],
      };

      const { error } = await authApi.completeProfile(
        data.phone,
        data.industry,
        jobPreferences
      );

      if (error) {
        toast.error(error.message || 'Failed to complete profile');
        setIsSubmitting(false);
        return;
      }

      toast.success('Profile completed successfully!');
      
      const loginUser = await authApi.getCurrentAuthUser();
      if (loginUser?.Role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      await authApi.skipProfileCompletion();
      const loginUser = await authApi.getCurrentAuthUser();
      if (loginUser?.Role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      navigate('/dashboard');
    }
  };

  return (
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
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+44 7123 456789"
                          className="pl-10 h-12"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Employers may contact you at this number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Industry */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormDescription>
                      Select all that apply
                    </FormDescription>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                      {jobTypes.map((jobType) => (
                        <FormField
                          key={jobType.id}
                          control={form.control}
                          name="jobTypes"
                          render={({ field }) => (
                            <FormItem
                              key={jobType.id}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(jobType.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, jobType.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== jobType.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {jobType.label}
                              </FormLabel>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Input
                        {...field}
                        placeholder="e.g., London, Manchester, Birmingham"
                        className="h-12"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter cities separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="sm:flex-1 h-12"
                  onClick={handleSkip}
                >
                  Skip for Now
                </Button>
                <Button
                  type="submit"
                  variant="royal"
                  className="sm:flex-1 h-12"
                  disabled={isSubmitting}
                >
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
  );
}
