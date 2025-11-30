import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Calendar, TrendingUp, Settings } from 'lucide-react';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  roles?: string[];
}

interface BottomNavProps {
  userRole: string;
}

export function BottomNav({ userRole }: BottomNavProps) {
  const navItems: NavItem[] = [
    { to: '/student/dashboard', icon: Home, label: 'Home' },
    { to: '/student/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/student/booking', icon: Calendar, label: 'Book' },
    { to: '/student/progress', icon: TrendingUp, label: 'Progress' },
    { to: '/student/settings', icon: Settings, label: 'More' },
  ];

  // Filter items based on role if needed
  const visibleItems = navItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-primary-100/60 z-50 shadow-2xl">
      <div className="flex justify-around items-center h-20 px-2 max-w-7xl mx-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 rounded-2xl mx-1 ${
                isActive
                  ? 'text-primary-700 bg-primary-50'
                  : 'text-text-muted hover:text-primary-600 hover:bg-primary-50/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`w-6 h-6 mb-1.5 transition-transform duration-300 ${
                    isActive ? 'scale-110' : ''
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-xs font-medium transition-all ${
                  isActive ? 'font-bold' : ''
                }`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
