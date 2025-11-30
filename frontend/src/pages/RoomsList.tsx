import { useState, useEffect } from 'react';
import { RoomCard } from '../components/RoomCard';
import { api } from '../lib/api';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

interface PeerRoom {
  id: string;
  slug: string;
  title: string;
  topic: string;
  isMinorSafe: boolean;
  _count?: {
    messages: number;
  };
}

export default function RoomsList() {
  const [rooms, setRooms] = useState<PeerRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getRooms();
      setRooms(response.rooms || []);
    } catch (err: any) {
      console.error('Error fetching rooms:', err);
      setError(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-fg-secondary">Loading peer rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Peer Support Rooms
          </h1>
          <p className="text-fg-secondary">
            Connect with peers in a safe and supportive environment
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-fg-muted">No peer rooms available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                slug={room.slug}
                title={room.title}
                topic={room.topic}
                isMinorSafe={room.isMinorSafe}
                messageCount={room._count?.messages || 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
