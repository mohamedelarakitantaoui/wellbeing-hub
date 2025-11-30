import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Loader2, AlertCircle, User, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../lib/api';

interface SupportRoom {
  id: string;
  topic: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  student?: {
    displayName: string;
    email: string;
  };
  unreadCount?: number;
}

export function SupporterActiveChats() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<SupportRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadRooms, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getMySupportRooms();
      const roomsData = response.rooms || [];
      // Filter to show only active rooms (not resolved or archived)
      setRooms(roomsData.filter((room: SupportRoom) => room.status === 'ACTIVE'));
    } catch (err: any) {
      console.error('Failed to load rooms:', err);
      setError('Failed to load active chats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading active chats...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Active Chats</h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium mb-2">Error Loading Chats</p>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={loadRooms}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Active Chats</h1>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h2>
            <p className="text-gray-600 mb-6">
              You don't have any active support conversations at the moment.
            </p>
            <button
              onClick={() => navigate('/supporter/queue')}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Check Student Queue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Chats</h1>
          <p className="text-gray-600 mt-1">
            {rooms.length} active {rooms.length === 1 ? 'conversation' : 'conversations'}
          </p>
        </div>
        <button
          onClick={loadRooms}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => navigate(`/support/${room.id}`)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-teal-200 transition-all text-left group relative"
          >
            {/* Unread Badge */}
            {room.unreadCount && room.unreadCount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {room.unreadCount > 9 ? '9+' : room.unreadCount}
              </div>
            )}

            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-teal-700" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                  {room.student?.displayName || 'Student'}
                </h3>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 capitalize">{room.topic}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Last activity {getTimeAgo(room.updatedAt)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Active
              </span>
              <span className="text-teal-600 font-medium group-hover:translate-x-1 transition-transform">
                Open chat →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <button
          onClick={() => navigate('/supporter/queue')}
          className="p-4 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors text-left"
        >
          <h3 className="font-semibold text-teal-900 mb-1">Student Queue</h3>
          <p className="text-sm text-teal-700">Check if students are waiting for support</p>
        </button>
        
        <button
          onClick={() => navigate('/supporter/case-notes')}
          className="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-left"
        >
          <h3 className="font-semibold text-blue-900 mb-1">Case Notes</h3>
          <p className="text-sm text-blue-700">Review and update case documentation</p>
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-900 text-center">
          🔒 Remember: All student conversations are confidential. Handle with care and professionalism.
        </p>
      </div>
    </div>
  );
}
