import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppShell from '../layouts/AppShell';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Dashboard from '../features/dashboard/Dashboard';
import Members from '../features/members/Members';
import Activities from '../features/activities/Activities';
import Bookings from '../features/bookings/Bookings';
import Calendar from '../features/calendar/Calendar';
import Memberships from '../features/memberships/Memberships';
import Attendance from '../features/attendance/Attendance';
import Payments from '../features/payments/Payments';
import Crm from '../features/crm/Crm';
import Messages from '../features/messaging/Messages';
import Reports from '../features/reports/Reports';
import Settings from '../features/settings/Settings';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'activities', element: <Activities /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'members', element: <Members /> },
      { path: 'memberships', element: <Memberships /> },
      { path: 'attendance', element: <Attendance /> },
      { path: 'payments', element: <Payments /> },
      { path: 'crm', element: <Crm /> },
      { path: 'messages', element: <Messages /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/app/dashboard" replace />,
  },
]);
