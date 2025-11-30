/**
 * Support Waiting Room - Student waiting for supporter
 * Inspired by Calm's waiting experiences with breathing animations
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, User } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { api } from '../../lib/api';
import { BreathingAnimation } from '../../components/shared/BreathingAnimation';
import { ErrorDisplay } from '../../components/shared/ErrorDisplay';

interface QueueStatus {
  position: number;
  estimatedWait: number; // in minutes
  roomId: string;
  topic: string;
  status: string;
}

export function StudentWaitingRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeWaited, setTimeWaited] = useState(0);

  useEffect(() => {
    if (!roomId) {
      setError('Room ID missing');
      return;
    }

    loadQueueStatus();
    
    // Timer to track waiting time
    const timer = setInterval(() => {
      setTimeWaited(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [roomId]);

  // Listen for supporter joining
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleSupporterJoined = (data: { roomId: string; supporterId: string }) => {
      if (data.roomId === roomId) {
        // Supporter has joined! Redirect to chat
        navigate(`/support/${roomId}`);
      }
    };

    socket.on('supporter:joined', handleSupporterJoined);
    
    return () => {
      socket.off('supporter:joined', handleSupporterJoined);
    };
  }, [socket, roomId, navigate]);

  const loadQueueStatus = async () => {
    if (!roomId) return;

      try {
      setLoading(true);
      const data = await api.getSupportRoomDetails(roomId);
      
      if (data.room.status === 'ACTIVE') {
        // Already has a supporter, go to chat
        navigate(`/support/${roomId}`);
        return;
      }

      setQueueStatus({
        position: 1, // Default position
        estimatedWait: 5, // Default 5 minutes
        roomId: data.room.id,
        topic: data.room.topic,
        status: data.room.status
      });
    } catch (err: any) {
      console.error('Failed to load queue status:', err);
      setError(err.message || 'Failed to load waiting room');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <BreathingAnimation size="lg" />
          <p className="text-gray-600 mt-6">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !queueStatus) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorDisplay
            title="Unable to join waiting room"
            message={error || 'Room not found'}
            onRetry={loadQueueStatus}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Waiting Card */}
        <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
          {/* Breathing Animation */}
          <div className="mb-8">
            <BreathingAnimation size="lg" showText />
          </div>

          {/* Status Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            We're connecting you with support
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A trained supporter will join your private conversation shortly
          </p>

          {/* Queue Info */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                #{queueStatus.position}
              </div>
              <div className="text-sm text-gray-600">Position in queue</div>
            </div>
            
            <div className="bg-purple-50 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-6 h-6 text-purple-600" />
                <span className="text-3xl font-bold text-purple-600">
                  ~{queueStatus.estimatedWait}
                </span>
              </div>
              <div className="text-sm text-gray-600">Minutes (estimated)</div>
            </div>
            
            <div className="bg-green-50 rounded-2xl p-4">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatTime(timeWaited)}
              </div>
              <div className="text-sm text-gray-600">Time waited</div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-3 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-medium">Topic:</span>
              <span className="capitalize">{queueStatus.topic}</span>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-gray-600">
              {isConnected ? 'Connected' : 'Reconnecting...'}
            </span>
          </div>
        </div>

        {/* What to Expect */}
        <div className="mt-6 bg-white/80 backdrop-blur rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            What to expect
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>You'll be automatically connected when a supporter is available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>All conversations are completely private and confidential</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>You can leave this page - we'll send you a notification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Take deep breaths and know that support is on the way</span>
            </li>
          </ul>
        </div>

        {/* Cancel Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
