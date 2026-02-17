import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, RefreshCcw, ShieldCheck, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const OTP_LENGTH = 5;
const OTP_EXPIRY_SECONDS = 60;      // 10 minutes (standard)
const RESEND_COOLDOWN_SECONDS = 60;      // 60 seconds (standard cooldown)

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userEmail = (searchParams.get('email') || '').trim().toLowerCase();

  const storageKey = `signup-otp:${userEmail}`;

  // ---------- TIMER STORAGE ----------
  const getInitialTimers = () => {
    const raw = sessionStorage.getItem(storageKey);

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.expiresAt && parsed.resendAvailableAt) {
          return parsed;
        }
      } catch {}
    }

    const now = Date.now();
    const initial = {
      expiresAt: now + OTP_EXPIRY_SECONDS * 1000,
      resendAvailableAt: now + RESEND_COOLDOWN_SECONDS * 1000,
    };

    sessionStorage.setItem(storageKey, JSON.stringify(initial));
    return initial;
  };

  const [timers, setTimers] = useState(getInitialTimers);

  const now = Date.now();

  const secondsLeft = Math.max(0, Math.ceil((timers.expiresAt - now) / 1000));
  const resendSecondsLeft = Math.max(0, Math.ceil((timers.resendAvailableAt - now) / 1000));

  const isExpired = secondsLeft <= 0;
  const canResend = resendSecondsLeft <= 0;

  // Tick every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => ({ ...prev }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const restartTimersAfterResend = () => {
    const updated = {
      expiresAt: Date.now() + OTP_EXPIRY_SECONDS * 1000,
      resendAvailableAt: Date.now() + RESEND_COOLDOWN_SECONDS * 1000,
    };
    sessionStorage.setItem(storageKey, JSON.stringify(updated));
    setTimers(updated);
  };

  const syncFromServer = (expiresInSeconds: number, resendInSeconds: number) => {
    const now = Date.now();
    const updated = {
      expiresAt: now + expiresInSeconds * 1000,
      resendAvailableAt: now + resendInSeconds * 1000,
    };
    sessionStorage.setItem(storageKey, JSON.stringify(updated));
    setTimers(updated);
  };

  const clearTimers = () => {
    sessionStorage.removeItem(storageKey);
  };

  // ---------- STATE ----------
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerPercent = useMemo(
    () => (secondsLeft / OTP_EXPIRY_SECONDS) * 100,
    [secondsLeft]
  );

  // ---------- SYNC WITH BACKEND ON MOUNT ----------
  useEffect(() => {
    if (!userEmail) return;

    (async () => {
      try {
        const resp = await fetch(
          `${API_BASE_URL}/otp/signup-otp-status?email=${encodeURIComponent(userEmail)}`
        );

        if (!resp.ok)
            {
                  const data = await resp.json().catch(() => null);
                if(data.message.includes("email has been confirmed"))
                {
                    toast(data.message)
                     navigate('/auth')
                     return;
                }
                else{
                    return;
                }
            } 

        const data = await resp.json().catch(() => null);
        if (!data) return;

        if (
          typeof data.expiresInSeconds === 'number' &&
          typeof data.resendInSeconds === 'number'
        ) {
          syncFromServer(data.expiresInSeconds, data.resendInSeconds);
        }
      } catch {
        // ignore
      }
    })();
  }, [userEmail]);

  // ---------- VERIFY ----------
  const handleVerify = useCallback(
    async (code: string) => {
      if (isVerifying) return;

      setIsVerifying(true);
      setError('');

      const reactBaseUrl = window.location.origin;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-signup-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Client-Base-Url': reactBaseUrl,
          },
          body: JSON.stringify({ email: userEmail, otp: code }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          setError(data?.message || 'Invalid or expired OTP.');
          setOtp(Array(OTP_LENGTH).fill(''));
          inputRefs.current[0]?.focus();
          return;
        }

        setIsVerified(true);
        clearTimers();
        toast.success('Email verified successfully!');
        setTimeout(() => navigate('/auth'), 3000);
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    },
    [isVerifying, userEmail, navigate]
  );

  // ---------- INPUT HANDLING ----------
  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

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
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];

    setOtp(newOtp);
    setError('');

    if (pasted.length === OTP_LENGTH) handleVerify(pasted);
  };

  // ---------- RESEND ----------
  const handleResend = async () => {
    if (isResending || !canResend) return;

    setIsResending(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-signup-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (
          typeof data?.expiresInSeconds === 'number' &&
          typeof data?.resendInSeconds === 'number'
        ) {
          syncFromServer(data.expiresInSeconds, data.resendInSeconds);
        }
        throw new Error(data?.message || 'Failed to resend.');
      }

      setOtp(Array(OTP_LENGTH).fill(''));
      restartTimersAfterResend();
      inputRefs.current[0]?.focus();
      toast.success('A new verification code has been sent.');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to resend.');
    } finally {
      setIsResending(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md text-center">
          {isVerified ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
              <p>Redirecting to sign in...</p>
            </>
          ) : (
            <>
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-6" />

              <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
              <p className="mb-6 text-muted-foreground">
                Code sent to <strong>{userEmail}</strong>
              </p>

              {/* Timer */}
              <div className="mb-6">
                <Timer className="mx-auto mb-2" />
                <div className={isExpired ? 'text-destructive' : ''}>
                  {formatTime(secondsLeft)}
                </div>
              </div>

              {/* OTP Inputs */}
              <div className="flex justify-center gap-3 mb-4" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    maxLength={1}
                    value={digit}
                    disabled={isExpired}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl"
                  />
                ))}
              </div>

              {error && <p className="text-destructive mb-4">{error}</p>}

              <Button
                className="w-full mb-4"
                disabled={isExpired || otp.some((d) => d === '') || isVerifying}
                onClick={() => handleVerify(otp.join(''))}
              >
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                disabled={!canResend || isResending}
                onClick={handleResend}
              >
                {isResending
                  ? 'Sending...'
                  : canResend
                  ? 'Resend Verification Code'
                  : `Resend in ${resendSecondsLeft}s`}
              </Button>

              <Link to="/auth" className="block mt-6 text-sm">
                <ArrowLeft className="inline w-3 h-3 mr-1" />
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
