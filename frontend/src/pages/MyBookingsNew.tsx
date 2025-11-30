import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { BookingCard } from '../components/booking/BookingCard';
import { EmptyState, ErrorState } from '../components/booking/BookingStates';
import { BookingCardSkeleton } from '../components/booking/BookingSkeletons';
import { CancelBookingModal, RescheduleModal } from '../components/booking/BookingModals';
import { api } from '../lib/api';
import type { Booking } from '../types/booking';

/**
 * 📅 My Bookings Page (Renamed Export)
 * Professional appointment management inspired by BetterHelp & Modern Health
 * 
 * Features:
 * ✅ View all appointments
 * ✅ Filter by upcoming/past
 * ✅ Cancel appointments
 * ✅ Reschedule appointments
 * ✅ Beautiful loading states
 */

export function MyBookingsNew() {
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  
  // Modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingLoading, setCancellingLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMyBookings();
      setBookings(data.bookings || []);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setCancelModalOpen(true);
    }
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;
    
    try {
      setCancellingLoading(true);
      await api.cancelBooking(selectedBooking.id);
      
      // Update local state
      setBookings(prev =>
        prev.map(b =>
          b.id === selectedBooking.id ? { ...b, status: 'CANCELLED' as const } : b
        )
      );
      
      setCancelModalOpen(false);
      setSelectedBooking(null);
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingLoading(false);
    }
  };

  const handleRescheduleClick = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setRescheduleModalOpen(true);
    }
  };

  const handleRescheduleProceed = async () => {
    if (!selectedBooking) return;
    
    // First cancel the current booking
    try {
      await api.cancelBooking(selectedBooking.id);
      setBookings(prev =>
        prev.map(b =>
          b.id === selectedBooking.id ? { ...b, status: 'CANCELLED' as const } : b
        )
      );
    } catch (err) {
      console.error('Error cancelling booking for reschedule:', err);
    }
    
    // Navigate to booking page
    setRescheduleModalOpen(false);
    navigate('/student/booking');
  };

  const filterBookings = () => {
    const now = new Date();
    return bookings.filter((booking) => {
      const startDate = new Date(booking.startAt);
      if (filter === 'upcoming') {
        return startDate >= now && booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED';
      } else if (filter === 'past') {
        return startDate < now || booking.status === 'COMPLETED' || booking.status === 'CANCELLED';
      }
      return true;
    });
  };

  const filteredBookings = filterBookings();

  const formatAppointmentDate = (booking: Booking) => {
    const start = new Date(booking.startAt);
    return start.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <div className="space-y-3">
            <div className="h-10 bg-bg-subtle rounded-lg w-64 animate-pulse" />
            <div className="h-6 bg-bg-subtle rounded-lg w-96 animate-pulse" />
          </div>
          <div className="flex gap-4 border-b border-border-light pb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-bg-subtle rounded-lg w-24 animate-pulse" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => <BookingCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-fg mb-3">My Appointments</h1>
            <p className="text-lg text-fg-secondary">
              Manage your counseling sessions
            </p>
          </div>
          <button
            onClick={() => navigate('/student/booking')}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Booking
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-border-light animate-slide-up">
          {(['upcoming', 'past', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`
                px-6 py-3 font-semibold capitalize transition-all duration-200 relative
                ${filter === tab
                  ? 'text-primary'
                  : 'text-fg-secondary hover:text-fg'
                }
              `}
            >
              {tab}
              {filter === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <ErrorState
            message={error}
            onRetry={fetchBookings}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="animate-fade-in">
            <EmptyState
              title={filter === 'upcoming' ? 'No upcoming appointments' : 'No appointments found'}
              description={
                filter === 'upcoming'
                  ? "You don't have any upcoming counseling sessions scheduled."
                  : "You don't have any appointments in this category."
              }
              icon="calendar"
              action={
                <button
                  onClick={() => navigate('/student/booking')}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Book Your First Session
                </button>
              }
            />
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelClick}
                onReschedule={handleRescheduleClick}
                showActions={true}
              />
            ))}
          </div>
        )}

        {/* Help text */}
        {filteredBookings.length > 0 && (
          <div className="text-center pt-6 border-t border-border-light animate-fade-in">
            <p className="text-sm text-fg-muted mb-4">
              Need to make changes? You can reschedule or cancel up to 24 hours before your appointment.
            </p>
            <button
              onClick={() => navigate('/student/booking')}
              className="text-primary hover:underline font-medium inline-flex items-center gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              Book Another Session
            </button>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleCancelConfirm}
        loading={cancellingLoading}
        counselorName={selectedBooking?.counselor.name}
        appointmentDate={selectedBooking ? formatAppointmentDate(selectedBooking) : undefined}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={rescheduleModalOpen}
        onClose={() => {
          setRescheduleModalOpen(false);
          setSelectedBooking(null);
        }}
        onProceed={handleRescheduleProceed}
        counselorName={selectedBooking?.counselor.name}
        currentDate={selectedBooking ? formatAppointmentDate(selectedBooking) : undefined}
      />
    </div>
  );
}
