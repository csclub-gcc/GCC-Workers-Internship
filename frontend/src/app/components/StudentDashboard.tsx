import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { TimeEntry } from '../types/timesheet';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AddTimeEntry } from './AddTimeEntry';
import { MonthlyReview } from './MonthlyReview';
import { Clock, LogOut, Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);

  useEffect(() => {
    // Load time entries from localStorage
    const storedEntries = localStorage.getItem('timeEntries');
    if (storedEntries) {
      const allEntries: TimeEntry[] = JSON.parse(storedEntries);
      const userEntries = allEntries.filter(e => e.studentId === user?.id);
      setEntries(userEntries);
    }
  }, [user?.id]);

  const handleAddEntry = (entry: Omit<TimeEntry, 'id' | 'studentId' | 'studentName' | 'status'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: Date.now().toString(),
      studentId: user!.id,
      studentName: user!.name,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    const storedEntries = localStorage.getItem('timeEntries');
    const allEntries: TimeEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
    const updatedEntries = [...allEntries, newEntry];
    localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));

    setEntries([...entries, newEntry]);
    setShowAddEntry(false);
  };

  const handleDeleteEntry = (id: string) => {
    const storedEntries = localStorage.getItem('timeEntries');
    if (storedEntries) {
      const allEntries: TimeEntry[] = JSON.parse(storedEntries);
      const updatedEntries = allEntries.filter(e => e.id !== id);
      localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const handleUpdateEntry = (id: string, updates: Partial<TimeEntry>) => {
    const storedEntries = localStorage.getItem('timeEntries');
    if (storedEntries) {
      const allEntries: TimeEntry[] = JSON.parse(storedEntries);
      const updatedEntries = allEntries.map(e => 
        e.id === id ? { ...e, ...updates } : e
      );
      localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));
      setEntries(entries.map(e => e.id === id ? { ...e, ...updates } : e));
    }
  };

  const draftEntries = entries.filter(e => e.status === 'draft');
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

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
                <p className="text-sm text-[#FFC629]">Timesheet Portal - {user?.name}</p>
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-[#A32035] shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#737373]">Draft Entries</CardDescription>
              <CardTitle className="text-3xl text-[#A32035]">{draftEntries.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-[#FFC629] shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#737373]">Total Entries</CardDescription>
              <CardTitle className="text-3xl text-[#A32035]">{entries.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-[#A32035] shadow-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-[#737373]">This Month Hours</CardDescription>
              <CardTitle className="text-3xl text-[#A32035]">
                {entries
                  .filter(e => e.date.startsWith(format(new Date(), 'yyyy-MM')))
                  .reduce((sum, e) => sum + e.hoursWorked, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="add" className="space-y-6">
          <TabsList>
            <TabsTrigger value="add">
              <Plus className="h-4 w-4 mr-2" />
              Add Time
            </TabsTrigger>
            <TabsTrigger value="review">
              <Calendar className="h-4 w-4 mr-2" />
              Monthly Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Time Entry</CardTitle>
                <CardDescription>Record your work hours and location</CardDescription>
              </CardHeader>
              <CardContent>
                {!showAddEntry ? (
                  <Button onClick={() => setShowAddEntry(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Time Entry
                  </Button>
                ) : (
                  <AddTimeEntry
                    onAdd={handleAddEntry}
                    onCancel={() => setShowAddEntry(false)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Recent Entries */}
            {recentEntries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Entries</CardTitle>
                  <CardDescription>Your latest time entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentEntries.map(entry => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{format(new Date(entry.date), 'MMM dd, yyyy')}</p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              entry.status === 'approved' ? 'bg-green-100 text-green-700' :
                              entry.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                              entry.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {entry.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.location} • {entry.hoursWorked} hours</p>
                        </div>
                        {entry.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="review">
            <MonthlyReview 
              entries={entries} 
              onUpdateEntry={handleUpdateEntry}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}