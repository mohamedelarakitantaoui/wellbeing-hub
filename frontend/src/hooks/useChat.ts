/**
 * Custom Chat Hook
 * Manages chat state, API calls, Socket.io listeners, and message persistence
 * Follows best practices from modern messaging apps
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { api } from '../lib/api';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  content: string;
  type?: 'text' | 'emoji' | 'system';
  senderId: string;
  senderName: string;
  senderRole?: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  isRead?: boolean;
  readAt?: string | null;
  isDeleted?: boolean;
}

export interface ConversationDetails {
  id: string;
  topic: string;
  urgency: 'low' | 'medium' | 'high' | 'crisis';
  status: 'WAITING' | 'ACTIVE' | 'RESOLVED' | 'CLOSED';
  routedTo: string;
  createdAt: string;
  student: {
    id: string;
    displayName: string;
    ageBracket?: string;
  };
  supporter?: {
    id: string;
    displayName: string;
    role: string;
  };
  lastMessageAt?: string;
  lastMessagePreview?: string;
}

interface UseChatOptions {
  conversationId: string;
  autoLoadHistory?: boolean;
  autoJoinSocket?: boolean;
  markAsReadOnView?: boolean;
}

interface UseChatReturn {
  // State
  conversation: ConversationDetails | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  isOtherTyping: boolean;
  isOtherOnline: boolean;
  hasMoreMessages: boolean;
  
  // Actions
  sendMessage: (content: string, type?: 'text' | 'emoji') => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  markAsRead: (messageIds?: string[]) => Promise<void>;
  refreshConversation: () => Promise<void>;
  
  // Typing indicator
  setTyping: (isTyping: boolean) => void;
}

const MESSAGES_PER_PAGE = 50;

export function useChat({
  conversationId,
  autoLoadHistory = true,
  autoJoinSocket = true,
  markAsReadOnView = true,
}: UseChatOptions): UseChatReturn {
  const { user } = useAuth();
  const { socket, isConnected, joinSupportRoom, leaveSupportRoom, sendTypingIndicator } = useSocket();
  
  // State
  const [conversation, setConversation] = useState<ConversationDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [page, setPage] = useState(0);
  
  // Refs to prevent duplicate operations
  const isLoadingHistory = useRef(false);
  const hasJoinedRoom = useRef(false);
  const messageIdsRef = useRef(new Set<string>());
  const typingTimeoutRef = useRef<number | null>(null);
  const markAsReadTimeoutRef = useRef<number | null>(null);

  /**
   * Load conversation details and initial message history
   */
  const loadConversation = useCallback(async () => {
    if (!conversationId || isLoadingHistory.current) return;
    
    isLoadingHistory.current = true;
    setLoading(true);
    setError(null);
    
    try {
      console.log(`📥 Loading conversation: ${conversationId}`);
      
      // Load in parallel
      const [conversationData, messagesData] = await Promise.all([
        api.getSupportRoomDetails(conversationId),
        api.getSupportRoomMessages(conversationId),
      ]);
      
      setConversation(conversationData.room);
      
      // Transform and deduplicate messages
      const transformedMessages: Message[] = messagesData.messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        type: msg.type || 'text',
        senderId: msg.sender.id,
        senderName: msg.sender.displayName,
        senderRole: msg.sender.role,
        timestamp: msg.createdAt,
        status: msg.status || 'sent',
        isRead: msg.isRead,
        readAt: msg.readAt,
        isDeleted: msg.isDeleted,
      }));
      
      // Update message IDs ref
      transformedMessages.forEach(msg => messageIdsRef.current.add(msg.id));
      
      setMessages(transformedMessages);
      setHasMoreMessages(transformedMessages.length >= MESSAGES_PER_PAGE);
      
      console.log(`✅ Loaded ${transformedMessages.length} messages`);
      
      // Auto mark as read after a short delay
      if (markAsReadOnView && transformedMessages.length > 0) {
        const unreadMessageIds = transformedMessages
          .filter(msg => !msg.isRead && msg.senderId !== user?.id)
          .map(msg => msg.id);
          
        if (unreadMessageIds.length > 0) {
          markAsReadTimeoutRef.current = setTimeout(() => {
            markAsRead(unreadMessageIds);
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error('❌ Failed to load conversation:', err);
      setError(err.message || 'Failed to load conversation');
    } finally {
      setLoading(false);
      isLoadingHistory.current = false;
    }
  }, [conversationId, user?.id, markAsReadOnView]);

  /**
   * Load more messages (pagination)
   */
  const loadMoreMessages = useCallback(async () => {
    if (!conversationId || isLoadingHistory.current || !hasMoreMessages) return;
    
    isLoadingHistory.current = true;
    const nextPage = page + 1;
    
    try {
      console.log(`📥 Loading more messages (page ${nextPage})`);
      
      // In a real app, you'd pass offset/limit to the API
      // For now, we'll just mark as loaded all
      setHasMoreMessages(false);
      setPage(nextPage);
    } catch (err: any) {
      console.error('❌ Failed to load more messages:', err);
    } finally {
      isLoadingHistory.current = false;
    }
  }, [conversationId, page, hasMoreMessages]);

  /**
   * Refresh conversation details
   */
  const refreshConversation = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      const conversationData = await api.getSupportRoomDetails(conversationId);
      setConversation(conversationData.room);
    } catch (err: any) {
      console.error('Failed to refresh conversation:', err);
    }
  }, [conversationId]);

  /**
   * Send a message
   */
  const sendMessage = useCallback(async (content: string, type: 'text' | 'emoji' = 'text') => {
    if (!conversationId || !content.trim() || !user) return;
    
    const trimmedContent = content.trim();
    console.log(`📤 Sending message via API: ${trimmedContent.slice(0, 50)}...`);
    
    // Create optimistic message
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}-${Math.random()}`,
      content: trimmedContent,
      type,
      senderId: user.id,
      senderName: user.displayName || user.name || 'You',
      senderRole: user.role,
      timestamp: new Date().toISOString(),
      status: 'sending',
    };
    
    // Add optimistically
    setMessages(prev => [...prev, optimisticMessage]);
    messageIdsRef.current.add(optimisticMessage.id);
    
    try {
      // Send via API (which persists to DB)
      const response = await api.sendSupportMessage(conversationId, trimmedContent);
      
      console.log(`✅ Message saved:`, response.message.id);
      
      // Replace optimistic message with real one
      setMessages(prev => {
        return prev.map(msg => 
          msg.id === optimisticMessage.id 
            ? {
                id: response.message.id,
                content: response.message.content,
                type: response.message.type || 'text',
                senderId: response.message.senderId,
                senderName: response.message.senderName,
                senderRole: response.message.senderRole,
                timestamp: response.message.timestamp,
                status: 'sent',
                isRead: response.message.isRead,
              }
            : msg
        );
      });
      
      // Update message IDs
      messageIdsRef.current.delete(optimisticMessage.id);
      messageIdsRef.current.add(response.message.id);
      
      // Emit via socket for real-time to other user (optional, backend already does this)
      if (socket && isConnected) {
        socket.emit('message:send', { roomId: conversationId, content: trimmedContent });
      }
    } catch (err: any) {
      console.error('❌ Failed to send message:', err);
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      messageIdsRef.current.delete(optimisticMessage.id);
      
      throw err;
    }
  }, [conversationId, user, socket, isConnected]);

  /**
   * Delete a message (soft delete)
   */
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await api.request(`/support/messages/${messageId}`, { method: 'DELETE' });
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isDeleted: true, content: '[Message deleted]' }
            : msg
        )
      );
      
      console.log(`✅ Message deleted: ${messageId}`);
    } catch (err: any) {
      console.error('Failed to delete message:', err);
      throw err;
    }
  }, []);

  /**
   * Mark messages as read
   */
  const markAsRead = useCallback(async (messageIds?: string[]) => {
    if (!conversationId) return;
    
    try {
      await api.request(`/support/rooms/${conversationId}/messages/read`, {
        method: 'PATCH',
        body: JSON.stringify({ messageIds }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Update local state
      if (messageIds) {
        setMessages(prev =>
          prev.map(msg =>
            messageIds.includes(msg.id) && msg.senderId !== user?.id
              ? { ...msg, isRead: true, status: 'read', readAt: new Date().toISOString() }
              : msg
          )
        );
      }
    } catch (err: any) {
      console.error('Failed to mark as read:', err);
    }
  }, [conversationId, user?.id]);

  /**
   * Set typing indicator
   */
  const setTyping = useCallback((isTyping: boolean) => {
    if (!conversationId) return;
    
    sendTypingIndicator(conversationId, isTyping);
    
    // Auto-stop typing after 3 seconds
    if (isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(conversationId, false);
      }, 3000);
    }
  }, [conversationId, sendTypingIndicator]);

  /**
   * Load conversation on mount
   */
  useEffect(() => {
    if (autoLoadHistory && conversationId) {
      loadConversation();
    }
    
    return () => {
      // Cleanup timeouts
      if (markAsReadTimeoutRef.current) {
        clearTimeout(markAsReadTimeoutRef.current);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, autoLoadHistory, loadConversation]);

  /**
   * Join socket room on mount
   */
  useEffect(() => {
    if (!socket || !conversationId || !isConnected || !autoJoinSocket) return;
    
    if (hasJoinedRoom.current) return;
    
    console.log(`🔌 Joining room via socket: ${conversationId}`);
    joinSupportRoom(conversationId);
    hasJoinedRoom.current = true;
    
    return () => {
      if (hasJoinedRoom.current) {
        console.log(`🔌 Leaving room via socket: ${conversationId}`);
        leaveSupportRoom(conversationId);
        hasJoinedRoom.current = false;
      }
    };
  }, [socket, conversationId, isConnected, autoJoinSocket, joinSupportRoom, leaveSupportRoom]);

  /**
   * Listen for socket events
   */
  useEffect(() => {
    if (!socket) return;

    // New message received
    const handleMessageReceived = (data: any) => {
      console.log('📩 Message received via socket:', data);
      
      // Ignore our own messages (already added via API)
      if (data.senderId === user?.id) {
        console.log('Ignoring own message from socket');
        return;
      }
      
      // Check if message already exists
      if (messageIdsRef.current.has(data.id)) {
        console.log('Message already exists, skipping duplicate');
        return;
      }
      
      // Add new message
      const newMessage: Message = {
        id: data.id,
        content: data.content,
        type: data.type || 'text',
        senderId: data.senderId,
        senderName: data.senderName,
        senderRole: data.senderRole,
        timestamp: data.timestamp,
        status: data.status || 'sent',
      };
      
      setMessages(prev => [...prev, newMessage]);
      messageIdsRef.current.add(data.id);
      
      // Auto mark as read after a short delay
      if (markAsReadOnView) {
        setTimeout(() => {
          markAsRead([data.id]);
        }, 1000);
      }
    };

    // User joined room
    const handleUserJoined = (data: any) => {
      console.log('✅ User joined:', data);
      if (data.userId !== user?.id) {
        setIsOtherOnline(true);
      }
    };

    // User left room
    const handleUserLeft = (data: any) => {
      console.log('👋 User left:', data);
      if (data.userId !== user?.id) {
        setIsOtherOnline(false);
      }
    };

    // Typing indicator
    const handleTypingUpdate = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setIsOtherTyping(data.isTyping);
      }
    };

    // Presence update
    const handlePresenceUpdate = (data: { userId: string; status: string }) => {
      if (data.userId !== user?.id) {
        setIsOtherOnline(data.status === 'online');
      }
    };

    // Messages read
    const handleMessagesRead = (data: { messageIds: string[]; readBy: string; readAt: string }) => {
      setMessages(prev =>
        prev.map(msg =>
          data.messageIds.includes(msg.id) && msg.senderId === user?.id
            ? { ...msg, isRead: true, status: 'read', readAt: data.readAt }
            : msg
        )
      );
    };

    // Register listeners
    socket.on('message:received', handleMessageReceived);
    socket.on('user:joined', handleUserJoined);
    socket.on('user:left', handleUserLeft);
    socket.on('typing:update', handleTypingUpdate);
    socket.on('presence:update', handlePresenceUpdate);
    socket.on('messages:read', handleMessagesRead);

    // Cleanup
    return () => {
      socket.off('message:received', handleMessageReceived);
      socket.off('user:joined', handleUserJoined);
      socket.off('user:left', handleUserLeft);
      socket.off('typing:update', handleTypingUpdate);
      socket.off('presence:update', handlePresenceUpdate);
      socket.off('messages:read', handleMessagesRead);
    };
  }, [socket, user?.id, markAsReadOnView, markAsRead]);

  return {
    conversation,
    messages,
    loading,
    error,
    isOtherTyping,
    isOtherOnline,
    hasMoreMessages,
    sendMessage,
    loadMoreMessages,
    deleteMessage,
    markAsRead,
    refreshConversation,
    setTyping,
  };
}
