import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (projectId) => {
  const socketRef = useRef();

  useEffect(() => {
    // 1. Initialize the socket connection
    const socketInitializer = async () => {
      // Trigger the API route to start the server if it's down
      await fetch('/api/socket');
      
      socketRef.current = io({
        path: '/api/socket',
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to Mesh Network');
        if (projectId) {
          socketRef.current.emit('join-project', projectId);
        }
      });
    };

    socketInitializer();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [projectId]);

  return socketRef.current;
};