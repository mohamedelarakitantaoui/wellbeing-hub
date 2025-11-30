/**
 * Student Dashboard - Redesigned following BetterHelp, Calm, Headspace patterns
 * Features: Mood tracking, quick actions, active sessions, upcoming bookings
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  Smile,
  Meh,
  Frown,
  Activity,
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  counselor: {
    displayName: string;
  };
}

interface SupportRoom {
  id: string;
  topic: string;
  status: string;
  createdAt: string;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [savingMood, setSavingMood] = useState(false);
  const [moodSaved, setMoodSaved] = useState(false);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [activeSupportRooms, setActiveSupportRooms] = useState<SupportRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [bookingsRes, roomsRes] = await Promise.allSettled([
        api.getMyBookings(),
        api.getMySupportRooms(),
      ]);

      if (bookingsRes.status === 'fulfilled') {
        const now = new Date();
        const upcoming = bookingsRes.value.bookings.filter((b: Booking) => 
          new Date(b.startAt) > now && b.status !== 'CANCELLED'
        );
        setUpcomingBookings(upcoming.slice(0, 3));
      } else {
        console.error('Failed to load bookings:', bookingsRes.reason);
      }

      if (roomsRes.status === 'fulfilled') {
        const active = roomsRes.value.rooms.filter((r: SupportRoom) => 
          r.status === 'ACTIVE' || r.status === 'WAITING'
        );
        setActiveSupportRooms(active);
      } else {
        console.error('Failed to load support rooms:', roomsRes.reason);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMood = async () => {
    if (!selectedMood) return;
    
    try {
      setSavingMood(true);
      await api.saveMood(selectedMood);
      setMoodSaved(true);
      setTimeout(() => setMoodSaved(false), 3000);
    } catch (err: any) {
      console.error('Error saving mood:', err);
      alert('Failed to save mood. Please try again.');
    } finally {
      setSavingMood(false);
    }
  };

  const moods = [
    { value: 1, icon: Frown, label: 'Struggling', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    { value: 2, icon: Meh, label: 'Not Great', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    { value: 3, icon: Smile, label: 'Okay', color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { value: 4, icon: Smile, label: 'Good', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    { value: 5, icon: Heart, label: 'Great!', color: 'text-primary', bg: 'bg-primary-50', border: 'border-primary' },
  ];

  const firstName = user?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || 'there';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div style={{ background: 'linear-gradient(to right, #004B36, #006F57)' }} className="rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
        <p className="text-lg opacity-95">How are you feeling today?</p>
      </div>

      {/* Mood Tracker Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">Today's Mood Check-in</h2>
          </div>
          {moodSaved && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Saved!
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-5 gap-3 mt-4">
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.value;
            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                disabled={savingMood}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? `${mood.bg} ${mood.border} shadow-md scale-105`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 ${isSelected ? mood.color : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${isSelected ? mood.color : 'text-gray-500'}`}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>

        {selectedMood && (
          <button 
            onClick={handleSaveMood}
            disabled={savingMood}
            className="mt-4 w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {savingMood ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Today\'s Mood'
            )}
          </button>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/student/chat/start"
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat Support</h3>
          <p className="text-sm text-gray-600">Talk to a peer tutor or counselor</p>
        </Link>

        <Link
          to="/student/booking"
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Session</h3>
          <p className="text-sm text-gray-600">Schedule a one-on-one session</p>
        </Link>

        <Link
          to="/student/progress"
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-green-200 transition-all group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Progress</h3>
          <p className="text-sm text-gray-600">Track your wellbeing journey</p>
        </Link>
      </div>

      {/* Active Support & Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Support Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Support</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-3">Loading...</p>
            </div>
          ) : activeSupportRooms.length > 0 ? (
            <div className="space-y-3">
              {activeSupportRooms.map((room) => (
                <Link
                  key={room.id}
                  to={`/support/${room.id}`}
                  className="block p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{room.topic}</p>
                      <p className="text-sm text-gray-600">
                        {room.status === 'ACTIVE' ? 'In Progress' : 'Waiting for counselor'}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No active support sessions</p>
              <Link
                to="/student/chat/start"
                className="inline-block mt-4 text-blue-600 text-sm font-medium hover:underline"
              >
                Start a chat →
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-3">Loading...</p>
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-purple-50 rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {booking.counselor.displayName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(booking.startAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              ))}
              <Link
                to="/mybookings"
                className="block text-center mt-3 text-purple-600 text-sm font-medium hover:underline"
              >
                View all bookings →
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">No upcoming sessions</p>
              <Link
                to="/student/booking"
                className="inline-block mt-4 text-purple-600 text-sm font-medium hover:underline"
              >
                Book a session →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900 text-center">
          🔒 <strong>Privacy Reminder:</strong> All conversations are completely confidential. Only you and your assigned supporter can see your messages.
        </p>
      </div>
    </div>
  );
}
