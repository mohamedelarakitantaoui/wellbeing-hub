import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, User, Home, Eye, Download, Share2 } from 'lucide-react';
import { api } from '../../lib/api';
import type { Booking } from '../../types/booking';
import { BookingCardSkeleton } from '../../components/booking/BookingSkeletons';
import { ErrorState } from '../../components/booking/BookingStates';

/**
 * 🎉 Booking Confirmation Page
 * Professional success screen inspired by BetterHelp & Headspace
 * 
 * Features:
 * ✅ Success animation
 * ✅ Booking details display
 * ✅ Add to calendar
 * ✅ Quick actions
 * ✅ Next steps guidance
 */

export function BookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      navigate('/student/booking');
      return;
    }
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMyBookings();
      const foundBooking = data.bookings?.find((b: any) => b.id === bookingId);
      
      if (foundBooking) {
        setBooking(foundBooking);
      } else {
        setError('Booking not found');
      }
    } catch (err: any) {
      console.error('Error fetching booking:', err);
      setError(err.message || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const minutes = Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
    return `${minutes} minutes`;
  };

  const handleAddToCalendar = () => {
    if (!booking) return;

    const startDate = new Date(booking.startAt);
    const endDate = new Date(booking.endAt);

    // Create ICS format
    const title = `Counseling Session with ${booking.counselor.name}`;
    const description = booking.notes ? `Notes: ${booking.notes}` : 'Counseling Session';
    const location = 'Online Video Call';

    // Format dates for calendar (simplified)
    const startStr = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'counseling-session.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareBooking = async () => {
    if (!booking) return;

    const text = `I have a counseling session scheduled with ${booking.counselor.name} on ${formatDate(booking.startAt)} at ${formatTime(booking.startAt)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Counseling Appointment',
          text: text,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Booking details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg pb-20 md:pb-8">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <BookingCardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-bg pb-20 md:pb-8">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <ErrorState
            message={error || 'Booking not found'}
            onRetry={fetchBookingDetails}
          />
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="btn-secondary"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Success Header */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 relative">
            <CheckCircle className="w-14 h-14 text-green-600" />
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
          </div>
          <h1 className="text-4xl font-bold text-fg mb-3">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-fg-secondary">
            Your counseling session has been successfully scheduled
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="card p-8 mb-6 animate-scale-in">
          <h2 className="text-xl font-bold text-fg border-b border-border-light pb-4 mb-6">
            Session Details
          </h2>

          <div className="space-y-6">
            {/* Counselor */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-fg-muted font-semibold uppercase tracking-wide mb-1">
                  Your Counselor
                </p>
                <p className="text-lg font-bold text-fg">{booking.counselor.name}</p>
                <p className="text-sm text-fg-secondary">{booking.counselor.email}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 bg-bg-subtle rounded-xl">
                <Calendar className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-fg-muted font-semibold uppercase tracking-wide mb-1">
                    Date
                  </p>
                  <p className="font-bold text-fg">{formatDate(booking.startAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-bg-subtle rounded-xl">
                <Clock className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-fg-muted font-semibold uppercase tracking-wide mb-1">
                    Time
                  </p>
                  <p className="font-bold text-fg">
                    {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
                  </p>
                  <p className="text-xs text-fg-muted mt-1">
                    Duration: {getDuration(booking.startAt, booking.endAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Session Type */}
            <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <span className="text-3xl">💻</span>
              <div>
                <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-0.5">
                  Session Type
                </p>
                <p className="font-bold text-fg">Video Call</p>
                <p className="text-sm text-fg-secondary">
                  A meeting link will be sent to your email
                </p>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-900 font-semibold uppercase tracking-wide mb-2">
                  Your Notes
                </p>
                <p className="text-sm text-fg leading-relaxed">{booking.notes}</p>
              </div>
            )}

            {/* Status Badge */}
            <div className="pt-4 border-t border-border-light">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-200">
                ✓ {booking.status}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-3 gap-3 mb-6 animate-slide-up">
          <button
            onClick={handleAddToCalendar}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Add to Calendar
          </button>
          <button
            onClick={() => navigate('/mybookings')}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Bookings
          </button>
          <button
            onClick={handleShareBooking}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* What's Next */}
        <div className="card p-6 mb-6 animate-slide-up">
          <h3 className="font-bold text-lg text-fg mb-4">📋 What&apos;s Next?</h3>
          <div className="space-y-3">
            {[
              'Check your email for a confirmation message',
              'You will receive a meeting link 24 hours before your session',
              'Join the call 5 minutes early to test your connection',
              'You can manage this booking from My Appointments',
              'Need to reschedule? You can do so up to 24 hours in advance',
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {idx + 1}
                </div>
                <p className="text-sm text-fg-secondary leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 animate-slide-up">
          <h3 className="font-bold text-blue-900 mb-3">💡 Preparing for Your Session</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="shrink-0">•</span>
              <span>Find a quiet, private space where you feel comfortable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0">•</span>
              <span>Have a notepad ready if you'd like to take notes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0">•</span>
              <span>Think about what you'd like to focus on during the session</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0">•</span>
              <span>Ensure your device is charged and your internet is stable</span>
            </li>
          </ul>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <button
            onClick={() => navigate('/student/booking')}
            className="flex-1 btn-secondary"
          >
            Book Another Session
          </button>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>

        {/* Support Footer */}
        <div className="mt-8 text-center text-sm text-fg-muted animate-fade-in">
          <p>
            Questions? Contact us at{' '}
            <a href="mailto:counseling@aui.edu" className="text-primary hover:underline font-medium">
              counseling@aui.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
