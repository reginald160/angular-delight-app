import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Bell, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { JobAlert } from '@/hooks/useJobs';

interface JobAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alerts: JobAlert[];
  onCreate: (alert: Partial<JobAlert>) => Promise<boolean>;
  onDelete: (alertId: string) => void;
}

export function JobAlertModal({ open, onOpenChange, alerts, onCreate, onDelete }: JobAlertModalProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [creating, setCreating] = useState(false);

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const addLocation = () => {
    if (locationInput.trim() && !locations.includes(locationInput.trim())) {
      setLocations([...locations, locationInput.trim()]);
      setLocationInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const removeLocation = (location: string) => {
    setLocations(locations.filter(l => l !== location));
  };

  const handleCreate = async () => {
    if (keywords.length === 0) return;
    
    setCreating(true);
    const success = await onCreate({
      keywords,
      locations: locations.length > 0 ? locations : null,
      email_frequency: frequency
    });
    
    if (success) {
      setKeywords([]);
      setLocations([]);
      setKeywordInput('');
      setLocationInput('');
    }
    setCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Job Alerts
          </DialogTitle>
          <DialogDescription>
            Get notified when new jobs match your criteria
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Existing Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              <Label>Your Active Alerts</Label>
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {alert.keywords?.map((k, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{k}</Badge>
                        ))}
                      </div>
                      {alert.locations && alert.locations.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {alert.locations.join(', ')}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.email_frequency} notifications
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(alert.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create New Alert */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium">Create New Alert</h4>
            
            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="keywords"
                  placeholder="e.g., Software Engineer"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" onClick={addKeyword} variant="outline">Add</Button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {keywords.map((k, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {k}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeKeyword(k)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="locations">Locations (optional)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="locations"
                  placeholder="e.g., London"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                />
                <Button type="button" onClick={addLocation} variant="outline">Add</Button>
              </div>
              {locations.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {locations.map((l, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      {l}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeLocation(l)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Notification Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="instant">Instant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleCreate} 
              disabled={keywords.length === 0 || creating}
              className="w-full"
            >
              {creating ? 'Creating...' : 'Create Alert'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
