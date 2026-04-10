import { createBrowserRouter } from 'react-router';
import { LoginPage } from './components/LoginPage';
import { DashboardRouter } from './components/DashboardRouter';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardRouter />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <LoginPage />,
  },
]);
