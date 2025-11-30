/**
 * Support Queue Page for Counselors/Peer Supporters
 * View and claim waiting support requests from students
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { api, getToken, WS_URL } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface QueueItem {
  id: string;
  student: {
    displayName: string;
    ageBracket?: string;
  };
  topic: string;
  urgency: string;
  initialMessage?: string;
  waitingTime: number;
  createdAt: string;
}

interface ActiveRoom {
  id: string;
  topic: string;
  urgency: string;
  status: string;
  student: {
    displayName: string;
  };
  _count?: {
    messages: number;
  };
}

export function SupportQueue() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [myRooms, setMyRooms] = useState<ActiveRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Check if user is authorized
  useEffect(() => {
    if (!user || !['counselor', 'intern', 'admin'].includes(user.role)) {
      setError('Access denied. Only counselors and supporters can view this page.');
      setLoading(false);
    }
  }, [user]);

  // Load queue and my rooms
  useEffect(() => {
    const loadData = async () => {
      if (!user || !['counselor', 'intern', 'admin'].includes(user.role)) {
        return;
      }

      try {
        const [queueData, roomsData] = await Promise.all([
          api.getSupportQueue(),
          api.getMySupportRooms(),
        ]);

        setQueue(queueData.queue);
        setMyRooms(roomsData.rooms);
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to load support queue:', err);
        setError(err.message || 'Failed to load support queue');
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Initialize socket connection for real-time updates
  useEffect(() => {
    const token = getToken();
    if (!token || !user || !['counselor', 'intern', 'admin'].includes(user.role)) return;

    const newSocket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to socket');
    });

    newSocket.on('new_support_request', (data: QueueItem) => {
      console.log('📢 New support request:', data);
      setQueue((prev) => [data, ...prev]);
      
      // Show notification
      if (Notification.permission === 'granted') {
        new Notification('New Support Request', {
          body: `${data.student.displayName} needs help with ${data.topic}`,
          icon: '/icon.png',
        });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket');
    });

    setSocket(newSocket);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      newSocket.close();
    };
  }, [user]);

  const handleClaimRoom = async (roomId: string) => {
    try {
      const response = await api.claimSupportRoom(roomId);
      console.log('✅ Room claimed:', response);

      // Remove from queue
      setQueue((prev) => prev.filter((item) => item.id !== roomId));

      // Notify via socket
      if (socket) {
        socket.emit('room_claimed', { roomId, supporterId: user?.id });
      }

      // Navigate to the room
      navigate(`/support/${roomId}`);
    } catch (err: any) {
      console.error('Failed to claim room:', err);
      alert(err.message || 'Failed to claim room');
    }
  };

  const formatWaitingTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'crisis':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-fg-secondary">Loading support queue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-subtle p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-subtle p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-fg">Support Queue</h1>
            <p className="text-fg-secondary mt-1">
              Students waiting for support: <strong>{queue.length}</strong>
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>

        {/* My Active Rooms */}
        {myRooms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>My Active Chats ({myRooms.length})</CardTitle>
              <CardDescription>Students you're currently helping</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{room.student.displayName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(room.urgency)}`}>
                          {room.urgency.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-fg-secondary">Topic: {room.topic}</p>
                      {room._count && (
                        <p className="text-xs text-fg-muted mt-1">
                          {room._count.messages} messages
                        </p>
                      )}
                    </div>
                    <Button onClick={() => navigate(`/support/${room.id}`)}>
                      Open Chat
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Waiting Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Waiting Students</CardTitle>
            <CardDescription>
              Students waiting for support (sorted by urgency and time)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {queue.length === 0 ? (
              <div className="text-center py-12 text-fg-muted">
                <p className="text-lg mb-2">🎉 Queue is empty!</p>
                <p className="text-sm">No students waiting for support right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border-2 rounded-lg ${getUrgencyColor(item.urgency)} hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {item.student.displayName}
                          </h3>
                          {item.student.ageBracket && (
                            <span className="px-2 py-0.5 bg-white/50 rounded text-xs">
                              {item.student.ageBracket}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm mb-2">
                          <span className="font-medium">
                            📌 Topic: <span className="capitalize">{item.topic}</span>
                          </span>
                          <span className="text-fg-secondary">
                            ⏱️ {formatWaitingTime(item.waitingTime)}
                          </span>
                        </div>
                        {item.initialMessage && (
                          <div className="mt-2 p-3 bg-white/70 rounded-md">
                            <p className="text-sm italic">&quot;{item.initialMessage}&quot;</p>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => handleClaimRoom(item.id)}
                        className="ml-4"
                        variant={item.urgency === 'crisis' || item.urgency === 'high' ? 'destructive' : 'default'}
                      >
                        {item.urgency === 'crisis' ? '🚨 Help Now' : 'Claim'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertTitle className="text-blue-900">💡 How It Works</AlertTitle>
          <AlertDescription className="text-blue-800">
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Students are automatically routed based on their issue and urgency</li>
              <li>Click &quot;Claim&quot; to start a 1-on-1 private chat with a student</li>
              <li>Each conversation is completely confidential and private</li>
              <li>High urgency and crisis situations appear at the top</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
