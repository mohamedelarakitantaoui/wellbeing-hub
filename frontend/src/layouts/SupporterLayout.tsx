import type { ReactNode } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Calendar,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Shield
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface SupporterLayoutProps {
  children?: ReactNode;
}

export function SupporterLayout({ children }: SupporterLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { to: '/supporter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/supporter/queue', icon: Users, label: 'Student Queue' },
    { to: '/supporter/active-chats', icon: MessageSquare, label: 'Active Chats' },
    { to: '/supporter/calendar', icon: Calendar, label: 'My Calendar' },
    { to: '/supporter/case-notes', icon: ClipboardList, label: 'Case Notes' },
    { to: '/supporter/resources', icon: FileText, label: 'Resources' },
    { to: '/supporter/settings', icon: Settings, label: 'Settings' },
  ];

  const roleLabel = user?.role === 'counselor' ? 'Counselor' : 'Peer Tutor';

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* Sidebar - Professional Layout */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 bg-[#006341] rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-gray-900">Support Portal</h1>
                  <p className="text-xs text-gray-500">{roleLabel}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'text-white bg-[#006341] shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${!sidebarOpen && 'justify-center'}`
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Profile Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors ${
                  !sidebarOpen && 'justify-center'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#006341]/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#006341]" />
                </div>
                {sidebarOpen && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.displayName}
                    </p>
                    <p className="text-xs text-gray-500">{roleLabel}</p>
                  </div>
                )}
              </button>

              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {sidebarOpen && 'Sign Out'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div 
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome back, {user?.displayName?.split(' ')[0]}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
