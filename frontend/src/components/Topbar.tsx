import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../hooks/useUser';

interface TopbarProps {
  userName: string;
  userRole: UserRole;
}

const roleColors = {
  student: 'bg-primary/10 text-primary',
  counselor: 'bg-blue-100 text-blue-700',
  intern: 'bg-teal-100 text-teal-700',
  moderator: 'bg-purple-100 text-purple-700',
  admin: 'bg-accent/10 text-accent',
};

const roleLabels = {
  student: 'Student',
  counselor: 'Counselor',
  intern: 'Intern',
  moderator: 'Moderator',
  admin: 'Administrator',
};

export function Topbar({ userName, userRole }: TopbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text">Dashboard</h2>
          <p className="text-sm text-gray-600 mt-0.5">Welcome back, {userName.split(' ')[0]}!</p>
        </div>

        <div className="flex items-center gap-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${roleColors[userRole]}`}>
            {roleLabels[userRole]}
          </span>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {initials}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-fade-in-up">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-text text-sm">{userName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{roleLabels[userRole]}</p>
                </div>

                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                  <User className="w-4 h-4 text-gray-500" />
                  My Profile
                </button>

                <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                  <Settings className="w-4 h-4 text-gray-500" />
                  Settings
                </button>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
