
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseWebSocketProps {
  roomId: string;
  onMessage?: (message: any) => void;
}

export const useWebSocket = ({ roomId, onMessage }: UseWebSocketProps) => {
  const { user, session } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const sendMessage = (message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  useEffect(() => {
    if (!user || !session?.access_token || !roomId) return;

    const wsUrl = `wss://qyjslbqhyasegkkavlzy.supabase.co/functions/v1/chat-websocket?room=${roomId}&token=${session.access_token}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('WebSocket connected to room:', roomId);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected from room:', roomId);
      };

      ws.onerror = (error) => {
        setError('WebSocket connection error');
        console.error('WebSocket error:', error);
      };

    } catch (err) {
      setError('Failed to create WebSocket connection');
      console.error('WebSocket creation error:', err);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [user, session, roomId, onMessage]);

  return { isConnected, error, sendMessage };
};
