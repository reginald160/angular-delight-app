import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile, Profile } from '@/hooks/useProfile';
import { Loader2, Pi, User } from 'lucide-react';
import {authApi} from "@/services/AuthService";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileModal = ({ open, onOpenChange }: ProfileModalProps) =>  {

    
  const { profile, loading, updateProfile } = useProfile();


  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    await updateProfile({
      first_name: formData.first_name || null,
      last_name: formData.last_name || null,
      phone: formData.phone || null
    });
    
    setSaving(false);
    onOpenChange(false);
  };


 useEffect(() => {
  if (!open) return;

  const loadUser = async () => {
    try {
      const resp = await authApi.getCurrentUser1('');
    
      console.log('User data:', resp);
      profile.first_name = resp.data?.FirstName ?? null;
      profile.last_name = resp.data?.LastName ?? null;
      profile.phone = resp.data?.Phone ?? null;

       setFormData({
        first_name: profile.first_name || 'Obi',
        last_name: profile.last_name || 'Eze',
        phone: profile.phone || ''
      });

      // await updateProfile({
      //   first_name: resp.data?.FirstName ?? null,
      //   last_name: resp.data?.LastName ?? null,
      //   phone: resp.data?.Phone ?? null
      // });
    } catch (err) {
      console.error('Failed to load user', err);
    }
  };

  loadUser();
}, [open]);

  // Update form when profile loads
  useState(() => {
    if (profile) {
       
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || ''
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+44 7123 456789"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
