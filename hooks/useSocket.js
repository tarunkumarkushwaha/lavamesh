import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (projectId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    let socketInstance;

    const socketInitializer = async () => {
      // 1. Trigger the API route
      await fetch('/api/socket');
      
      // 2. Initialize socket
      socketInstance = io({
        path: '/api/socket',
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socketInstance.on('connect', () => {
        console.log('Connected to Mesh Network:', socketInstance.id);
        socketInstance.emit('join-project', projectId);
      });

      // 3. Keep track of it in state
      setSocket(socketInstance);
    };

    socketInitializer();

    // 4. CLEANUP: Now socketInstance is accessible here
    return () => {
      if (socketInstance) {
        socketInstance.off('connect');
        socketInstance.disconnect();
      }
    };
  }, [projectId]); // Re-run only if projectId changes

  return socket;
};