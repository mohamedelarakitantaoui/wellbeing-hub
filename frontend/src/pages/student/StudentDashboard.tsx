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
  Sparkles
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { DashboardSkeleton } from '../../components/shared/LoadingSkeleton';
import { EmptyState } from '../../components/shared/EmptyState';
import { ErrorDisplay } from '../../components/shared/ErrorDisplay';

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
  supporter?: {
    displayName: string;
  };
}

interface MoodData {
  average: number;
  trend: 'up' | 'down' | 'stable';
  streak: number;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [savingMood, setSavingMood] = useState(false);
  const [moodSaved, setMoodSaved] = useState(false);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [activeSupportRooms, setActiveSupportRooms] = useState<SupportRoom[]>([]);
  const [moodData, setMoodData] = useState<MoodData | null>(null);
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
      
      const [bookingsRes, roomsRes, moodRes] = await Promise.allSettled([
        api.getMyBookings(),
        api.getMySupportRooms(),
        api.getMoodHistory(7)
      ]);

      // Handle bookings
      if (bookingsRes.status === 'fulfilled') {
        const now = new Date();
        const upcoming = bookingsRes.value.bookings.filter((b: Booking) => 
          new Date(b.startAt) > now && b.status !== 'CANCELLED'
        );
        setUpcomingBookings(upcoming.slice(0, 3));
      }

      // Handle support rooms
      if (roomsRes.status === 'fulfilled') {
        const active = roomsRes.value.rooms.filter((r: SupportRoom) => 
          r.status === 'ACTIVE' || r.status === 'WAITING'
        );
        setActiveSupportRooms(active);
      }

      // Handle mood data
      if (moodRes.status === 'fulfilled') {
        const moods = moodRes.value.moods || [];
        if (moods.length > 0) {
          const average = moods.reduce((acc: number, m: any) => acc + m.moodScore, 0) / moods.length;
          const trend = moods.length >= 2 
            ? moods[moods.length - 1].moodScore > moods[0].moodScore ? 'up' 
            : moods[moods.length - 1].moodScore < moods[0].moodScore ? 'down' 
            : 'stable'
            : 'stable';
          
          setMoodData({
            average: Math.round(average * 10) / 10,
            trend,
            streak: moods.length
          });
        }
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
      setTimeout(() => {
        setMoodSaved(false);
        setSelectedMood(null);
      }, 2000);
      
      // Refresh mood data
      fetchDashboardData();
    } catch (err: any) {
      console.error('Error saving mood:', err);
      setError('Failed to save mood. Please try again.');
    } finally {
      setSavingMood(false);
    }
  };

  const moods = [
    { value: 1, icon: Frown, label: 'Struggling', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-300', activeBg: 'bg-red-100' },
    { value: 2, icon: Meh, label: 'Not Great', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-300', activeBg: 'bg-orange-100' },
    { value: 3, icon: Meh, label: 'Okay', color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-300', activeBg: 'bg-yellow-100' },
    { value: 4, icon: Smile, label: 'Good', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-300', activeBg: 'bg-green-100' },
    { value: 5, icon: Heart, label: 'Great!', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-300', activeBg: 'bg-blue-100' },
  ];

  const firstName = user?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || 'there';

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <ErrorDisplay
            message={error}
            onRetry={fetchDashboardData}
            variant="banner"
          />
        )}

        {/* Welcome Header - Inspired by Calm/Headspace */}
        <div className="relative overflow-hidden bg-linear-to-r from-primary to-primary-light rounded-3xl p-8 text-white shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">Welcome back</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Hi {firstName}! 👋</h1>
            <p className="text-xl font-semibold text-white mb-4" style={{ color: '#ffffff' }}>How are you feeling today?</p>
            
            {moodData && (
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/20">
                <div>
                  <div className="text-sm opacity-75 mb-1">Your 7-day average</div>
                  <div className="text-3xl font-bold">{moodData.average}/5</div>
                </div>
                <div>
                  <div className="text-sm opacity-75 mb-1">{moodData.streak} day streak</div>
                  <div className="text-2xl">🔥</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mood Check-in Card - Calm-style */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-pink-100 to-red-100 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Daily Check-in</h2>
                <p className="text-sm text-gray-600">Track your mood to understand patterns</p>
              </div>
            </div>
            {moodSaved && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 px-4 py-2 rounded-full animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.value;
              return (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  disabled={savingMood}
                  className={`group flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? `${mood.activeBg} ${mood.border} shadow-lg scale-105`
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-102'
                  }`}
                >
                  <Icon className={`w-10 h-10 transition-colors ${isSelected ? mood.color : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className={`text-sm font-medium transition-colors ${isSelected ? mood.color : 'text-gray-600'}`}>
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedMood && !moodSaved && (
            <button 
              onClick={handleSaveMood}
              disabled={savingMood}
              className="mt-6 w-full py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {savingMood ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Save Today's Mood
                </>
              )}
            </button>
          )}
        </div>

        {/* Quick Actions Grid - Modern Health style */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/student/chat"
              className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Chat Support</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Connect with a peer supporter or counselor for confidential support</p>
            </Link>

            <Link
              to="/student/booking"
              className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7 text-purple-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Appointment</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Schedule a one-on-one session with a professional counselor</p>
            </Link>

            <Link
              to="/student/progress"
              className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-linear-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-green-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Progress</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Track your mood patterns and wellbeing journey</p>
            </Link>
          </div>
        </div>

        {/* Active Support & Upcoming Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Support Sessions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Active Support</h3>
              </div>
              {activeSupportRooms.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {activeSupportRooms.length}
                </span>
              )}
            </div>
            
            {activeSupportRooms.length > 0 ? (
              <div className="space-y-3">
                {activeSupportRooms.map((room) => (
                  <Link
                    key={room.id}
                    to={`/support/${room.id}`}
                    className="group block p-4 bg-linear-to-r from-blue-50 to-blue-50/50 rounded-2xl hover:from-blue-100 hover:to-blue-100/50 transition-all border border-blue-100 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 capitalize">{room.topic}</p>
                          {room.status === 'ACTIVE' && (
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {room.status === 'ACTIVE' 
                            ? room.supporter 
                              ? `With ${room.supporter.displayName}` 
                              : 'In progress'
                            : 'Waiting for supporter'}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={MessageCircle}
                title="No active support sessions"
                description="Start a chat when you need someone to talk to"
                action={{
                  label: 'Start Chat →',
                  onClick: () => window.location.href = '/triage'
                }}
                variant="minimal"
              />
            )}
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
              </div>
              {upcomingBookings.length > 0 && (
                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {upcomingBookings.length}
                </span>
              )}
            </div>
            
            {upcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 bg-linear-to-r from-purple-50 to-purple-50/50 rounded-2xl border border-purple-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          {booking.counselor.displayName}
                        </p>
                        <p className="text-sm text-gray-600">
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
                  className="block text-center mt-3 text-purple-600 text-sm font-semibold hover:text-purple-700 hover:underline"
                >
                  View all bookings →
                </Link>
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No upcoming sessions"
                description="Book an appointment with a counselor"
                action={{
                  label: 'Book Now →',
                  onClick: () => window.location.href = '/student/booking'
                }}
                variant="minimal"
              />
            )}
          </div>
        </div>

        {/* Privacy Notice - BetterHelp style */}
        <div className="bg-linear-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-xl">🔒</span>
            </div>
            <div>
              <p className="text-sm text-blue-900">
                <strong>Your privacy matters.</strong> All conversations are completely confidential. 
                Only you and your assigned supporter can see your messages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
