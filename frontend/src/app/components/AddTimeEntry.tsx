import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface AddTimeEntryProps {
  onAdd: (entry: {
    date: string;
    startTime: string;
    endTime: string;
    breakTime?: string;
    breakDuration?: number;
    hoursWorked: number;
    location: string;
    description?: string;
  }) => void;
  onCancel: () => void;
}

// Generate hour options from 4 AM to 12 AM (midnight)
const generateHourOptions = () => {
  const hours: { value: number; display: string }[] = [];
  // 4 AM to 11 AM
  for (let hour = 4; hour <= 11; hour++) {
    hours.push({ value: hour, display: `${hour}:00 AM` });
  }
  // 12 PM
  hours.push({ value: 12, display: '12:00 PM' });
  // 1 PM to 11 PM
  for (let hour = 13; hour <= 23; hour++) {
    const hour12 = hour - 12;
    hours.push({ value: hour, display: `${hour12}:00 PM` });
  }
  // 12 AM (midnight)
  hours.push({ value: 0, display: '12:00 AM' });
  return hours;
};

// Generate minute options in 5-minute intervals
const generateMinuteOptions = () => {
  const minutes: string[] = [];
  for (let min = 0; min < 60; min += 5) {
    minutes.push(min.toString().padStart(2, '0'));
  }
  return minutes;
};

const hourOptions = generateHourOptions();
const minuteOptions = generateMinuteOptions();

const formatTimeDisplay = (hour: string, minute: string) => {
  if (!hour || !minute) return '';
  const hourNum = parseInt(hour);
  let displayHour = hourNum;
  let ampm = 'AM';
  
  if (hourNum === 0) {
    displayHour = 12;
    ampm = 'AM';
  } else if (hourNum === 12) {
    displayHour = 12;
    ampm = 'PM';
  } else if (hourNum > 12) {
    displayHour = hourNum - 12;
    ampm = 'PM';
  }
  
  return `${displayHour}:${minute} ${ampm}`;
};

export function AddTimeEntry({ onAdd, onCancel }: AddTimeEntryProps) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [breakHour, setBreakHour] = useState('');
  const [breakMinute, setBreakMinute] = useState('');
  const [breakDuration, setBreakDuration] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [calculatedHours, setCalculatedHours] = useState(0);
  const [showReview, setShowReview] = useState(false);

  // Calculate hours worked
  useEffect(() => {
    if (startHour && startMinute && endHour && endMinute) {
      let startTotalMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
      let endTotalMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
      
      // Handle overnight shifts (e.g., 11 PM to 12 AM)
      if (endTotalMinutes <= startTotalMinutes) {
        endTotalMinutes += 24 * 60; // Add 24 hours
      }
      
      let totalMinutes = endTotalMinutes - startTotalMinutes;
      
      // Subtract break duration if provided
      if (breakDuration && parseInt(breakDuration) > 0) {
        totalMinutes -= parseInt(breakDuration);
      }
      
      const hours = Math.max(0, totalMinutes / 60);
      setCalculatedHours(parseFloat(hours.toFixed(2)));
    } else {
      setCalculatedHours(0);
    }
  }, [startHour, startMinute, endHour, endMinute, breakDuration]);

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !startHour || !startMinute || !endHour || !endMinute || !location || calculatedHours <= 0) {
      return;
    }
    
    setShowReview(true);
  };

  const handleSubmit = () => {
    const startTime = `${startHour.padStart(2, '0')}:${startMinute}`;
    const endTime = `${endHour.padStart(2, '0')}:${endMinute}`;
    const breakTime = breakHour && breakMinute ? `${breakHour.padStart(2, '0')}:${breakMinute}` : undefined;
    
    onAdd({
      date,
      startTime,
      endTime,
      breakTime,
      breakDuration: breakDuration ? parseInt(breakDuration) : undefined,
      hoursWorked: calculatedHours,
      location,
      description: description || undefined,
    });

    // Reset form
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setStartHour('');
    setStartMinute('');
    setEndHour('');
    setEndMinute('');
    setBreakHour('');
    setBreakMinute('');
    setBreakDuration('');
    setLocation('');
    setDescription('');
    setCalculatedHours(0);
    setShowReview(false);
  };

  const handleBack = () => {
    setShowReview(false);
  };

  if (showReview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Time Entry</CardTitle>
          <CardDescription>Please review your time entry before submitting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{format(new Date(date), 'MMMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Time</p>
              <p className="font-medium">{formatTimeDisplay(startHour, startMinute)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Time</p>
              <p className="font-medium">{formatTimeDisplay(endHour, endMinute)}</p>
            </div>
            {breakHour && breakMinute && breakDuration && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Break Time</p>
                  <p className="font-medium">{formatTimeDisplay(breakHour, breakMinute)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Break Duration</p>
                  <p className="font-medium">{breakDuration} minutes</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-[#FFF8E1] border-2 border-[#FFC629] rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#A32035]" />
              <div>
                <p className="text-sm text-[#737373]">Total Hours Worked</p>
                <p className="text-2xl font-bold text-[#A32035]">{calculatedHours} hours</p>
              </div>
            </div>
          </div>

          {description && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{description}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
              Back to Edit
            </Button>
            <Button type="button" onClick={handleSubmit} className="flex-1">
              Submit Entry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleReview} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            type="text"
            placeholder="e.g., Main Campus Library, Remote, Building A"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Start Time *</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select value={startHour} onValueChange={setStartHour} required>
            <SelectTrigger>
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hourOptions.map((hour) => (
                <SelectItem key={`start-hour-${hour.value}`} value={hour.value.toString()}>
                  {hour.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={startMinute} onValueChange={setStartMinute} required>
            <SelectTrigger>
              <SelectValue placeholder="Minutes" />
            </SelectTrigger>
            <SelectContent>
              {minuteOptions.map((minute) => (
                <SelectItem key={`start-min-${minute}`} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>End Time *</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select value={endHour} onValueChange={setEndHour} required>
            <SelectTrigger>
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hourOptions.map((hour) => (
                <SelectItem key={`end-hour-${hour.value}`} value={hour.value.toString()}>
                  {hour.display}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={endMinute} onValueChange={setEndMinute} required>
            <SelectTrigger>
              <SelectValue placeholder="Minutes" />
            </SelectTrigger>
            <SelectContent>
              {minuteOptions.map((minute) => (
                <SelectItem key={`end-min-${minute}`} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Break Time (Optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={breakHour} onValueChange={setBreakHour}>
              <SelectTrigger>
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent>
                {hourOptions.map((hour) => (
                  <SelectItem key={`break-hour-${hour.value}`} value={hour.value.toString()}>
                    {hour.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={breakMinute} onValueChange={setBreakMinute}>
              <SelectTrigger>
                <SelectValue placeholder="Minutes" />
              </SelectTrigger>
              <SelectContent>
                {minuteOptions.map((minute) => (
                  <SelectItem key={`break-min-${minute}`} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="breakDuration">Break Duration (Minutes)</Label>
          <Input
            id="breakDuration"
            type="number"
            min="0"
            max="120"
            step="5"
            placeholder="e.g., 30"
            value={breakDuration}
            onChange={(e) => setBreakDuration(e.target.value)}
          />
        </div>
      </div>

      {calculatedHours > 0 && (
        <div className="bg-[#FFF8E1] border-2 border-[#FFC629] rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#A32035]" />
            <div>
              <p className="text-sm text-[#737373]">Calculated Hours</p>
              <p className="text-lg font-semibold text-[#A32035]">{calculatedHours} hours</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Brief description of work performed..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={calculatedHours <= 0}>
          Review & Submit
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}