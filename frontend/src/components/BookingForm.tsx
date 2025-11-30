import { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { getToken } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Counselor {
  id: string;
  name: string;
  email: string;
}

interface BookingFormProps {
  onSuccess: (bookingId: string) => void;
  onCancel?: () => void;
}

export function BookingForm({ onSuccess, onCancel }: BookingFormProps) {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('60'); // minutes
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError('Please log in to book a session');
        return;
      }
      
      console.log('Fetching counselors from:', `${API_URL}/bookings/counselors`);
      
      const response = await fetch(`${API_URL}/bookings/counselors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
        } else if (response.status === 404) {
          setError('Booking service not available. Please contact support.');
          console.error('404 Error - Route not found. Check backend is running on port 5000');
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch counselors');
        }
        return;
      }
      
      const data = await response.json();
      console.log('Counselors data:', data);
      setCounselors(data.counselors || []);
      
      if (!data.counselors || data.counselors.length === 0) {
        setError('No counselors available at the moment');
      }
    } catch (err: any) {
      console.error('Error fetching counselors:', err);
      setError(err.message || 'Failed to load counselors. Please check your connection.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCounselor || !selectedDate || !selectedTime) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Combine date and time to create ISO datetime strings
      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(duration) * 60000);

      const token = getToken();
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          counselorId: selectedCounselor,
          startAt: startDateTime.toISOString(),
          endAt: endDateTime.toISOString(),
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const data = await response.json();
      onSuccess(data.booking.id);
    } catch (err: any) {
      console.error('Booking error:', err);
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots (9 AM to 5 PM, every 30 minutes)
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 17 && minute === 30) break; // Stop at 5:00 PM
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const label = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
      timeSlots.push({ value: time, label });
    }
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Select Counselor */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          <User className="w-4 h-4 inline mr-1" />
          Choose a Counselor *
        </label>
        <select
          value={selectedCounselor}
          onChange={(e) => setSelectedCounselor(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select a counselor...</option>
          {counselors.map((counselor) => (
            <option key={counselor.id} value={counselor.id}>
              {counselor.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date *
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={today}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Time *
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select time...</option>
            {timeSlots.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Session Duration
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '30', label: '30 min' },
            { value: '60', label: '60 min' },
            { value: '90', label: '90 min' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setDuration(option.value)}
              className={`
                py-3 px-4 rounded-lg font-medium transition-all
                ${duration === option.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-text hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Reason for Booking (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Briefly describe what you'd like to discuss..."
          rows={4}
          className="input-field resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !selectedCounselor || !selectedDate || !selectedTime}
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  );
}
