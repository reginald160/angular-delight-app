import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function SignupSuccess() {
  const [isResending, setIsResending] = useState(false);
  // In a real app, you might get the email from a global state or search params
  const userEmail = new URLSearchParams(window.location.search).get('email') || "your email";

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
      });

      if (!response.ok) throw new Error();

      toast.success('Verification link resent successfully!');
    } catch (error) {
      toast.error('Failed to resend email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding (Kept consistent with your Forgot Password UI) */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20">
            <span className="text-white font-serif font-bold text-3xl">UK</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Welcome Aboard!</h1>
          <p className="text-white/80 text-lg max-w-md">
            You're just one step away from starting your journey with UK Pathway Hub.
          </p>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Verify Your Email
          </h2>
          
          <p className="text-muted-foreground mb-6">
            We've sent a confirmation link to <span className="font-semibold text-foreground">{userEmail}</span>. 
            Please click the link in the email to activate your account.
          </p>

          {/* Warning/Info Box */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900 font-medium">Can't find the email?</p>
              <p className="text-sm text-amber-800/80">
                Please check your <strong>Spam</strong> or <strong>Junk</strong> folder. Sometimes filters can be a bit too strict!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* <Button 
              onClick={handleResendEmail}
              variant="outline" 
              className="w-full h-12 text-base border-royal/20 hover:bg-royal/5"
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              )}
            </Button> */}

            <Link to="/auth" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span className="inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                Back to Sign In
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}