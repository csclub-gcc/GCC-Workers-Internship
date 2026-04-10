import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from './StudentDashboard';
import { AdminDashboard } from './AdminDashboard';
import { Navigate } from 'react-router';

export function DashboardRouter() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
}
