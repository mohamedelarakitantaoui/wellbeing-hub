import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 📅 CalendarPicker Component
 * Clean, intuitive date picker inspired by BetterHelp & Headspace
 * Features:
 * - Month navigation
 * - Disabled past dates
 * - Disabled fully booked dates
 * - Highlight selected date
 * - Smooth animations
 * - Accessibility-first
 */

interface CalendarPickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  disabledDates?: string[]; // Array of ISO date strings (YYYY-MM-DD)
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function CalendarPicker({
  selectedDate,
  onSelectDate,
  disabledDates = [],
  minDate = new Date(),
  maxDate,
  className = '',
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate || new Date()
  );

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentMonth]);

  const isDateDisabled = (date: Date | null): boolean => {
    if (!date) return true;
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    
    // Check if date is before minDate
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }
    
    // Check if date is after maxDate
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (date > max) return true;
    }
    
    // Check if date is in disabledDates array
    if (disabledDates.includes(dateStr)) return true;
    
    return false;
  };

  const isDateSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date | null) => {
    if (!date || isDateDisabled(date)) return;
    onSelectDate(date);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const canGoPrevious = useMemo(() => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const today = new Date();
    today.setDate(1);
    today.setHours(0, 0, 0, 0);
    return prevMonth >= today || (minDate && prevMonth >= new Date(minDate.getFullYear(), minDate.getMonth()));
  }, [currentMonth, minDate]);

  const canGoNext = useMemo(() => {
    if (!maxDate) return true;
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    return nextMonth <= new Date(maxDate.getFullYear(), maxDate.getMonth());
  }, [currentMonth, maxDate]);

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border border-border ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handlePreviousMonth}
          disabled={!canGoPrevious}
          className="p-2 rounded-lg hover:bg-bg-subtle disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-fg" />
        </button>
        
        <h3 className="text-lg font-bold text-fg">
          {monthName}
        </h3>
        
        <button
          type="button"
          onClick={handleNextMonth}
          disabled={!canGoNext}
          className="p-2 rounded-lg hover:bg-bg-subtle disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-fg" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-fg-muted uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2" role="grid">
        {daysInMonth.map((date, index) => {
          const disabled = isDateDisabled(date);
          const selected = isDateSelected(date);
          const isToday = date && 
            date.toDateString() === new Date().toDateString();

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${!date ? 'invisible' : ''}
                ${disabled ? 
                  'text-fg-disabled cursor-not-allowed opacity-40' : 
                  'cursor-pointer hover:bg-bg-hover'
                }
                ${selected ? 
                  'bg-primary text-white hover:bg-primary-light shadow-md' : 
                  'text-fg'
                }
                ${isToday && !selected ? 
                  'border-2 border-primary' : 
                  'border border-transparent'
                }
              `}
              aria-label={date ? date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : undefined}
              aria-selected={selected}
              aria-disabled={disabled}
              role="gridcell"
            >
              {date ? date.getDate() : ''}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border-light flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-primary"></div>
          <span className="text-fg-secondary">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary"></div>
          <span className="text-fg-secondary">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-200 opacity-40"></div>
          <span className="text-fg-secondary">Unavailable</span>
        </div>
      </div>
    </div>
  );
}
