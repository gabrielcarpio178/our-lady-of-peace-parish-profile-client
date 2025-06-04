import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { socket_link } from '../api_link';

// Define types for the context
interface SocketContextProps {
  socket: Socket | null;
}

// Define types for the provider's props, including children
interface SocketProviderProps {
  children: ReactNode; // Type for children
}

const SocketContext = createContext<SocketContextProps | null>(null);

// Hook to use socket in other components
export const useSocket = (): Socket | null => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context.socket;
};

// Socket provider component with typed children prop
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const isAuthenticated = Boolean(localStorage.getItem('user')); // Change 'use' to your actual key

    useEffect(() => {
        if (isAuthenticated) {
        const newSocket = io(socket_link(), {
            withCredentials: true,
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect(); // Cleanup on unmount
        };
    }
    }, [isAuthenticated]);

    return (
        <SocketContext.Provider value={{ socket }}>
        {children}
        </SocketContext.Provider>
    );
};
