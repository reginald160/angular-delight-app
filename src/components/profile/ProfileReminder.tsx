import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, Phone, FileText, MapPin, Sparkles, ArrowRight, X } from 'lucide-react';

export const ProfileReminder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const checks = [
    { label: 'First Name', done: !!user?.FirstName, icon: User },
    { label: 'Last Name', done: !!user?.LastName, icon: User },
    { label: 'Phone Number', done: !!user?.Phone, icon: Phone },
    { label: 'CV Uploaded', done: !!user?.CV, icon: FileText },
  ];

  const completed = checks.filter((c) => c.done).length;
  const total = checks.length;
  const percentage = Math.round((completed / total) * 100);
  const isComplete = completed === total;

  useEffect(() => {
    if (!user || isComplete) return;

    // Show reminder after 2 seconds, but only once per session
    const dismissed = sessionStorage.getItem('profile_reminder_dismissed');
    if (dismissed) return;

    const timer = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(timer);
  }, [user, isComplete]);

  const handleDismiss = () => {
    setOpen(false);
    sessionStorage.setItem('profile_reminder_dismissed', 'true');
  };

  const handleComplete = () => {
    setOpen(false);
    navigate('/complete-profile');
  };

  if (isComplete) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleDismiss(); else setOpen(v); }}>
      <DialogContent className="sm:max-w-md border-none shadow-2xl overflow-hidden p-0">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 pt-8 pb-10 text-primary-foreground">
          <div className="absolute top-3 right-3">
            <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <DialogHeader className="text-left space-y-0">
              <DialogTitle className="text-xl font-serif text-primary-foreground">
                Almost There!
              </DialogTitle>
            </DialogHeader>
          </div>
          <DialogDescription className="text-primary-foreground/85 text-sm leading-relaxed">
            Complete your profile to unlock the full UK Pathway experience — personalized job matches, visa guidance, and housing alerts tailored just for you.
          </DialogDescription>

          {/* Progress Arc */}
          <div className="mt-5 flex items-center gap-4">
            <div className="flex-1">
              <Progress value={percentage} className="h-2.5 bg-white/20 [&>div]:bg-white" />
            </div>
            <span className="text-sm font-bold tabular-nums">{percentage}%</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="px-6 py-5 space-y-3">
          {checks.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  item.done
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-900'
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    item.done
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-sm font-medium ${item.done ? 'text-green-700 dark:text-green-400 line-through' : 'text-foreground'}`}>
                  {item.label}
                </span>
                {item.done && (
                  <span className="ml-auto text-xs text-green-600 dark:text-green-400 font-medium">Done</span>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleDismiss}>
            Later
          </Button>
          <Button className="flex-1 gap-2" onClick={handleComplete}>
            Complete Profile <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
