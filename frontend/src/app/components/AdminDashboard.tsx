import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { TimeEntry, Student } from '../types/timesheet';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Clock, LogOut, CheckCircle, XCircle, Eye, UserPlus, Trash2, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  useEffect(() => {
    loadEntries();
    loadStudents();
  }, []);

  const loadEntries = () => {
    const storedEntries = localStorage.getItem('timeEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  };

  const loadStudents = () => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    } else {
      // Initialize with default student
      const defaultStudents: Student[] = [
        {
          id: 'student-1',
          name: 'Student Worker',
          email: 'student@example.com',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('students', JSON.stringify(defaultStudents));
      setStudents(defaultStudents);
    }
  };

  const addStudent = () => {
    if (!newStudentName.trim() || !newStudentEmail.trim()) {
      toast.error('Please provide both name and email');
      return;
    }

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: newStudentName.trim(),
      email: newStudentEmail.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    const updatedStudents = [...students, newStudent];
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
    setNewStudentName('');
    setNewStudentEmail('');
    setShowAddStudentDialog(false);
    toast.success(`Added student: ${newStudent.name}`);
  };

  const deleteStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Check if student has any time entries
    const studentEntries = entries.filter(e => e.studentId === studentId);
    if (studentEntries.length > 0) {
      toast.error(`Cannot delete ${student.name}. They have ${studentEntries.length} time entries.`);
      return;
    }

    const updatedStudents = students.filter(s => s.id !== studentId);
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
    toast.success(`Deleted student: ${student.name}`);
  };

  const updateEntry = (id: string, updates: Partial<TimeEntry>) => {
    const storedEntries = localStorage.getItem('timeEntries');
    if (storedEntries) {
      const allEntries: TimeEntry[] = JSON.parse(storedEntries);
      const updatedEntries = allEntries.map(e =>
        e.id === id ? { ...e, ...updates } : e
      );
      localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    }
  };

  const handleApprove = (entry: TimeEntry) => {
    updateEntry(entry.id, {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewNotes,
    });
    toast.success(`Approved timesheet for ${entry.studentName}`);
    setShowReviewDialog(false);
    setReviewNotes('');
    setSelectedEntry(null);
  };

  const handleReject = (entry: TimeEntry) => {
    if (!reviewNotes.trim()) {
      toast.error('Please provide rejection notes');
      return;
    }
    updateEntry(entry.id, {
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewNotes,
    });
    toast.success(`Rejected timesheet for ${entry.studentName}`);
    setShowReviewDialog(false);
    setReviewNotes('');
    setSelectedEntry(null);
  };

  const openReviewDialog = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setReviewNotes(entry.reviewNotes || '');
    setShowReviewDialog(true);
  };

  const submittedEntries = entries.filter(e => e.status === 'submitted');
  const approvedEntries = entries.filter(e => e.status === 'approved');
  const rejectedEntries = entries.filter(e => e.status === 'rejected');
  const allEntries = entries.filter(e => e.status !== 'draft');

  const totalHoursSubmitted = submittedEntries.reduce((sum, e) => sum + e.hoursWorked, 0);
  const totalHoursApproved = approvedEntries.reduce((sum, e) => sum + e.hoursWorked, 0);

  const renderEntriesTable = (entriesList: TimeEntry[]) => {
    if (entriesList.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No entries to display
        </div>
      );
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entriesList
              .sort((a, b) => {
                if (a.submittedAt && b.submittedAt) {
                  return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
                }
                return b.date.localeCompare(a.date);
              })
              .map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.studentName}</TableCell>
                  <TableCell>{format(parseISO(entry.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{entry.location}</TableCell>
                  <TableCell>{entry.hoursWorked}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {entry.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      entry.status === 'approved' ? 'default' :
                      entry.status === 'rejected' ? 'destructive' :
                      'secondary'
                    }>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openReviewDialog(entry)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {entry.status === 'submitted' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEntry(entry);
                              setReviewNotes('');
                              handleApprove(entry);
                            }}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReviewDialog(entry)}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#A32035] border-b-4 border-[#FFC629] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFC629] rounded-lg p-2.5 shadow-sm">
                <Clock className="h-7 w-7 text-[#A32035]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Glendale Community College</h1>
                <p className="text-sm text-[#FFC629]">Admin Dashboard - Timesheet Management</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout} className="bg-white text-[#A32035] border-white hover:bg-[#FFC629] hover:text-[#A32035] hover:border-[#FFC629]">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-[#A32035] shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#737373]">Pending Review</CardDescription>
              <CardTitle className="text-3xl text-[#A32035]">{submittedEntries.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-[#FFC629] shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#737373]">Pending Hours</CardDescription>
              <CardTitle className="text-3xl text-[#A32035]">{totalHoursSubmitted}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-[#A32035] shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#737373]">Approved This Month</CardDescription>
              <CardTitle className="text-3xl text-[#A32035]">{approvedEntries.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-[#FFC629] shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#737373]">Approved Hours</CardDescription>
              <CardTitle className="text-3xl text-[#A32035]">{totalHoursApproved}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Review ({submittedEntries.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedEntries.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedEntries.length})
            </TabsTrigger>
            <TabsTrigger value="all">
              All Entries ({allEntries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Timesheets</CardTitle>
                <CardDescription>Review and approve or reject submitted timesheets</CardDescription>
              </CardHeader>
              <CardContent>
                {renderEntriesTable(submittedEntries)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Timesheets</CardTitle>
                <CardDescription>Previously approved time entries</CardDescription>
              </CardHeader>
              <CardContent>
                {renderEntriesTable(approvedEntries)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Timesheets</CardTitle>
                <CardDescription>Time entries that need correction</CardDescription>
              </CardHeader>
              <CardContent>
                {renderEntriesTable(rejectedEntries)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Timesheets</CardTitle>
                <CardDescription>Complete timesheet history</CardDescription>
              </CardHeader>
              <CardContent>
                {renderEntriesTable(allEntries)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Timesheet Entry</DialogTitle>
            <DialogDescription>
              Review details and approve or reject this entry
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Student</p>
                  <p className="font-medium">{selectedEntry.studentName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">{format(parseISO(selectedEntry.date), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedEntry.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hours Worked</p>
                  <p className="font-medium">{selectedEntry.hoursWorked}</p>
                </div>
                {selectedEntry.startTime && (
                  <div>
                    <p className="text-muted-foreground">Start Time</p>
                    <p className="font-medium">{selectedEntry.startTime}</p>
                  </div>
                )}
                {selectedEntry.endTime && (
                  <div>
                    <p className="text-muted-foreground">End Time</p>
                    <p className="font-medium">{selectedEntry.endTime}</p>
                  </div>
                )}
                {selectedEntry.breakTime && (
                  <div>
                    <p className="text-muted-foreground">Break Time</p>
                    <p className="font-medium">{selectedEntry.breakTime}</p>
                  </div>
                )}
                {selectedEntry.breakDuration && (
                  <div>
                    <p className="text-muted-foreground">Break Duration</p>
                    <p className="font-medium">{selectedEntry.breakDuration} minutes</p>
                  </div>
                )}
              </div>
              {selectedEntry.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{selectedEntry.description}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="notes">Review Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes (required for rejection)..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewDialog(false);
                    setReviewNotes('');
                    setSelectedEntry(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedEntry)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedEntry)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={showAddStudentDialog} onOpenChange={setShowAddStudentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Add a new student to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter student name..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter student email..."
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddStudentDialog(false);
                setNewStudentName('');
                setNewStudentEmail('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={addStudent}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Management */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>Manage students in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="outline"
                onClick={() => setShowAddStudentDialog(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
              <div className="text-sm text-muted-foreground">
                Total Students: {students.length}
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{format(parseISO(student.createdAt), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteStudent(student.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}