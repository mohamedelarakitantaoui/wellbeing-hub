import { CheckCircle, Calendar, Clock, User, FileText, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingDetails {
  id: string;
  counselorName: string;
  counselorEmail?: string;
  startAt: Date;
  endAt: Date;
  notes?: string;
  status: string;
}

interface BookingConfirmationProps {
  booking: BookingDetails;
  onBackToHome?: () => void;
  onViewBookings?: () => void;
}

export function BookingConfirmation({ booking, onBackToHome, onViewBookings }: BookingConfirmationProps) {
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getDuration = () => {
    const start = new Date(booking.startAt);
    const end = new Date(booking.endAt);
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);
    return `${diffMinutes} minutes`;
  };

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate('/student/dashboard');
    }
  };

  const handleViewBookings = () => {
    if (onViewBookings) {
      onViewBookings();
    } else {
      navigate('/my-bookings');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-text mb-2">Booking Confirmed!</h1>
        <p className="text-text-secondary">
          Your counseling session has been successfully scheduled.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="card p-6 space-y-6 mb-6">
        <h2 className="text-xl font-semibold text-text border-b border-gray-200 pb-3">
          Session Details
        </h2>

        {/* Counselor */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-sm text-text-secondary">Counselor</div>
            <div className="font-semibold text-text">{booking.counselorName}</div>
            {booking.counselorEmail && (
              <div className="text-sm text-text-secondary">{booking.counselorEmail}</div>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-sm text-text-secondary">Date</div>
            <div className="font-semibold text-text">{formatDate(booking.startAt)}</div>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-sm text-text-secondary">Time</div>
            <div className="font-semibold text-text">
              {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
            </div>
            <div className="text-sm text-text-secondary">Duration: {getDuration()}</div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">Notes</div>
              <div className="text-text">{booking.notes}</div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="pt-3 border-t border-gray-200">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Status: {booking.status}
          </span>
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• You'll receive a confirmation email shortly</li>
          <li>• Your counselor will review your notes before the session</li>
          <li>• You can view or cancel this booking from "My Bookings"</li>
          <li>• Please arrive 5 minutes early for your session</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleViewBookings}
          className="flex-1 btn-primary"
        >
          View My Bookings
        </button>
        <button
          onClick={handleBackToHome}
          className="flex-1 btn-secondary flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
