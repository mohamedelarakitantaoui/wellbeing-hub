import { Calendar, CalendarX, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

/**
 * 🚫 Empty & Error State Components
 * Clean, friendly messages for booking states
 */

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: 'calendar' | 'calendar-x' | 'alert';
  className?: string;
}

export function EmptyState({
  title = 'No appointments yet',
  description = 'You haven\'t booked any counseling sessions.',
  action,
  icon = 'calendar',
  className = '',
}: EmptyStateProps) {
  const iconComponents = {
    calendar: Calendar,
    'calendar-x': CalendarX,
    alert: AlertCircle,
  };

  const IconComponent = iconComponents[icon];

  return (
    <div className={`text-center py-12 px-6 animate-fade-in ${className}`}>
      <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
        <IconComponent className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-fg mb-3">
        {title}
      </h3>
      <p className="text-fg-secondary max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  onDismiss,
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-shake ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
          <XCircle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-red-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-red-700 leading-relaxed mb-4">
            {message}
          </p>
          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SuccessStateProps {
  title: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export function SuccessState({
  title,
  message,
  action,
  className = '',
}: SuccessStateProps) {
  return (
    <div className={`bg-green-50 border-2 border-green-200 rounded-2xl p-6 animate-scale-in ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-green-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-green-700 leading-relaxed mb-4">
            {message}
          </p>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
}

interface NoAvailabilityProps {
  counselorName?: string;
  onSelectDifferentDate?: () => void;
  onSelectDifferentCounselor?: () => void;
  className?: string;
}

export function NoAvailability({
  counselorName,
  onSelectDifferentDate,
  onSelectDifferentCounselor,
  className = '',
}: NoAvailabilityProps) {
  return (
    <div className={`bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center ${className}`}>
      <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
        <CalendarX className="w-8 h-8 text-amber-600" />
      </div>
      <h3 className="text-xl font-bold text-amber-900 mb-3">
        No availability
      </h3>
      <p className="text-sm text-amber-800 leading-relaxed mb-6 max-w-md mx-auto">
        {counselorName 
          ? `${counselorName} is fully booked on this date. Please try another date or choose a different counselor.`
          : 'This date is fully booked. Please try another date or choose a different counselor.'
        }
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onSelectDifferentDate && (
          <button
            onClick={onSelectDifferentDate}
            className="btn-secondary"
          >
            Try Another Date
          </button>
        )}
        {onSelectDifferentCounselor && (
          <button
            onClick={onSelectDifferentCounselor}
            className="btn-secondary"
          >
            Change Counselor
          </button>
        )}
      </div>
    </div>
  );
}

interface ConflictErrorProps {
  message?: string;
  onTryAgain?: () => void;
  className?: string;
}

export function ConflictError({
  message = 'This time slot was just taken by another student. Please choose a different time.',
  onTryAgain,
  className = '',
}: ConflictErrorProps) {
  return (
    <div className={`bg-orange-50 border-2 border-orange-300 rounded-2xl p-6 animate-shake ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-orange-900 mb-2">
            Time slot unavailable
          </h3>
          <p className="text-sm text-orange-800 leading-relaxed mb-4">
            {message}
          </p>
          {onTryAgain && (
            <button
              onClick={onTryAgain}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Choose Another Time
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
