import { useState, useEffect } from 'react';
import { useSupportQueue } from '../../hooks/useWebSocket';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

interface QueueItem {
  id: string;
  roomId: string;
  student: {
    displayName: string;
    ageBracket: string;
  };
  topic: string;
  urgency: string;
  routedTo: string;
  createdAt: string;
}

export function SupporterQueue() {
  const { user } = useAuth();
  const { queue: realtimeQueue, queueCount, claimRoom, isConnected } = useSupportQueue();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingRoom, setClaimingRoom] = useState<string | null>(null);

  useEffect(() => {
    loadQueue();
  }, []);

  useEffect(() => {
    // Update queue when real-time updates arrive
    if (realtimeQueue && Array.isArray(realtimeQueue) && realtimeQueue.length > 0) {
      setQueue(realtimeQueue);
    }
  }, [realtimeQueue]);

  const loadQueue = async () => {
    try {
      setIsLoading(true);
      const data = await api.getSupportQueue();
      setQueue(data.queue || []);
    } catch (error) {
      console.error('Failed to load queue:', error);
      setQueue([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimRoom = async (roomId: string) => {
    if (!user) return;
    
    try {
      setClaimingRoom(roomId);
      await api.claimSupportRoom(roomId);
      
      // Notify via WebSocket
      claimRoom(roomId, user.id);
      
      // Remove from queue
      setQueue(prev => prev.filter(item => item.roomId !== roomId));
      
      // Redirect to active chats
      setTimeout(() => {
        window.location.href = '/supporter/active-chats';
      }, 500);
    } catch (error) {
      console.error('Failed to claim room:', error);
    } finally {
      setClaimingRoom(null);
    }
  };

  const getWaitTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''}`;
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENT':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-fg mb-6">Student Queue</h1>
        <div className="bg-white rounded-lg border border p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-fg-muted">Loading queue...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-fg">Student Queue</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-accent-success' : 'bg-accent-error'}`}></div>
            <span className="text-sm text-fg-muted">
              {isConnected ? 'Live Updates' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={loadQueue}
            className="px-4 py-2 text-sm bg-white border border rounded-lg hover:bg-bg-hover transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              {queueCount || queue.length}
            </div>
            <div>
              <p className="font-medium text-blue-900">
                {queueCount || queue.length} student{(queueCount || queue.length) !== 1 ? 's' : ''} waiting
              </p>
              <p className="text-sm text-blue-700">
                Click "Accept" to start a support session
              </p>
            </div>
          </div>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="bg-white rounded-lg border border p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-semibold text-fg mb-2">All Caught Up!</h2>
          <p className="text-fg-muted">No students are currently waiting in the queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((item) => (
            <div
              key={item.id || item.roomId}
              className="bg-white rounded-lg border border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(item.urgency)}`}>
                      {item.urgency}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-subtle text-fg-secondary">
                      {item.routedTo || 'General'}
                    </span>
                    <span className="text-sm text-fg-muted">
                      ⏱️ Waiting: {getWaitTime(item.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-fg mb-2">
                    {item.topic}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-fg-secondary">
                    <span>👤 {item.student.displayName || 'Anonymous Student'}</span>
                    <span>🎓 {item.student.ageBracket || 'Not specified'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleClaimRoom(item.roomId)}
                  disabled={claimingRoom === item.roomId}
                  className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {claimingRoom === item.roomId ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Accepting...
                    </span>
                  ) : (
                    'Accept'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
