import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, RefreshCcw, ShieldCheck, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const OTP_LENGTH = 5;
const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userEmail = searchParams.get('email') || '';

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(OTP_EXPIRY_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0 || isVerified) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft, isVerified]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerPercent = (secondsLeft / OTP_EXPIRY_SECONDS) * 100;

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (value && index === OTP_LENGTH - 1 && newOtp.every((d) => d !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length === 0) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    setError('');

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === OTP_LENGTH) {
      handleVerify(pasted);
    }
  };

  const handleVerify = useCallback(async (code: string) => {
    if (isVerifying) return;
    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp: code }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || 'Invalid or expired OTP. Please try again.');
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        return;
      }

      setIsVerified(true);
      toast.success('Email verified successfully!');
      setTimeout(() => navigate('/complete-profile'), 3000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }, [isVerifying, userEmail, navigate]);

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) throw new Error();

      setOtp(Array(OTP_LENGTH).fill(''));
      setSecondsLeft(OTP_EXPIRY_SECONDS);
      inputRefs.current[0]?.focus();
      toast.success('A new verification code has been sent to your email.');
    } catch {
      toast.error('Failed to resend code. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  const isExpired = secondsLeft <= 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20">
            <span className="text-white font-serif font-bold text-3xl">UK</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Almost There!</h1>
          <p className="text-white/80 text-lg max-w-md">
            Verify your email to complete your registration and start your UK journey.
          </p>
        </div>
      </div>

      {/* Right Panel - OTP Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12">
        <div className="w-full max-w-md text-center">
          {isVerified ? (
            <>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Email Verified!</h2>
              <p className="text-muted-foreground mb-6">
                Your account has been verified. Redirecting to sign in...
              </p>
            </>
          ) : (
            <>
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>

              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Verify Your Email
              </h2>
              <p className="text-muted-foreground mb-8">
                We've sent a 5-digit code to{' '}
                <span className="font-semibold text-foreground">{userEmail}</span>
              </p>

              {/* Countdown Timer */}
              <div className="mb-8">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-muted/20"
                    />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - timerPercent / 100)}
                      strokeLinecap="round"
                      className={isExpired ? 'text-destructive' : 'text-primary'}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Timer className={`w-4 h-4 mb-0.5 ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`} />
                    <span className={`text-lg font-mono font-bold ${isExpired ? 'text-destructive' : 'text-foreground'}`}>
                      {formatTime(secondsLeft)}
                    </span>
                  </div>
                </div>
                {isExpired && (
                  <p className="text-sm text-destructive font-medium">
                    Code expired. Please request a new one.
                  </p>
                )}
              </div>

              {/* OTP Input */}
              <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isVerifying || isExpired}
                    className={`w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all
                      ${digit ? 'border-primary bg-primary/5' : 'border-border'}
                      ${error ? 'border-destructive' : ''}
                      focus:border-primary focus:ring-2 focus:ring-primary/20`}
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center justify-center gap-2 text-destructive text-sm mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Verify Button */}
              <Button
                variant="royal"
                className="w-full h-12 text-base mb-4"
                disabled={isVerifying || otp.some((d) => d === '') || isExpired}
                onClick={() => handleVerify(otp.join(''))}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </Button>

              {/* Resend */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button
                  variant="outline"
                  className="h-10 text-sm"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Resend Verification Code
                    </>
                  )}
                </Button>
              </div>

              {/* Info box */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-8 flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-900 font-medium">Can't find the email?</p>
                  <p className="text-sm text-amber-800/80">
                    Check your <strong>Spam</strong> or <strong>Junk</strong> folder. The code expires in 10 minutes.
                  </p>
                </div>
              </div>

              <Link to="/auth" className="block mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" />
                  Back to Sign In
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
