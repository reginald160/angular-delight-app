import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { notificationService } from '@/services/NotificationService';

const SIGNALR_HUB_URL = import.meta.env.VITE_SIGNALR_HUB_URL || '';

const SignalRContext = createContext<any>(null);

export const SignalRProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [connected, setConnected] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const startConnection = useCallback(async () => {
    if (!user || !SIGNALR_HUB_URL || connectionRef.current) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: async () => sessionStorage.getItem("accessToken") || ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // Global Notification Listener
    connection.on('ReceiveNotification', async (notification: any) => {
      try {
        const { data: notif } = await notificationService.GetUserNotificationsAsync(user.id);
        const unread = (notif as any[])?.filter(n => !n.is_read).length || 0;
        setNotificationCount(unread);

        toast({
          title: notification.title || 'New Notification',
          description: notification.message,
        });
      } catch (err) {
        console.error("SignalR Notification Error:", err);
      }
    });

    try {
      await connection.start();
      connectionRef.current = connection;
      setConnected(true);
      //console.log('SignalR Global Provider Connected');
    } catch (err) {
      console.error('SignalR Connection Failed:', err);
    }
  }, [user, toast]);

  useEffect(() => {
    startConnection();
    return () => {
      connectionRef.current?.stop();
      connectionRef.current = null;
    };
  }, [startConnection]);

  return (
    <SignalRContext.Provider value={{ 
      connection: connectionRef.current, 
      connected, 
      notificationCount, 
      setNotificationCount,
      isChatOpen,
      setIsChatOpen 
    }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);