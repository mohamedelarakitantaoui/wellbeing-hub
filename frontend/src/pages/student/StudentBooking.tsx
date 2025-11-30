import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BookingForm } from '../../components/BookingForm';
import { BookingConfirmation } from '../../components/BookingConfirmation';
import { api } from '../../lib/api';

export function StudentBooking() {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);

  const handleBookingSuccess = async (id: string) => {
    setBookingId(id);
    
    // Fetch the booking details to show confirmation
    try {
      const data = await api.getMyBookings();
      const booking = data.bookings?.find((b: any) => b.id === id);
      if (booking) {
        setBookingDetails({
          id: booking.id,
          counselorName: booking.counselor?.displayName || 'Unknown',
          counselorEmail: booking.counselor?.email,
          startAt: new Date(booking.startAt),
          endAt: new Date(booking.endAt),
          notes: booking.notes,
          status: booking.status,
        });
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
    }
  };

  const handleBackToForm = () => {
    setBookingId(null);
    setBookingDetails(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {!bookingId ? (
        <>
          {/* Header */}
          <div>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Session</h1>
            <p className="text-gray-600">
              Schedule a one-on-one session with a professional counselor
            </p>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <BookingForm onSuccess={handleBookingSuccess} />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📅 Booking Information</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Sessions are typically 60 minutes long</li>
              <li>• You can cancel or reschedule up to 24 hours before</li>
              <li>• All sessions are confidential and secure</li>
              <li>• You'll receive a confirmation email</li>
            </ul>
          </div>

          {/* Quick Link to My Bookings */}
          <div className="text-center">
            <button
              onClick={() => navigate('/mybookings')}
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              View My Existing Bookings →
            </button>
          </div>
        </>
      ) : bookingDetails ? (
        <>
          {/* Booking Confirmation */}
          <BookingConfirmation
            booking={bookingDetails}
            onBackToHome={() => navigate('/student/dashboard')}
            onViewBookings={() => navigate('/mybookings')}
          />
          
          {/* Link to book another */}
          <div className="text-center pt-4">
            <button
              onClick={handleBackToForm}
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              ← Book Another Session
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading confirmation...</p>
        </div>
      )}
    </div>
  );
}
