export interface TimeEntry {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "17:00"
  breakTime?: string; // e.g., "12:00"
  breakDuration?: number; // minutes
  hoursWorked: number;
  location: string;
  description?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedAt?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface MonthlyTimesheet {
  month: string; // Format: YYYY-MM
  entries: TimeEntry[];
  totalHours: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}