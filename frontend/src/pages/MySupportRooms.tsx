import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface SupportRoom {
  id: string;
  topic: string;
  urgency: string;
  status: string;
  routedTo: string;
  createdAt: string;
  student?: {
    displayName: string;
  };
  supporter?: {
    displayName: string;
  };
}

export function MySupportRooms() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<SupportRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await api.getMySupportRooms();
        setRooms(response.rooms);
      } catch (err: any) {
        console.error('Failed to load support rooms:', err);
        setError(err.message || 'Failed to load support rooms');
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your support chats...</p>
        </div>
      </div>
    );
  }

  const activeRooms = rooms.filter(r => r.status === 'ACTIVE' || r.status === 'WAITING');
  const closedRooms = rooms.filter(r => r.status === 'RESOLVED' || r.status === 'CLOSED');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Support Chats</h1>
          <p className="text-gray-600">
            View and access your private support conversations
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {rooms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Support Chats Yet</h3>
              <p className="text-gray-600 mb-6">
                Start a conversation by completing the wellbeing check-in
              </p>
              <Button onClick={() => navigate('/triage')}>
                Get Support Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Active Rooms */}
            {activeRooms.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Conversations</h2>
                <div className="space-y-4">
                  {activeRooms.map((room) => (
                    <Card key={room.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              <MessageCircle className="w-5 h-5 text-primary" />
                              <span className="capitalize">{room.topic}</span>
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {room.status === 'WAITING' ? (
                                <span className="flex items-center gap-1 text-yellow-600">
                                  <Clock className="w-4 h-4" />
                                  Waiting for {room.routedTo.replace('_', ' ')}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  {user?.role === 'student' 
                                    ? `Chatting with ${room.supporter?.displayName || 'supporter'}`
                                    : `Supporting ${room.student?.displayName || 'student'}`}
                                </span>
                              )}
                            </CardDescription>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            room.urgency === 'high' || room.urgency === 'crisis' 
                              ? 'bg-red-100 text-red-800' 
                              : room.urgency === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {room.urgency.toUpperCase()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Started {new Date(room.createdAt).toLocaleDateString()}
                          </span>
                          <Button onClick={() => navigate(`/support/${room.id}`)}>
                            {room.status === 'WAITING' ? 'View Room' : 'Continue Chat'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Closed Rooms */}
            {closedRooms.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Conversations</h2>
                <div className="space-y-4">
                  {closedRooms.map((room) => (
                    <Card key={room.id} className="opacity-75">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                              <XCircle className="w-5 h-5 text-gray-400" />
                              <span className="capitalize">{room.topic}</span>
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Session ended • {new Date(room.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {room.status}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/support/${room.id}`)}
                        >
                          View Conversation
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8">
          <Alert className="border-purple-200 bg-purple-50">
            <AlertDescription className="text-purple-800 text-sm">
              🔒 All conversations are private and confidential. Only you and your assigned supporter can view the messages.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
