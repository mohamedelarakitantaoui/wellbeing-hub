/**
 * Conversations List Component
 * Shows all conversations with preview, timestamps, unread badges
 * Modern design inspired by WhatsApp/Slack
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Clock, CheckCircle, Archive, Search } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

interface Conversation {
  id: string;
  topic: string;
  urgency: string;
  status: string;
  routedTo: string;
  createdAt: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  student?: {
    id: string;
    displayName: string;
    ageBracket?: string;
  };
  supporter?: {
    id: string;
    displayName: string;
    role: string;
  };
  _count?: {
    messages: number;
  };
}

type FilterType = 'all' | 'active' | 'waiting' | 'closed';

export function ConversationsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = conversations;

    // Status filter
    if (filter === 'active') {
      filtered = filtered.filter(c => c.status === 'ACTIVE');
    } else if (filter === 'waiting') {
      filtered = filtered.filter(c => c.status === 'WAITING');
    } else if (filter === 'closed') {
      filtered = filtered.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED');
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => {
        const otherPerson = user?.role === 'student' ? c.supporter : c.student;
        const name = otherPerson?.displayName?.toLowerCase() || '';
        const topic = c.topic.toLowerCase();
        const preview = c.lastMessagePreview?.toLowerCase() || '';
        
        return name.includes(query) || topic.includes(query) || preview.includes(query);
      });
    }

    setFilteredConversations(filtered);
  }, [conversations, filter, searchQuery, user?.role]);

  const loadConversations = async () => {
    try {
      const response = await api.getMySupportRooms();
      setConversations(response.rooms);
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WAITING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3" />
            Waiting
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Active
          </span>
        );
      case 'RESOLVED':
      case 'CLOSED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <Archive className="w-3 h-3" />
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'crisis':
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadConversations}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'active', 'waiting', 'closed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {searchQuery.trim() 
                ? 'No conversations found' 
                : filter === 'all'
                ? 'No conversations yet'
                : `No ${filter} conversations`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => {
              const isStudent = user?.role === 'student';
              const otherPerson = isStudent ? conversation.supporter : conversation.student;
              const isActive = conversation.status === 'ACTIVE' || conversation.status === 'WAITING';

              return (
                <button
                  key={conversation.id}
                  onClick={() => navigate(`/support/${conversation.id}`)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4',
                    getUrgencyColor(conversation.urgency),
                    isActive ? 'bg-white' : 'bg-gray-50 opacity-75'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold">
                        {otherPerson?.displayName?.charAt(0).toUpperCase() || '?'}
                      </div>
                      {/* Online indicator could go here */}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {otherPerson?.displayName || 'Connecting...'}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 shrink-0">
                          {formatTime(conversation.lastMessageAt || conversation.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-600 capitalize">
                          {conversation.topic}
                        </span>
                        {getStatusBadge(conversation.status)}
                      </div>

                      {conversation.lastMessagePreview && (
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessagePreview}
                        </p>
                      )}
                    </div>

                    {/* Unread badge (placeholder - would need unread count from backend) */}
                    {/* {unreadCount > 0 && (
                      <div className="shrink-0">
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                          {unreadCount}
                        </span>
                      </div>
                    )} */}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* New Chat Button (for supporters) */}
      {user?.role !== 'student' && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/supporter/queue')}
            className="w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            View Queue
          </button>
        </div>
      )}
    </div>
  );
}
