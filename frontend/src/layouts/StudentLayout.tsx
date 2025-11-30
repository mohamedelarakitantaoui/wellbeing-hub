import type { ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { MessageCircle, Calendar, TrendingUp, Settings, Bell, User, LogOut, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface StudentLayoutProps {
  children?: ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { to: '/student/chat', icon: MessageCircle, label: 'Chat Support' },
    { to: '/student/booking', icon: Calendar, label: 'Book Session' },
    { to: '/student/progress', icon: TrendingUp, label: 'My Progress' },
    { to: '/student/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFA]">
      {/* Student Navigation - Friendly & Calming */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Warm & Friendly */}
            <button 
              onClick={() => navigate('/student/dashboard')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-primary to-primary-light rounded-full shadow-md">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary">Hearts & Minds</h1>
                <p className="text-xs text-gray-500">Your Wellbeing Journey</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary-50 shadow-sm'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button 
                className="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary/20 to-primary-50 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  {user?.displayName && (
                    <span className="hidden lg:block text-sm font-medium text-gray-700">
                      {user.displayName.split(' ')[0]}
                    </span>
                  )}
                </button>

                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all ${
                      isActive
                        ? 'text-primary bg-primary-50'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
