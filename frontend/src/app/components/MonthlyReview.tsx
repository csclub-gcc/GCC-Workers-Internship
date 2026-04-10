import { useState } from 'react';
import { TimeEntry } from '../types/timesheet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { Calendar, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface MonthlyReviewProps {
  entries: TimeEntry[];
  onUpdateEntry: (id: string, updates: Partial<TimeEntry>) => void;
}

export function MonthlyReview({ entries, onUpdateEntry }: MonthlyReviewProps) {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));

  // Get available months from entries
  const availableMonths = Array.from(
    new Set(entries.map(e => e.date.substring(0, 7)))
  ).sort().reverse();

  // If no months available, add current month
  if (availableMonths.length === 0) {
    availableMonths.push(format(new Date(), 'yyyy-MM'));
  }

  // Filter entries for selected month
  const monthEntries = entries.filter(e => e.date.startsWith(selectedMonth));
  const totalHours = monthEntries.reduce((sum, e) => sum + e.hoursWorked, 0);
  
  const draftEntries = monthEntries.filter(e => e.status === 'draft');
  const submittedEntries = monthEntries.filter(e => e.status === 'submitted');
  const approvedEntries = monthEntries.filter(e => e.status === 'approved');
  const rejectedEntries = monthEntries.filter(e => e.status === 'rejected');

  const handleSubmitMonth = () => {
    if (draftEntries.length === 0) {
      toast.error('No draft entries to submit');
      return;
    }

    draftEntries.forEach(entry => {
      onUpdateEntry(entry.id, {
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      });
    });

    toast.success(`Submitted ${draftEntries.length} entries for ${format(parseISO(selectedMonth + '-01'), 'MMMM yyyy')}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Monthly Timesheet Review</CardTitle>
              <CardDescription>Review and submit your monthly work hours</CardDescription>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map(month => (
                  <SelectItem key={month} value={month}>
                    {format(parseISO(month + '-01'), 'MMMM yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Hours</p>
              <p className="text-2xl font-semibold text-blue-900">{totalHours}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Draft</p>
              <p className="text-2xl font-semibold text-gray-900">{draftEntries.length}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-amber-600 mb-1">Submitted</p>
              <p className="text-2xl font-semibold text-amber-900">{submittedEntries.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Approved</p>
              <p className="text-2xl font-semibold text-green-900">{approvedEntries.length}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 mb-1">Rejected</p>
              <p className="text-2xl font-semibold text-red-900">{rejectedEntries.length}</p>
            </div>
          </div>

          {monthEntries.length === 0 ? (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                No time entries for {format(parseISO(selectedMonth + '-01'), 'MMMM yyyy')}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Entries Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthEntries
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map(entry => (
                        <TableRow key={entry.id}>
                          <TableCell>{format(parseISO(entry.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{entry.location}</TableCell>
                          <TableCell>{entry.hoursWorked}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {entry.description || '-'}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              entry.status === 'approved' ? 'bg-green-100 text-green-700' :
                              entry.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                              entry.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {entry.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {entry.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* Submit Button */}
              {draftEntries.length > 0 && (
                <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Ready to submit?</p>
                    <p className="text-sm text-blue-700">
                      You have {draftEntries.length} draft entries totaling {draftEntries.reduce((sum, e) => sum + e.hoursWorked, 0)} hours
                    </p>
                  </div>
                  <Button onClick={handleSubmitMonth}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit for Review
                  </Button>
                </div>
              )}

              {/* Rejected Entries Notice */}
              {rejectedEntries.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>
                    You have {rejectedEntries.length} rejected entries. Please review admin notes and resubmit.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
