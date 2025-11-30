import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  User,
  ChevronRight
} from 'lucide-react';
import { api } from '../../lib/api';

interface Student {
  id: string;
  topic: string;
  urgency: 'low' | 'medium' | 'high';
  createdAt: string;
  student?: {
    displayName?: string;
  };
}

interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  notes?: string;
  student: {
    displayName: string;
  };
}

export function SupporterDashboard() {
  const [studentsInQueue, setStudentsInQueue] = useState<Student[]>([]);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    queueCount: 0,
    activeChats: 0,
    todaySessions: 0,
    avgResponseTime: '4.2m'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [queueRes, bookingsRes] = await Promise.allSettled([
          api.getSupportQueue(),
          api.getMyBookings(),
        ]);

        if (queueRes.status === 'fulfilled') {
          const queue = queueRes.value.queue || [];
          setStudentsInQueue(queue.slice(0, 5)); // Show first 5
          setStats(prev => ({ ...prev, queueCount: queue.length }));
        }

        if (bookingsRes.status === 'fulfilled') {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          
          const todaysBookings = bookingsRes.value.bookings.filter((b: Booking) => {
            const bookingDate = new Date(b.startAt);
            return bookingDate >= today && bookingDate < tomorrow;
          });
          
          setTodayBookings(todaysBookings);
          setStats(prev => ({ ...prev, todaySessions: todaysBookings.length }));
        }
      } catch (error) {
        console.error('Error fetching supporter dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptStudent = async (roomId: string) => {
    try {
      await api.claimSupportRoom(roomId);
      // Refresh queue after accepting
      const queueRes = await api.getSupportQueue();
      setStudentsInQueue(queueRes.queue.slice(0, 5));
      setStats(prev => ({ ...prev, queueCount: queueRes.queue.length, activeChats: prev.activeChats + 1 }));
    } catch (error) {
      console.error('Error accepting student:', error);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700'
  };

  const getWaitTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min`;
    const hours = Math.floor(diffMins / 60);
    return `${hours}h ${diffMins % 60}m`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Students in Queue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.queueCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-green-600 font-medium">Live</span>
            <span className="text-gray-500">updates every 30s</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Chats</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeChats}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-500">Click to view all</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sessions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todaySessions}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-500">{todayBookings.filter(b => new Date(b.startAt) > new Date()).length} upcoming</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgResponseTime}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600 font-medium">Performance good</span>
          </div>
        </div>
      </div>

      {/* Student Queue */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Student Queue</h2>
              <p className="text-sm text-gray-500 mt-1">Students waiting for support</p>
            </div>
            <Link
              to="/supporter/queue"
              className="text-sm font-medium text-[#006341] hover:text-[#00875c] flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {studentsInQueue.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {studentsInQueue.map((student) => (
              <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#006341]/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-[#006341]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {student.student?.displayName || 'Anonymous Student'}
                        </p>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColors[student.urgency]}`}>
                          {student.urgency}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 capitalize">{student.topic}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Waiting: {getWaitTime(student.createdAt)}</p>
                      <p className="text-xs text-gray-500">Priority Response</p>
                    </div>
                    <button 
                      onClick={() => handleAcceptStudent(student.id)}
                      className="px-4 py-2 bg-[#006341] text-white text-sm font-medium rounded-lg hover:bg-[#00875c] transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No students in queue</p>
          </div>
        )}
      </div>

      {/* Active Chats & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Chats */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Active Chats</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Emma K.</p>
                  <p className="text-sm text-gray-600">Last message: 2m ago</p>
                </div>
              </div>
              <Link
                to="/supporter/active-chats"
                className="text-sm font-medium text-[#006341] hover:underline"
              >
                Open
              </Link>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
          </div>
          <div className="p-6 space-y-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006341] mx-auto"></div>
              </div>
            ) : todayBookings.length > 0 ? (
              todayBookings.slice(0, 3).map((booking) => {
                const isUpcoming = new Date(booking.startAt) > new Date();
                return (
                  <div 
                    key={booking.id}
                    className={`flex items-start gap-3 p-4 ${
                      isUpcoming 
                        ? 'border-l-4 border-[#006341] bg-[#006341]/5' 
                        : 'bg-gray-50'
                    } rounded`}
                  >
                    <div className="shrink-0">
                      <p className={`text-sm font-bold ${isUpcoming ? 'text-[#006341]' : 'text-gray-700'}`}>
                        {new Date(booking.startAt).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round((new Date(booking.endAt).getTime() - new Date(booking.startAt).getTime()) / 60000)} min
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{booking.student.displayName}</p>
                      <p className="text-sm text-gray-600">{booking.notes || 'Session'}</p>
                    </div>
                    {!isUpcoming && <CheckCircle className="w-5 h-5 text-[#006341]" />}
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-4">No sessions scheduled for today</p>
            )}
          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Important Alerts</h3>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Case Note Due</p>
              <p className="text-sm text-gray-600 mt-1">
                Complete case notes for yesterday's sessions before end of day
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
