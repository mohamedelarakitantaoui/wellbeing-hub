import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../../lib/api';

interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

export function SupporterCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.getMyBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startAt);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Start from Sunday
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
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

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handlePrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      await api.updateBooking(bookingId, { status });
      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const todayBookings = getBookingsForDate(new Date());
  const selectedDateBookings = getBookingsForDate(selectedDate);
  const weekDays = getWeekDays(selectedDate);
  const monthDays = getDaysInMonth(currentMonth);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Calendar</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006341] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Calendar</h1>
          <p className="text-gray-600 mt-1">Manage your counseling sessions and appointments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'day'
                ? 'bg-[#006341] text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'week'
                ? 'bg-[#006341] text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'month'
                ? 'bg-[#006341] text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {viewMode === 'month'
                  ? currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={viewMode === 'month' ? handlePrevMonth : handlePrevWeek}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    setSelectedDate(new Date());
                    setCurrentMonth(new Date());
                  }}
                  className="px-3 py-1 text-sm font-medium text-[#006341] hover:bg-[#006341]/10 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={viewMode === 'month' ? handleNextMonth : handleNextWeek}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {viewMode === 'month' && (
              <>
                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {monthDays.map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }
                    const dayBookings = getBookingsForDate(day);
                    const isCurrentDay = isToday(day);
                    const isSelected = isSelectedDate(day);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square p-2 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-[#006341] text-white border-[#006341]'
                            : isCurrentDay
                            ? 'bg-[#006341]/10 border-[#006341] text-[#006341] font-bold'
                            : 'bg-white border-gray-200 hover:border-[#006341] text-gray-700'
                        }`}
                      >
                        <div className="text-sm font-medium">{day.getDate()}</div>
                        {dayBookings.length > 0 && (
                          <div className={`mt-1 flex justify-center gap-0.5`}>
                            {dayBookings.slice(0, 3).map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-1 rounded-full ${
                                  isSelected ? 'bg-white' : 'bg-[#006341]'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {viewMode === 'week' && (
              <div className="space-y-2">
                {weekDays.map(day => {
                  const dayBookings = getBookingsForDate(day);
                  const isCurrentDay = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-4 rounded-lg border ${
                        isCurrentDay ? 'border-[#006341] bg-[#006341]/5' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className={`font-semibold ${isCurrentDay ? 'text-[#006341]' : 'text-gray-900'}`}>
                            {day.toLocaleDateString('en-US', { weekday: 'long' })}
                          </p>
                          <p className="text-sm text-gray-600">{formatDate(day)}</p>
                        </div>
                        <span className="text-sm text-gray-500">{dayBookings.length} sessions</span>
                      </div>
                      {dayBookings.length > 0 ? (
                        <div className="space-y-2">
                          {dayBookings.map(booking => (
                            <div
                              key={booking.id}
                              className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
                                  </p>
                                  <p className="text-xs text-gray-600">{booking.student.name}</p>
                                </div>
                              </div>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">No sessions scheduled</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === 'day' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                {selectedDateBookings.length > 0 ? (
                  selectedDateBookings.map(booking => (
                    <div key={booking.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#006341]/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-[#006341]" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{booking.student.name}</p>
                            <p className="text-sm text-gray-600">{booking.student.email}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatTime(booking.startAt)} - {formatTime(booking.endAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      {booking.notes && (
                        <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Notes:</p>
                          <p className="text-sm text-gray-600">{booking.notes}</p>
                        </div>
                      )}
                      {booking.status === 'PENDING' && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                            className="flex-1 px-3 py-2 bg-[#006341] text-white text-sm font-medium rounded-lg hover:bg-[#00875c] transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                            className="flex-1 px-3 py-2 bg-white border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No sessions scheduled for this day</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Today's Schedule Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Today's Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#006341]/5 rounded-lg">
                <span className="text-sm text-gray-700">Total Sessions</span>
                <span className="text-lg font-bold text-[#006341]">{todayBookings.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Confirmed</span>
                <span className="text-lg font-bold text-green-700">
                  {todayBookings.filter(b => b.status === 'CONFIRMED').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-gray-700">Pending</span>
                <span className="text-lg font-bold text-yellow-700">
                  {todayBookings.filter(b => b.status === 'PENDING').length}
                </span>
              </div>
            </div>
          </div>

          {/* Today's Sessions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Today's Sessions</h3>
            {todayBookings.length > 0 ? (
              <div className="space-y-3">
                {todayBookings
                  .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
                  .map(booking => (
                    <div key={booking.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatTime(booking.startAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{booking.student.name}</p>
                      <span
                        className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No sessions today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
