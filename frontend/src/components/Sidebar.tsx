import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Heart, 
  MessageCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  Settings
} from 'lucide-react';
import type { UserRole } from '../hooks/useUser';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Heart, label: 'Get Support', path: '/triage', roles: ['student'] },
  { icon: MessageCircle, label: 'My Chats', path: '/support/my-rooms' },
  { icon: Users, label: 'Support Queue', path: '/supporter/queue', roles: ['counselor', 'intern', 'moderator', 'admin'] },
  { icon: Shield, label: 'Peer Applications', path: '/admin/peers', roles: ['admin'] },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  userRole: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const filteredItems = navItems.filter(
    item => !item.roles || item.roles.includes(userRole)
  );

  return (
    <aside 
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AUI Wellbeing
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-primary'}`} />
                {!collapsed && (
                  <span className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t border-gray-200 ${collapsed ? 'text-center' : ''}`}>
          <p className={`text-xs text-gray-500 ${collapsed ? 'hidden' : ''}`}>
            © 2025 AUI Wellbeing Hub
          </p>
        </div>
      </div>
    </aside>
  );
}
