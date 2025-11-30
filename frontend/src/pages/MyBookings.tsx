import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, X, FileText, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface Booking {
  id: string;
  counselorId: string;
  startAt: string;
  endAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  counselor: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

/**
 * 📅 Enhanced My Bookings Page
 * Clean, organized booking management
 */
export function MyBookings() {
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getMyBookings();
      setBookings(data.bookings || []);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

    try {
      setCancellingId(bookingId);
      await api.cancelBooking(bookingId);

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b
        )
      );
    } catch (err: any) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filterBookings = () => {
    const now = new Date();
    return bookings.filter((booking) => {
      const startDate = new Date(booking.startAt);
      if (filter === 'upcoming') {
        return startDate >= now && booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED';
      } else if (filter === 'past') {
        return startDate < now || booking.status === 'COMPLETED';
      }
      return true;
    });
  };

  const filteredBookings = filterBookings();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          <div className="space-y-3">
            <div className="w-64 h-8 bg-bg-subtle rounded-lg animate-pulse" />
            <div className="w-96 h-5 bg-bg-subtle rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-4 border-b border-border-light pb-4">
            {[1, 2, 3].map(i => <div key={i} className="w-24 h-10 bg-bg-subtle rounded-lg animate-pulse" />)}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-20 bg-bg-subtle rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-fg mb-3">My Appointments</h1>
          <p className="text-lg text-fg-secondary">
            View and manage your counseling sessions
          </p>
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Error loading bookings</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="animate-fade-in text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Calendar className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-fg mb-3">
              {filter === 'upcoming' ? 'No upcoming appointments' : 'No appointments found'}
            </h3>
            <p className="text-fg-secondary max-w-md mx-auto mb-6">
              {filter === 'upcoming' 
                ? "You don't have any upcoming counseling sessions scheduled." 
                : "You don't have any appointments in this category."}
            </p>
            <button
              onClick={() => navigate('/student/booking')}
              className="btn-primary"
            >
              Book Your First Session
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {filteredBookings.map((booking) => {
              const isPast = new Date(booking.startAt) < new Date();
              const canCancel =
                !isPast &&
                booking.status !== 'CANCELLED' &&
                booking.status !== 'COMPLETED';

              return (
                <div
                  key={booking.id}
                  className="card p-6 hover:shadow-xl transition-all duration-200 animate-fade-in"
                >
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
                      </div>
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-5">
                    <div className="flex items-center gap-3 p-3 bg-bg-subtle rounded-xl">
                      <Calendar className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-fg-muted font-medium">Date</p>
                        <p className="text-sm font-semibold text-fg">{formatDate(booking.startAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-bg-subtle rounded-xl">
                      <Clock className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs text-fg-muted font-medium">Time</p>
                        <p className="text-sm font-semibold text-fg">
                          {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-5">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-xs font-bold text-primary uppercase tracking-wide mb-1">
                            Your Notes
                          </div>
                          <p className="text-sm text-fg leading-relaxed">{booking.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {canCancel && (
                    <div className="flex justify-end pt-3 border-t border-border-light">
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="btn-secondary text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 flex items-center gap-2 transition-all"
                      >
                        <X className="w-4 h-4" />
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Appointment'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Help text */}
        {filteredBookings.length > 0 && (
          <div className="text-center pt-6 border-t border-border-light">
            <p className="text-sm text-fg-muted">
              Need to reschedule? Cancel your current appointment and book a new one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
