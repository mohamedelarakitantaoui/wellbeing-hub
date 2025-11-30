import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle } from 'lucide-react';
import { CalendarPicker } from '../../components/booking/CalendarPicker';
import { TimeSlotGrid } from '../../components/booking/TimeSlotGrid';
import { EmptyState, ErrorState, NoAvailability, ConflictError } from '../../components/booking/BookingStates';
import { CalendarSkeleton, TimeSlotsSkeleton, CounselorCardSkeleton } from '../../components/booking/BookingSkeletons';
import { api } from '../../lib/api';
import type { Counselor, TimeSlot } from '../../types/booking';

/**
 * 🌟 Professional Booking Page
 * Inspired by: BetterHelp, Headspace Care, Modern Health, Talkspace
 * 
 * Features:
 * ✅ Step-by-step booking flow
 * ✅ Real-time availability checking
 * ✅ Conflict detection
 * ✅ Loading skeletons
 * ✅ Error handling
 * ✅ Accessibility-first
 * ✅ Smooth animations
 */

type BookingStep = 'counselor' | 'datetime' | 'notes' | 'confirm';

export function StudentBookingNew() {
  const navigate = useNavigate();
  
  // State
  const [step, setStep] = useState<BookingStep>('counselor');
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration] = useState<number>(60); // Fixed 60 min sessions
  const [notes, setNotes] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  // Loading states
  const [loadingCounselors, setLoadingCounselors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [conflictError, setConflictError] = useState(false);
  
  // Fetch counselors on mount
  useEffect(() => {
    fetchCounselors();
  }, []);
  
  // Fetch time slots when date changes
  useEffect(() => {
    if (selectedCounselor && selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedCounselor, selectedDate]);

  const fetchCounselors = async () => {
    try {
      setLoadingCounselors(true);
      setError(null);
      const data = await api.getCounselors();
      setCounselors(data.counselors || []);
      
      if (!data.counselors || data.counselors.length === 0) {
        setError('No counselors available at the moment. Please try again later.');
      }
    } catch (err: any) {
      console.error('Error fetching counselors:', err);
      setError(err.message || 'Failed to load counselors. Please check your connection.');
    } finally {
      setLoadingCounselors(false);
    }
  };

  const fetchTimeSlots = async () => {
    if (!selectedCounselor || !selectedDate) return;
    
    try {
      setLoadingSlots(true);
      setError(null);
      
      // Generate time slots for the selected date
      const slots = generateTimeSlots(selectedDate);
      
      // Get existing bookings for this counselor on this date
      const bookingsData = await api.getMyBookings();
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Filter bookings for this counselor and date
      const existingBookings = (bookingsData.bookings || []).filter((booking: any) => {
        const bookingDate = new Date(booking.startAt).toISOString().split('T')[0];
        return (
          booking.counselorId === selectedCounselor.id &&
          bookingDate === dateStr &&
          booking.status !== 'CANCELLED'
        );
      });
      
      // Mark unavailable slots
      const availableSlots = slots.map(slot => {
        const slotDateTime = new Date(`${dateStr}T${slot.time}`);
        const isBooked = existingBookings.some((booking: any) => {
          const bookingStart = new Date(booking.startAt);
          const bookingEnd = new Date(booking.endAt);
          return slotDateTime >= bookingStart && slotDateTime < bookingEnd;
        });
        
        return {
          ...slot,
          available: !isBooked,
        };
      });
      
      setTimeSlots(availableSlots);
    } catch (err: any) {
      console.error('Error fetching time slots:', err);
      setError('Failed to load available times. Please try again.');
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const generateTimeSlots = (_date: Date): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    // Generate slots from 9 AM to 5 PM (last appointment at 4 PM for 60-min session)
    for (let hour = 9; hour <= 16; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const label = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      
      slots.push({
        time,
        label,
        available: true,
      });
    }
    
    return slots;
  };

  const handleCounselorSelect = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setSelectedDate(null);
    setSelectedTime(null);
    setError(null);
    setConflictError(false);
    setStep('datetime');
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setConflictError(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setConflictError(false);
  };

  const handleContinueToNotes = () => {
    if (!selectedDate || !selectedTime) return;
    setStep('notes');
  };

  const handleSubmit = async () => {
    if (!selectedCounselor || !selectedDate || !selectedTime) return;
    
    try {
      setSubmitting(true);
      setError(null);
      setConflictError(false);
      
      // Create start and end datetime
      const dateStr = selectedDate.toISOString().split('T')[0];
      const startDateTime = new Date(`${dateStr}T${selectedTime}`);
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
      
      const bookingData = {
        counselorId: selectedCounselor.id,
        startAt: startDateTime.toISOString(),
        endAt: endDateTime.toISOString(),
        notes: notes.trim() || undefined,
      };
      
      const response = await api.createBooking(bookingData);
      
      // Success! Navigate to confirmation page
      navigate('/student/booking-confirmation', {
        state: { bookingId: response.booking.id },
      });
      
    } catch (err: any) {
      console.error('Booking error:', err);
      
      if (err.message?.toLowerCase().includes('not available') || 
          err.message?.toLowerCase().includes('conflict')) {
        setConflictError(true);
        // Refresh time slots
        await fetchTimeSlots();
      } else {
        setError(err.message || 'Failed to create booking. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToDateTime = () => {
    setStep('datetime');
    setConflictError(false);
  };

  const handleBackToCounselor = () => {
    setStep('counselor');
    setSelectedCounselor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setError(null);
    setConflictError(false);
  };

  const canProceed = selectedDate && selectedTime && !loadingSlots;

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-fg-secondary hover:text-primary mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-fg mb-3">
            Book a Counseling Session
          </h1>
          <p className="text-lg text-fg-secondary">
            Schedule a confidential, one-on-one session with a professional counselor
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { key: 'counselor', label: 'Choose Counselor' },
              { key: 'datetime', label: 'Pick Date & Time' },
              { key: 'notes', label: 'Confirm Booking' },
            ].map((s, idx, arr) => {
              const isActive = step === s.key;
              const isCompleted = 
                (s.key === 'counselor' && selectedCounselor) ||
                (s.key === 'datetime' && selectedDate && selectedTime);
              
              return (
                <div key={s.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                        transition-all duration-300
                        ${isCompleted
                          ? 'bg-primary text-white'
                          : isActive
                          ? 'bg-primary text-white ring-4 ring-primary/20'
                          : 'bg-bg-subtle text-fg-muted'
                        }
                      `}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`
                        mt-2 text-xs font-medium text-center
                        ${isActive ? 'text-primary' : 'text-fg-muted'}
                      `}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div
                      className={`
                        flex-1 h-1 -mt-8 mx-2 rounded-full transition-all duration-300
                        ${isCompleted ? 'bg-primary' : 'bg-border'}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Step 1: Select Counselor */}
          {step === 'counselor' && (
            <div className="animate-fade-in">
              <div className="card p-6 mb-6">
                <h2 className="text-2xl font-bold text-fg mb-2">
                  Choose Your Counselor
                </h2>
                <p className="text-fg-secondary mb-6">
                  Select the counselor you'd like to meet with
                </p>

                {loadingCounselors ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <CounselorCardSkeleton key={i} />)}
                  </div>
                ) : error ? (
                  <ErrorState
                    message={error}
                    onRetry={fetchCounselors}
                  />
                ) : counselors.length === 0 ? (
                  <EmptyState
                    title="No counselors available"
                    description="There are no counselors available at the moment. Please check back later."
                    icon="alert"
                  />
                ) : (
                  <div className="grid gap-4">
                    {counselors.map((counselor) => (
                      <button
                        key={counselor.id}
                        onClick={() => handleCounselorSelect(counselor)}
                        className="card p-5 text-left hover:shadow-xl hover:scale-[1.02] transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <User className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-fg mb-1 group-hover:text-primary transition-colors">
                              {counselor.name}
                            </h3>
                            <p className="text-sm text-fg-secondary">
                              {counselor.email}
                            </p>
                            {counselor.specialization && (
                              <p className="text-xs text-primary font-medium mt-1">
                                {counselor.specialization}
                              </p>
                            )}
                          </div>
                          <ArrowLeft className="w-5 h-5 text-fg-muted rotate-180 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 'datetime' && selectedCounselor && (
            <div className="animate-fade-in space-y-6">
              {/* Selected Counselor Display */}
              <div className="card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-fg-muted font-semibold uppercase tracking-wide">
                        Selected Counselor
                      </p>
                      <p className="font-bold text-fg">{selectedCounselor.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleBackToCounselor}
                    className="btn-ghost text-sm"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Calendar & Time Slots */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  {loadingCounselors ? (
                    <CalendarSkeleton />
                  ) : (
                    <CalendarPicker
                      selectedDate={selectedDate}
                      onSelectDate={handleDateSelect}
                      minDate={new Date()}
                    />
                  )}
                </div>

                {/* Time Slots */}
                <div>
                  {selectedDate ? (
                    <div className="card p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-fg mb-1">
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </h3>
                        <p className="text-sm text-fg-secondary">
                          Select a time for your 60-minute session
                        </p>
                      </div>

                      {conflictError && (
                        <ConflictError
                          onTryAgain={() => setConflictError(false)}
                          className="mb-4"
                        />
                      )}

                      {loadingSlots ? (
                        <TimeSlotsSkeleton />
                      ) : timeSlots.filter(s => s.available).length === 0 ? (
                        <NoAvailability
                          counselorName={selectedCounselor.name}
                          onSelectDifferentDate={() => setSelectedDate(null)}
                          onSelectDifferentCounselor={handleBackToCounselor}
                        />
                      ) : (
                        <TimeSlotGrid
                          slots={timeSlots}
                          selectedTime={selectedTime}
                          onSelectTime={handleTimeSelect}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="card p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        📅
                      </div>
                      <h3 className="text-lg font-semibold text-fg mb-2">
                        Select a date
                      </h3>
                      <p className="text-sm text-fg-secondary">
                        Choose a date from the calendar to see available times
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              {canProceed && (
                <div className="flex justify-end animate-slide-up">
                  <button
                    onClick={handleContinueToNotes}
                    className="btn-primary px-8"
                  >
                    Continue to Booking Details
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Notes & Confirmation */}
          {step === 'notes' && selectedCounselor && selectedDate && selectedTime && (
            <div className="animate-fade-in space-y-6">
              {/* Booking Summary */}
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-fg mb-6">
                  Confirm Your Booking
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Counselor */}
                  <div className="flex items-start gap-4 p-4 bg-bg-subtle rounded-xl">
                    <User className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-fg-muted font-semibold uppercase tracking-wide">
                        Counselor
                      </p>
                      <p className="font-bold text-fg">{selectedCounselor.name}</p>
                      <p className="text-sm text-fg-secondary">{selectedCounselor.email}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-bg-subtle rounded-xl">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="text-xs text-fg-muted font-semibold uppercase tracking-wide">
                          Date
                        </p>
                        <p className="font-bold text-fg">
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-bg-subtle rounded-xl">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <p className="text-xs text-fg-muted font-semibold uppercase tracking-wide">
                          Time
                        </p>
                        <p className="font-bold text-fg">
                          {new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                        <p className="text-xs text-fg-muted">60 minutes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-fg mb-2">
                    What would you like to discuss? (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share what's on your mind. This helps your counselor prepare for the session..."
                    rows={5}
                    className="input-field resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-fg-muted mt-2">
                    {notes.length}/500 characters
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    📝 Before your session:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• You'll receive a confirmation email</li>
                    <li>• Sessions are confidential and secure</li>
                    <li>• You can cancel up to 24 hours before</li>
                    <li>• Join 5 minutes early for best experience</li>
                  </ul>
                </div>

                {error && (
                  <ErrorState
                    message={error}
                    onDismiss={() => setError(null)}
                    className="mb-6"
                  />
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleBackToDateTime}
                    disabled={submitting}
                    className="flex-1 btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Confirming...
                      </span>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-sm text-fg-muted animate-fade-in">
          <p>
            Need help? Contact{' '}
            <a href="mailto:support@aui.edu" className="text-primary hover:underline">
              support@aui.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
