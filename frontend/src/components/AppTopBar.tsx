import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MoodDisplay } from './MoodPicker';
import { useState } from 'react';

interface AppTopBarProps {
  userName?: string;
  userMood?: number;
}

export function AppTopBar({ userName, userMood }: AppTopBarProps) {
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">❤️</div>
          <h1 className="text-xl font-bold text-primary hidden sm:block">
            Hearts & Minds
          </h1>
          <h1 className="text-xl font-bold text-primary sm:hidden">
            H&M
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Today's Mood */}
          {userMood && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-soft rounded-full">
              <span className="text-sm text-text-secondary">Today:</span>
              <MoodDisplay mood={userMood} />
            </div>
          )}

          {/* Notifications */}
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              {userName && (
                <span className="text-sm font-medium text-text hidden md:block">
                  {userName.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
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
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
    </header>
  );
}
