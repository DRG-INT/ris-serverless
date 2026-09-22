import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: 'LayoutDashboard' },
  { name: 'Calendar', href: '/app/calendar', icon: 'Calendar' },
  { name: 'Activities', href: '/app/activities', icon: 'Activity' },
  { name: 'Bookings', href: '/app/bookings', icon: 'CalendarCheck' },
  { name: 'Members', href: '/app/members', icon: 'Users' },
  { name: 'Memberships', href: '/app/memberships', icon: 'CreditCard' },
  { name: 'Attendance', href: '/app/attendance', icon: 'CheckSquare' },
  { name: 'Payments', href: '/app/payments', icon: 'DollarSign' },
  { name: 'CRM', href: '/app/crm', icon: 'UserPlus' },
  { name: 'Messages', href: '/app/messages', icon: 'Mail' },
  { name: 'Reports', href: '/app/reports', icon: 'BarChart' },
  { name: 'Settings', href: '/app/settings', icon: 'Settings' },
];

const iconMap: Record<string, string> = {
  LayoutDashboard: '📊',
  Calendar: '📅',
  Activity: '🏃',
  CalendarCheck: '✅',
  Users: '👥',
  CreditCard: '💳',
  CheckSquare: '✔️',
  DollarSign: '💰',
  UserPlus: '👤',
  Mail: '✉️',
  BarChart: '📈',
  Settings: '⚙️',
};

export default function AppShell() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 text-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-16 items-center justify-center border-b border-gray-800">
            <h1 className="text-xl font-bold">Recreation in Sport</h1>
          </div>
          <nav className="mt-5 px-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 text-lg">{iconMap[item.icon]}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col lg:pl-64">
          <header className="flex h-16 items-center justify-between bg-white px-4 shadow-sm lg:px-6">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="text-2xl">☰</span>
            </button>
            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm text-gray-700">{user?.email}</span>
              <button
                onClick={logout}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
