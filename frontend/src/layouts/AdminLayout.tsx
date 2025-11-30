import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck,
  BarChart3,
  Settings,
  Bell,
  Shield,
  FileText,
  Activity,
  AlertCircle,
  LogOut,
  User,
  ChevronLeft,
  Search
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navSections = [
    {
      title: 'Overview',
      items: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
      ]
    },
    {
      title: 'User Management',
      items: [
        { to: '/admin/users', icon: Users, label: 'All Users' },
        { to: '/admin/peer-applications', icon: UserCheck, label: 'Peer Applications' },
      ]
    },
    {
      title: 'Platform',
      items: [
        { to: '/admin/reports', icon: FileText, label: 'Reports' },
        { to: '/admin/activity', icon: Activity, label: 'Activity Logs' },
        { to: '/admin/alerts', icon: AlertCircle, label: 'Alerts' },
      ]
    },
    {
      title: 'System',
      items: [
        { to: '/admin/settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Admin Sidebar - Enterprise Style */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-linear-to-b from-primary to-primary-dark text-white z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 bg-white/20 rounded-lg backdrop-blur-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold">Admin Portal</h1>
                <p className="text-xs text-white/60">Platform Management</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="text"
                placeholder="Search..."
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.25)', color: '#ffffff' }}
                className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 pb-4 space-y-6 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 style={{ color: 'rgba(255, 255, 255, 0.7)' }} className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                          isActive
                            ? 'bg-white text-primary shadow-lg'
                            : 'hover:bg-white/10'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className="w-5 h-5 shrink-0" style={{ color: isActive ? '#004B36' : '#ffffff' }} />
                          <span style={{ color: isActive ? '#004B36' : '#ffffff' }}>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="border-t border-white/10 p-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p style={{ color: '#ffffff' }} className="text-sm font-medium truncate">
                    {user?.displayName}
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)' }} className="text-xs">Administrator</p>
                </div>
              </button>

              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.displayName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Welcome back, {user?.displayName?.split(' ')[0]}
              </h2>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
