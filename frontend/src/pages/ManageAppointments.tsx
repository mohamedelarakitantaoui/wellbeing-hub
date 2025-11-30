import { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, X, FileText, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Booking {
  id: string;
  studentId: string;
  startAt: string;
  endAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export function ManageAppointments() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch bookings');

      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  ) => {
    try {
      setUpdatingId(bookingId);
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update booking');

      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err: any) {
      console.error('Error updating booking:', err);
      alert('Failed to update booking');
    } finally {
      setUpdatingId(null);
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
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterBookings = () => {
    const now = new Date();
    return bookings.filter((booking) => {
      const startDate = new Date(booking.startAt);
      
      if (filter === 'pending') {
        return booking.status === 'PENDING';
      } else if (filter === 'upcoming') {
        return (
          startDate >= now &&
          (booking.status === 'CONFIRMED' || booking.status === 'PENDING')
        );
      } else if (filter === 'past') {
        return startDate < now || booking.status === 'COMPLETED';
      }
      return true;
    });
  };

  const filteredBookings = filterBookings();

  // Count pending bookings
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-text-secondary mt-4">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Manage Appointments</h1>
          <p className="text-text-secondary">
            Review and manage your scheduled counseling sessions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="text-2xl font-bold text-primary">{pendingCount}</div>
            <div className="text-sm text-text-secondary">Pending</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === 'CONFIRMED').length}
            </div>
            <div className="text-sm text-text-secondary">Confirmed</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-blue-600">
              {bookings.filter((b) => b.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-text-secondary">Completed</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-text">{bookings.length}</div>
            <div className="text-sm text-text-secondary">Total</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {(['pending', 'upcoming', 'past', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`
                px-4 py-2 font-medium capitalize transition-all relative
                ${filter === tab
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-text-secondary hover:text-text'
                }
              `}
            >
              {tab}
              {tab === 'pending' && pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Appointments List */}
        {filteredBookings.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No appointments found</h3>
            <p className="text-text-secondary">
              {filter === 'pending'
                ? 'No pending appointments to review'
                : filter === 'upcoming'
                ? 'No upcoming appointments scheduled'
                : filter === 'past'
                ? 'No past appointments'
                : 'No appointments yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const isPast = new Date(booking.startAt) < new Date();
              const isPending = booking.status === 'PENDING';
              const isUpdating = updatingId === booking.id;

              return (
                <div
                  key={booking.id}
                  className={`card p-6 hover:shadow-lg transition-shadow ${
                    isPending ? 'border-l-4 border-yellow-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-text">
                          {booking.student.name}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {booking.student.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(booking.startAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
                      </span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-text-secondary mb-1">
                            Student Notes
                          </div>
                          <p className="text-sm text-text">{booking.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!isPast && booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                    <div className="flex gap-2 justify-end">
                      {isPending && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                          disabled={isUpdating}
                          className="btn-primary disabled:opacity-50 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {isUpdating ? 'Confirming...' : 'Confirm'}
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                        disabled={isUpdating}
                        className="btn-secondary text-red-600 hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        {isUpdating ? 'Cancelling...' : 'Cancel'}
                      </button>
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                          disabled={isUpdating}
                          className="btn-secondary disabled:opacity-50 flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {isUpdating ? 'Marking...' : 'Mark Complete'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
