import { Clock, Users } from 'lucide-react';
import type { TimeSlot } from '../../types/booking';

/**
 * ⏰ TimeSlotGrid Component
 * Modern Health / BetterHelp style time picker
 * Features:
 * - Grid layout for easy selection
 * - Shows availability status
 * - Smooth hover states
 * - Accessible keyboard navigation
 */

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  loading?: boolean;
  className?: string;
}

export function TimeSlotGrid({
  slots,
  selectedTime,
  onSelectTime,
  loading = false,
  className = '',
}: TimeSlotGridProps) {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2 text-fg-secondary">
          <Clock className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading available times...</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-bg-subtle rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-full mb-4">
          <Clock className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-fg mb-2">
          No times available
        </h3>
        <p className="text-sm text-fg-secondary">
          Please select a different date
        </p>
      </div>
    );
  }

  const availableSlots = slots.filter(slot => slot.available);
  const unavailableCount = slots.length - availableSlots.length;

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-fg">
            Available Times
          </h3>
        </div>
        {availableSlots.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-fg-muted">
            <Users className="w-4 h-4" />
            <span>{availableSlots.length} slots</span>
          </div>
        )}
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.time;
          const isAvailable = slot.available;

          return (
            <button
              key={slot.time}
              type="button"
              onClick={() => isAvailable && onSelectTime(slot.time)}
              disabled={!isAvailable}
              className={`
                relative px-4 py-3 rounded-xl text-sm font-semibold
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${isSelected
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : isAvailable
                  ? 'bg-white border-2 border-border hover:border-primary hover:shadow-md text-fg'
                  : 'bg-bg-subtle border border-border-light text-fg-disabled cursor-not-allowed opacity-50'
                }
              `}
              aria-label={`${slot.label}${!isAvailable ? ' - Not available' : ''}`}
              aria-pressed={isSelected}
              aria-disabled={!isAvailable}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span>{slot.label}</span>
                {slot.remainingSlots !== undefined && slot.remainingSlots > 0 && slot.remainingSlots <= 3 && isAvailable && (
                  <span className="text-[10px] opacity-75">
                    {slot.remainingSlots} left
                  </span>
                )}
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-warm rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Footer */}
      {unavailableCount > 0 && (
        <p className="mt-4 text-xs text-fg-muted text-center">
          {unavailableCount} time{unavailableCount > 1 ? 's' : ''} already booked
        </p>
      )}
    </div>
  );
}
