import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    autoConnect = true,
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connect = () => {
    const token = sessionStorage.getItem('auth_token');
    
    if (!token) {
      setConnectionError('No authentication token found');
      return;
    }

    if (socketRef.current?.connected) {
      console.log('✅ Socket already connected');
      return;
    }

    console.log('🔌 Connecting to WebSocket...');

    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      reconnection,
      reconnectionAttempts,
      reconnectionDelay,
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      setConnectionError(null);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socketRef.current.on('error', (error: { message: string }) => {
      console.error('❌ WebSocket error:', error.message);
    });
  };

  const disconnect = () => {
    if (socketRef.current) {
      console.log('🔌 Disconnecting WebSocket...');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    connect,
    disconnect,
  };
};

// Hook for support room functionality
export const useSupportRoom = (roomId: string | null) => {
  const { socket, isConnected } = useWebSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load existing messages when room changes
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setIsLoadingMessages(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/support/rooms/${roomId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('auth_token')}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('📚 Loaded existing messages:', data.messages?.length || 0);
          
          // Transform messages to match frontend format
          const transformedMessages = (data.messages || []).map((msg: any) => ({
            id: msg.id,
            content: msg.content,
            sender: {
              id: msg.sender?.id || msg.senderId,
              displayName: msg.sender?.displayName || 'Anonymous',
              role: msg.sender?.role || 'unknown',
            },
            createdAt: msg.createdAt,
            isRead: msg.isRead,
          }));
          
          setMessages(transformedMessages);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [roomId]);

  useEffect(() => {
    if (!socket || !isConnected || !roomId) return;

    console.log(`📱 Joining support room: ${roomId}`);
    socket.emit('join:support-room', { roomId });

    // Listen for room joined confirmation
    socket.on('support_room_joined', (data) => {
      console.log('✅ Joined support room:', data);
    });

    // Listen for new messages
    socket.on('message:received', (message) => {
      console.log('💬 Message received:', message);
      
      // Transform backend message format to frontend format
      const transformedMessage = {
        id: message.id,
        content: message.content,
        sender: {
          id: message.senderId,
          displayName: message.senderName,
          role: message.senderRole,
        },
        createdAt: message.timestamp,
        isRead: message.isRead,
      };
      
      setMessages((prev) => [...prev, transformedMessage]);
    });

    // Listen for typing indicators
    socket.on('typing:update', (data: { userId: string; isTyping: boolean }) => {
      setIsTyping(data.isTyping);
      
      if (data.isTyping) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    // Listen for room claimed
    socket.on('support_room_claimed', (data) => {
      console.log('✅ Support room claimed:', data);
    });

    // Listen for access denied
    socket.on('room_access_denied', (data) => {
      console.error('❌ Access denied:', data);
    });

    // Listen for errors
    socket.on('error', (data) => {
      console.error('❌ Socket error:', data);
    });

    // Listen for message edits
    socket.on('message:edited', (message) => {
      console.log('✏️ Message edited:', message);
      
      const transformedMessage = {
        id: message.id,
        content: message.content,
        sender: {
          id: message.senderId,
          displayName: message.senderName,
          role: message.senderRole,
        },
        createdAt: message.timestamp,
        isRead: message.isRead,
        isEdited: message.isEdited,
        editedAt: message.editedAt,
      };
      
      setMessages((prev) =>
        prev.map((msg) => (msg.id === message.id ? transformedMessage : msg))
      );
    });

    // Listen for message deletions
    socket.on('message:deleted', (data: { messageId: string }) => {
      console.log('🗑️ Message deleted:', data.messageId);
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, content: '[Message deleted]', isDeleted: true }
            : msg
        )
      );
    });

    return () => {
      socket.off('support_room_joined');
      socket.off('message:received');
      socket.off('typing:update');
      socket.off('support_room_claimed');
      socket.off('room_access_denied');
      socket.off('error');
      socket.off('message:edited');
      socket.off('message:deleted');
      
      if (roomId) {
        socket.emit('leave:support-room', { roomId });
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, isConnected, roomId]);

  const sendMessage = (content: string) => {
    if (!socket || !roomId || !content.trim()) return;
    
    console.log('📤 Sending message:', { roomId, content: content.trim() });
    socket.emit('message:send', { roomId, content: content.trim() });
  };

  const sendTypingIndicator = (typing: boolean) => {
    if (!socket || !roomId) return;
    
    socket.emit(typing ? 'typing:start' : 'typing:stop', { roomId });
  };

  const editMessage = (messageId: string, content: string) => {
    if (!socket || !roomId || !content.trim()) return;
    
    console.log('✏️ Editing message:', { messageId, content: content.trim() });
    socket.emit('message:edit', { messageId, content: content.trim() });
  };

  const deleteMessage = (messageId: string) => {
    if (!socket || !roomId) return;
    
    console.log('🗑️ Deleting message:', messageId);
    socket.emit('message:delete', { messageId });
  };

  return {
    messages,
    isTyping,
    sendMessage,
    sendTypingIndicator,
    editMessage,
    deleteMessage,
    isConnected,
    isLoadingMessages,
  };
};

// Hook for support queue (counselors)
export const useSupportQueue = () => {
  const { socket, isConnected } = useWebSocket();
  const [queue, setQueue] = useState<any[]>([]);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('📊 Subscribing to support queue updates');

    // Listen for new support requests
    socket.on('new_support_request', (data) => {
      console.log('🆕 New support request:', data);
      setQueue((prev) => [...prev, data]);
      setQueueCount((prev) => prev + 1);
    });

    // Listen for queue updates
    socket.on('queue:update', (data: { queue: any[] }) => {
      console.log('📊 Queue update:', data.queue.length);
      setQueue(data.queue);
      setQueueCount(data.queue.length);
    });

    socket.on('queue:count', (data: { count: number }) => {
      setQueueCount(data.count);
    });

    // Subscribe to queue
    socket.emit('queue:subscribe');

    return () => {
      socket.off('new_support_request');
      socket.off('queue:update');
      socket.off('queue:count');
      socket.emit('queue:unsubscribe');
    };
  }, [socket, isConnected]);

  const claimRoom = (roomId: string, supporterId: string) => {
    if (!socket) return;
    
    socket.emit('room_claimed', { roomId, supporterId });
    
    // Remove from local queue
    setQueue((prev) => prev.filter((item) => item.roomId !== roomId));
    setQueueCount((prev) => Math.max(0, prev - 1));
  };

  return {
    queue,
    queueCount,
    claimRoom,
    isConnected,
  };
};

// Hook for admin dashboard real-time updates
export const useAdminDashboard = () => {
  const { socket, isConnected } = useWebSocket();
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log('📊 Subscribing to admin metrics');

    socket.on('metrics:update', (data) => {
      console.log('📈 Metrics update:', data);
      setMetrics(data);
    });

    socket.emit('admin:subscribe');

    return () => {
      socket.off('metrics:update');
    };
  }, [socket, isConnected]);

  return {
    metrics,
    isConnected,
  };
};
