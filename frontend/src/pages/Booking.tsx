import { useState } from 'react';
import { BookingForm } from '../components/BookingForm';
import { BookingConfirmation } from '../components/BookingConfirmation';
import { useNavigate } from 'react-router-dom';

export function Booking() {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any | null>(null);

  const handleBookingSuccess = async (id: string) => {
    setBookingId(id);
    
    // Fetch the booking details to show confirmation
    try {
      const token = sessionStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const booking = data.bookings?.find((b: any) => b.id === id);
        if (booking) {
          setBookingDetails({
            id: booking.id,
            counselorName: booking.counselor?.name || 'Unknown',
            counselorEmail: booking.counselor?.email,
            startAt: new Date(booking.startAt),
            endAt: new Date(booking.endAt),
            notes: booking.notes,
            status: booking.status,
          });
        }
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
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {!bookingId ? (
          <>
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">Book a Session</h1>
              <p className="text-text-secondary">
                Schedule a one-on-one session with a professional counselor
              </p>
            </div>

            {/* Booking Form */}
            <div className="card p-6">
              <BookingForm onSuccess={handleBookingSuccess} />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
                onClick={() => navigate('/my-bookings')}
                className="text-primary hover:underline"
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
              onViewBookings={() => navigate('/my-bookings')}
            />
            
            {/* Link to book another */}
            <div className="text-center pt-4">
              <button
                onClick={handleBackToForm}
                className="text-primary hover:underline"
              >
                ← Book Another Session
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-text-secondary mt-4">Loading confirmation...</p>
          </div>
        )}
      </div>
    </div>
  );
}
