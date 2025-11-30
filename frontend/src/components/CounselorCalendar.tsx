import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Counselor {
  id: string;
  name: string;
  email: string;
}

interface CounselorCalendarProps {
  counselorId?: string;
  onSelectSlot?: (counselorId: string, startTime: Date, endTime: Date) => void;
}

export function CounselorCalendar({ counselorId, onSelectSlot }: CounselorCalendarProps) {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState(counselorId || '');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchCounselors();
  }, []);

  useEffect(() => {
    if (counselorId) {
      setSelectedCounselor(counselorId);
    }
  }, [counselorId]);

  const fetchCounselors = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings/counselors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch counselors');
      const data = await response.json();
      setCounselors(data.counselors || []);
      if (data.counselors?.length > 0 && !selectedCounselor) {
        setSelectedCounselor(data.counselors[0].id);
      }
    } catch (err) {
      console.error('Error fetching counselors:', err);
    }
  };

  // Generate days for the current week
  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Generate time slots (9 AM to 5 PM)
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(hour);
    }
    return slots;
  };

  const weekDays = getWeekDays();
  const timeSlots = getTimeSlots();

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const isSlotAvailable = (day: Date, hour: number) => {
    // Check if slot is in the past
    const slotTime = new Date(day);
    slotTime.setHours(hour, 0, 0, 0);
    if (slotTime < new Date()) return false;

    // Check if slot is booked
    // This would need actual booking data from the backend
    return true;
  };

  const handleSlotClick = (day: Date, hour: number) => {
    const startTime = new Date(day);
    startTime.setHours(hour, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(hour + 1, 0, 0, 0);

    if (onSelectSlot && selectedCounselor) {
      onSelectSlot(selectedCounselor, startTime, endTime);
    }
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Counselor Selection */}
      {!counselorId && counselors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Select Counselor
          </label>
          <select
            value={selectedCounselor}
            onChange={(e) => setSelectedCounselor(e.target.value)}
            className="input-field"
          >
            {counselors.map((counselor) => (
              <option key={counselor.id} value={counselor.id}>
                {counselor.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {formatMonthYear()}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-text" />
          </button>
          <button
            type="button"
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-text" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-sm font-medium text-text-secondary text-center">
              <Clock className="w-4 h-4 mx-auto" />
            </div>
            {weekDays.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs font-medium text-text-secondary">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-sm font-semibold ${
                  day.toDateString() === new Date().toDateString()
                    ? 'text-primary'
                    : 'text-text'
                }`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-1">
            {timeSlots.map((hour) => (
              <div key={hour} className="grid grid-cols-8 gap-2">
                <div className="text-xs text-text-secondary text-center py-2">
                  {new Date(2000, 0, 1, hour).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    hour12: true,
                  })}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const available = isSlotAvailable(day, hour);
                  return (
                    <button
                      key={dayIndex}
                      type="button"
                      onClick={() => available && handleSlotClick(day, hour)}
                      disabled={!available}
                      className={`
                        py-2 rounded-lg text-xs font-medium transition-all
                        ${available
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {available ? 'Open' : 'Busy'}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
