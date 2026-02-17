import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, MapPin, FileText, Upload, X, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
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
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const MAX_CV_SIZE_MB = 5;
const MAX_CV_SIZE_BYTES = MAX_CV_SIZE_MB * 1024 * 1024;

const UK_CITIES = [
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow',
  'Liverpool', 'Bristol', 'Sheffield', 'Edinburgh', 'Leicester',
  'Coventry', 'Bradford', 'Cardiff', 'Belfast', 'Nottingham',
  'Newcastle upon Tyne', 'Southampton', 'Aberdeen', 'Oxford', 'Cambridge',
  'Brighton', 'Reading', 'Wolverhampton', 'Derby', 'Swansea',
];

const profileSchema = z.object({
  phone: z.string().trim().min(7, 'Phone number is required').max(20, 'Phone number too long'),
  location: z.string().min(1, 'Please select your location'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function CompleteProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState('');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: '',
      location: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setCvError('Only PDF files are accepted.');
      return;
    }
    if (file.size > MAX_CV_SIZE_BYTES) {
      setCvError(`File size must be under ${MAX_CV_SIZE_MB}MB.`);
      return;
    }

    setCvFile(file);
  };

  const removeCv = () => {
    setCvFile(null);
    setCvError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('phone', data.phone);
      formData.append('location', data.location);
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || 'Failed to update profile');
      }

      toast.success('Profile completed successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20">
            <span className="text-white font-serif font-bold text-3xl">UK</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Complete Your Profile</h1>
          <p className="text-white/80 text-lg max-w-md mb-8">
            Help us personalise your experience by providing a few more details.
          </p>

          <div className="space-y-4 max-w-xs w-full text-left">
            {[
              { step: '1', label: 'Create Account', done: true },
              { step: '2', label: 'Verify Email', done: true },
              { step: '3', label: 'Complete Profile', done: false },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                  item.done
                    ? 'bg-white/20 border-white/40 text-white'
                    : 'bg-white/10 border-white/60 text-white ring-2 ring-white/30'
                }`}>
                  {item.done ? <CheckCircle className="w-5 h-5" /> : item.step}
                </div>
                <span className={`text-white/90 font-medium ${!item.done ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-hero flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-xl">UK</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-foreground">UK Pathway</span>
              <span className="text-xs text-muted-foreground">Complete Your Profile</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
              Almost Done!
            </h2>
            <p className="text-muted-foreground">
              Add your contact details and CV to get started with your UK journey.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Phone */}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="pl-10 h-12">
                            <SelectValue placeholder="Select your city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {UK_CITIES.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CV Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Upload CV <span className="text-muted-foreground font-normal">(PDF only, max {MAX_CV_SIZE_MB}MB)</span>
                </label>

                {cvFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{cvFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8"
                      onClick={removeCv}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Click to upload your CV</span>
                    <span className="text-xs text-muted-foreground">PDF format only</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {cvError && (
                  <p className="text-sm text-destructive">{cvError}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="royal"
                className="w-full h-12 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Skip */}
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => navigate('/dashboard')}
                disabled={isSubmitting}
              >
                Skip for now
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
