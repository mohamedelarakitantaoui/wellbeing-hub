import type { LucideIcon } from 'lucide-react';
import { Calendar, MessageCircle, MessageSquare, TrendingUp } from 'lucide-react';

/**
 * 🎨 Empty State Component
 * Clean, calming empty state with icon and actions
 */

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: 'default' | 'minimal';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default'
}: EmptyStateProps) {
  if (variant === 'minimal') {
    return (
      <div className="text-center py-8">
        <Icon className="w-12 h-12 text-fg-muted mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-semibold text-fg mb-1">{title}</h3>
        <p className="text-fg-secondary text-sm">{description}</p>
        {action && (
          <div className="mt-4">
            {action.href ? (
              <a href={action.href} className="btn-primary">
                {action.label}
              </a>
            ) : (
              <button onClick={action.onClick} className="btn-primary">
                {action.label}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card p-12 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-primary" strokeWidth={1.5} />
      </div>
      
      <h3 className="text-2xl font-bold text-fg mb-3">{title}</h3>
      <p className="text-fg-secondary text-lg mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {action && (
          action.href ? (
            <a href={action.href} className="btn-primary px-8">
              {action.label}
            </a>
          ) : (
            <button onClick={action.onClick} className="btn-primary px-8">
              {action.label}
            </button>
          )
        )}
        
        {secondaryAction && (
          secondaryAction.href ? (
            <a href={secondaryAction.href} className="btn-secondary px-8">
              {secondaryAction.label}
            </a>
          ) : (
            <button onClick={secondaryAction.onClick} className="btn-secondary px-8">
              {secondaryAction.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}

// Specialized empty states
export function NoBookings() {
  return (
    <EmptyState
      icon={Calendar}
      title="No bookings yet"
      description="Schedule your first counseling session to get personalized support from our professional counselors."
      action={{ label: 'Book a Session', href: '/student/booking' }}
    />
  );
}

export function NoMessages() {
  return (
    <EmptyState
      icon={MessageCircle}
      title="No messages yet"
      description="Start a conversation to get support from our trained peer supporters."
      variant="minimal"
    />
  );
}

export function NoSupportRooms() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No active support chats"
      description="When you need someone to talk to, start a private chat with a peer supporter. All conversations are confidential."
      action={{ label: 'Start Support Chat', href: '/support/start' }}
    />
  );
}

export function NoProgress() {
  return (
    <EmptyState
      icon={TrendingUp}
      title="No mood data yet"
      description="Track your mood daily to see patterns and insights about your wellbeing journey."
      variant="minimal"
    />
  );
}
