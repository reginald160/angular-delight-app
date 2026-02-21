import { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/useChat'; // This contains your SignalR connection

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const { notifications, fetchNotifications, setNotifications,  setUnreadCount, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { notificationCount, newNotification, connected } = useChat(); // Monitor SignalR connection status
  // const [newNotification, setNewNotification] = useState<Notification[]>([]);
  // Trigger a subtle haptic or visual cue when unreadCount changes
  // useEffect(() => {
  //   if (notificationCount > 0 && !open) {
  //     fetchNotifications()
  //     setUnreadCount(notificationCount);
      
  //     // Logic for sound or tab flashing could go here
  //   }
  // }, [notificationCount, open]);

    useEffect(() => {
    if (notificationCount > 0 && !open) {


      
      setUnreadCount(notificationCount);
      setNotifications(newNotification);
      fetchNotifications();
      
      // Logic for sound or tab flashing could go here
    }
  }, [notificationCount, open]);

  // useEffect(() => {
  //   if (notificationCount > 0 && !open) {
  //     setUnreadCount(notificationCount)
      
  //     // Logic for sound or tab flashing could go here
  //   }
  // }, [notifications]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={cn(
            "h-5 w-5 transition-colors", 
            connected ? "text-foreground" : "text-muted-foreground/50"
          )} />
          
          {/* SignalR Connection Indicator */}
          {!connected && (
            <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
          )}

          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold bg-destructive text-white border-2 border-background animate-in zoom-in"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 shadow-xl" align="end">
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {unreadCount} New
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2 hover:text-primary"
              onClick={() => markAllAsRead()}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 p-4 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/20 mb-2" />
              <p className="text-sm text-muted-foreground">All caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-muted/50 transition-colors relative",
                    !notification.is_read && "bg-primary/5 shadow-[inset_3px_0_0_0_theme(colors.primary.DEFAULT)]"
                  )}
                  onClick={() => {
                    if (!notification.is_read) markAsRead(notification.id);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", getTypeColor(notification.type))} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn(
                          "text-sm truncate",
                          notification.is_read ? "text-muted-foreground font-normal" : "text-foreground font-semibold"
                        )}>
                          {notification.title}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-border" />
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-t bg-muted/10">
          <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground hover:text-primary">
            View all history
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};