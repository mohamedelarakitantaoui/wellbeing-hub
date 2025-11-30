import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Calendar, TrendingUp, Settings, Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MoodDisplay } from './MoodPicker';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  roles?: string[];
}

interface TopNavProps {
  userRole: string;
  userName?: string;
  userMood?: number;
}

export function TopNav({ userRole, userName, userMood }: TopNavProps) {
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems: NavItem[] = [
    { to: '/student/dashboard', icon: Home, label: 'Home' },
    { to: '/student/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/student/booking', icon: Calendar, label: 'Book' },
    { to: '/student/progress', icon: TrendingUp, label: 'Progress' },
    { to: '/student/settings', icon: Settings, label: 'More' },
  ];

  const visibleItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-2xl">❤️</div>
              <h1 className="text-xl font-bold text-[#006341] hidden sm:block">
                Hearts & Minds
              </h1>
              <h1 className="text-xl font-bold text-[#006341] sm:hidden">
                H&M
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center max-w-2xl mx-8">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-[#006341] font-semibold bg-[#F2E8C9]'
                        : 'text-gray-600 hover:text-[#006341] hover:bg-gray-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        className="w-4 h-4"
                        strokeWidth={isActive ? 2.5 : 2}
                        style={{ color: isActive ? '#006341' : undefined }}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Today's Mood - Desktop */}
              {userMood && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFA] rounded-full border border-gray-200">
                  <span className="text-xs font-medium text-gray-600">Today:</span>
                  <MoodDisplay mood={userMood} />
                </div>
              )}

              {/* Notifications - Desktop */}
              <button 
                className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Menu - Desktop */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#006341]/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#006341]" />
                  </div>
                  {userName && (
                    <span className="text-sm font-medium text-gray-700">
                      {userName.split(' ')[0]}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
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
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-1">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setShowMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all ${
                      isActive
                        ? 'text-[#006341] font-semibold bg-[#F2E8C9]'
                        : 'text-gray-600 hover:text-[#006341] hover:bg-gray-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon 
                        className="w-5 h-5"
                        strokeWidth={isActive ? 2.5 : 2}
                        style={{ color: isActive ? '#006341' : undefined }}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
              
              {/* Mobile Menu Footer */}
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                {userMood && (
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span className="text-sm font-medium text-gray-600">Today's Mood:</span>
                    <MoodDisplay mood={userMood} />
                  </div>
                )}
                
                {userName && (
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#006341]/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#006341]" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{userName}</span>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    logout();
                  }}
                  className="w-full px-4 py-3 text-left text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Spacer for fixed nav */}
      <div className="h-16"></div>
    </>
  );
}
