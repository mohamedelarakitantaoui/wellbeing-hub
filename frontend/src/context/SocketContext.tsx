/**
 * Socket.io Context Provider
 * Manages WebSocket connection for real-time chat functionality
 */

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '../lib/api';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinSupportRoom: (roomId: string) => void;
  leaveSupportRoom: (roomId: string) => void;
  sendMessage: (roomId: string, content: string) => void;
  sendTypingIndicator: (roomId: string, isTyping: boolean) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const socketInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in StrictMode
    if (socketInitialized.current) {
      console.log('Socket already initialized, skipping');
      return;
    }

    const token = getToken();
    if (!token) {
      console.log('No auth token, skipping socket connection');
      return;
    }

    console.log('🔌 Initializing socket connection...');
    socketInitialized.current = true;
    
    const newSocket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
      timeout: 20000,
      upgrade: true,
      rememberUpgrade: true,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      
      // Auto-reconnect on certain disconnect reasons
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, manually reconnect
        console.log('🔄 Server disconnected, attempting reconnection...');
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔥 Socket connection error:', error.message);
      reconnectAttempts.current++;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        newSocket.close();
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
    });
    
    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up socket connection');
      socketInitialized.current = false;
      newSocket.close();
    };
  }, []);

  const joinSupportRoom = useCallback((roomId: string) => {
    if (!socket || !isConnected) {
      console.warn('Cannot join room: socket not connected');
      return;
    }
    console.log(`📱 Joining support room: ${roomId}`);
    socket.emit('join:support-room', { roomId });
  }, [socket, isConnected]);

  const leaveSupportRoom = useCallback((roomId: string) => {
    if (!socket) return;
    console.log(`👋 Leaving support room: ${roomId}`);
    socket.emit('leave:support-room', { roomId });
  }, [socket]);

  const sendMessage = useCallback((roomId: string, content: string) => {
    if (!socket || !isConnected) {
      console.warn('Cannot send message: socket not connected');
      return;
    }
    console.log(`💬 Sending message to room ${roomId}`);
    socket.emit('message:send', { roomId, content });
  }, [socket, isConnected]);

  const sendTypingIndicator = useCallback((roomId: string, isTyping: boolean) => {
    if (!socket || !isConnected) return;
    socket.emit(isTyping ? 'typing:start' : 'typing:stop', { roomId });
  }, [socket, isConnected]);

  const value: SocketContextType = {
    socket,
    isConnected,
    joinSupportRoom,
    leaveSupportRoom,
    sendMessage,
    sendTypingIndicator,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
