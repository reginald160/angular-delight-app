import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTypeFilter: string | null;
  onJobTypeChange: (type: string | null) => void;
}

export function FilterSheet({ open, onOpenChange, jobTypeFilter, onJobTypeChange }: FilterSheetProps) {
  const [localJobType, setLocalJobType] = useState(jobTypeFilter || 'all');
  const [salaryRange, setSalaryRange] = useState([0, 150000]);

  const handleApply = () => {
    onJobTypeChange(localJobType === 'all' ? null : localJobType);
    onOpenChange(false);
  };

  const handleClear = () => {
    setLocalJobType('all');
    setSalaryRange([0, 150000]);
    onJobTypeChange(null);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Jobs</SheetTitle>
          <SheetDescription>Narrow down your job search</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Job Type */}
          <div>
            <Label className="text-base font-medium">Job Type</Label>
            <RadioGroup value={localJobType} onValueChange={setLocalJobType} className="mt-3 space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal">All Types</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Full-time" id="fulltime" />
                <Label htmlFor="fulltime" className="font-normal">Full-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Part-time" id="parttime" />
                <Label htmlFor="parttime" className="font-normal">Part-time</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Contract" id="contract" />
                <Label htmlFor="contract" className="font-normal">Contract</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Remote" id="remote" />
                <Label htmlFor="remote" className="font-normal">Remote</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Hybrid" id="hybrid" />
                <Label htmlFor="hybrid" className="font-normal">Hybrid</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Salary Range */}
          <div>
            <Label className="text-base font-medium">Salary Range</Label>
            <div className="mt-3">
              <Slider
                value={salaryRange}
                onValueChange={setSalaryRange}
                max={150000}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>£{salaryRange[0].toLocaleString()}</span>
                <span>£{salaryRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
