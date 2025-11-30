import { Calendar, Clock, User, Video, X, Edit2 } from 'lucide-react';
import type { Booking } from '../../types/booking';

/**
 * 🎫 BookingCard Component
 * Displays upcoming appointment with actions
 * Inspired by: BetterHelp, Talkspace, Modern Health
 */

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  onReschedule?: (bookingId: string) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export function BookingCard({
  booking,
  onCancel,
  onReschedule,
  showActions = true,
  compact = false,
  className = '',
}: BookingCardProps) {
  const startDate = new Date(booking.startAt);
  const endDate = new Date(booking.endAt);
  const isPast = startDate < new Date();
  const isCancelled = booking.status === 'CANCELLED';
  const isCompleted = booking.status === 'COMPLETED';
  
  const canModify = !isPast && !isCancelled && !isCompleted;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDuration = () => {
    const minutes = Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getStatusBadge = () => {
    const styles: Record<string, string> = {
      CONFIRMED: 'bg-green-50 text-green-700 border-green-200',
      PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      CANCELLED: 'bg-red-50 text-red-700 border-red-200',
      COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${styles[booking.status] || styles.PENDING}`}>
        {booking.status}
      </span>
    );
  };

  const getTimeUntil = () => {
    if (isPast) return null;
    const now = new Date();
    const diffMs = startDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    return 'soon';
  };

  if (compact) {
    return (
      <div className={`bg-white border border-border rounded-xl p-4 hover:shadow-md transition-all ${className}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-primary shrink-0" />
              <span className="font-semibold text-fg truncate">
                {booking.counselor.name}
              </span>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-4 text-sm text-fg-secondary">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{formatTime(startDate)}</span>
              </div>
            </div>
          </div>
          
          {showActions && canModify && (
            <div className="flex gap-2 shrink-0">
              {onReschedule && (
                <button
                  onClick={() => onReschedule(booking.id)}
                  className="p-2 hover:bg-bg-subtle rounded-lg transition-colors"
                  aria-label="Reschedule appointment"
                  title="Reschedule"
                >
                  <Edit2 className="w-4 h-4 text-primary" />
                </button>
              )}
              {onCancel && (
                <button
                  onClick={() => onCancel(booking.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Cancel appointment"
                  title="Cancel"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-6 hover:shadow-xl transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-fg mb-1">
              {booking.counselor.name}
            </h3>
            <p className="text-sm text-fg-secondary">
              {booking.counselor.email}
            </p>
            {!isPast && getTimeUntil() && (
              <p className="text-xs text-primary font-semibold mt-1">
                Starting {getTimeUntil()}
              </p>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Date & Time Info */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="flex items-start gap-3 p-4 bg-bg-subtle rounded-xl">
          <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-fg-muted font-semibold uppercase tracking-wide mb-1">
              Date
            </p>
            <p className="text-sm font-bold text-fg">
              {formatDate(startDate)}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-bg-subtle rounded-xl">
          <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-fg-muted font-semibold uppercase tracking-wide mb-1">
              Time
            </p>
            <p className="text-sm font-bold text-fg">
              {formatTime(startDate)} - {formatTime(endDate)}
            </p>
            <p className="text-xs text-fg-muted mt-0.5">
              Duration: {getDuration()}
            </p>
          </div>
        </div>
      </div>

      {/* Session Type (Mock - can be enhanced) */}
      <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl mb-5">
        <Video className="w-5 h-5 text-primary shrink-0" />
        <div>
          <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-0.5">
            Session Type
          </p>
          <p className="text-sm font-medium text-fg">
            Video Call
          </p>
        </div>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-2">
            Your Notes
          </p>
          <p className="text-sm text-fg leading-relaxed">
            {booking.notes}
          </p>
        </div>
      )}

      {/* Actions */}
      {showActions && canModify && (
        <div className="flex gap-3 pt-5 border-t border-border-light">
          {onReschedule && (
            <button
              onClick={() => onReschedule(booking.id)}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Reschedule
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              className="flex-1 btn-secondary text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}
