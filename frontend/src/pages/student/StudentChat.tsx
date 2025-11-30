import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

interface SupportRoom {
  id: string;
  topic: string;
  status: string;
  createdAt: string;
  supporter?: {
    displayName: string;
    role: string;
  };
}

export function StudentChat() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<SupportRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getMySupportRooms();
      const roomsData = response.rooms || [];
      setRooms(roomsData.filter((room: SupportRoom) => room.status === 'ACTIVE' || room.status === 'WAITING'));
    } catch (err: any) {
      console.error('Failed to load rooms:', err);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium mb-2">Error Loading Conversations</p>
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat Support</h1>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Conversations</h2>
            <p className="text-gray-600 mb-6">
              You don't have any active support conversations yet.
            </p>
            <button
              onClick={() => navigate('/student/chat/start')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Request Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Conversations</h1>

      <div className="space-y-4">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => navigate(`/support/${room.id}`)}
            className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 text-lg capitalize">{room.topic}</h3>
                </div>
                {room.supporter && (
                  <p className="text-sm text-gray-600">
                    Chatting with {room.supporter.displayName}
                  </p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                room.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {room.status === 'ACTIVE' ? 'Active' : 'Waiting'}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Started {new Date(room.createdAt).toLocaleDateString()}</span>
              <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                Continue chat →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Start New Chat Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/student/chat/start')}
          className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors border border-blue-200"
        >
          + Start New Support Chat
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900 text-center">
          🔒 All conversations are completely confidential. Only you and your assigned supporter can see your messages.
        </p>
      </div>
    </div>
  );
}
