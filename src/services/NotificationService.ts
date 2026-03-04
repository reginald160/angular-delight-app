import { FileUploadDto } from "@/hooks/useJobs";
import { NotificationModel } from "@/hooks/useNotifications";

 const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || '';
// const API_BASE_URL = 'https://localhost:44368/api';

export interface NotificationError {
  message: string;
  status: number;
}

export interface CreateNotificationRequest {
  user_id: string; // GUIDs are handled as strings in JSON
  title: string;
  message: string;
  type: string;

}

class NotificationService {
  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: NotificationError | null }> {
    try {
        
      const token =
      sessionStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        // credentials: 'include', // Include cookies for session management
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          data: null,
          error: {
            message: data?.message || data?.error || 'An error occurred',
            status: response.status,
          },
        };
      }

      return { data, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          message: err instanceof Error ? err.message : 'Network error',
          status: 0,
        },
      };
    }
  }
  

     async SendNotificationToAllAsync(notification: CreateNotificationRequest): Promise<{ error: NotificationError | null }> {
      return this.request<Notification>('/Notifications/SendNotificationToAll', {
        method: 'POST',
        body: JSON.stringify({
          user_id : notification.user_id,
          title: notification.title,
          message: notification.message,
          type : notification.type
        }),
      });
    }

   async SendNotificationAsync(notification: CreateNotificationRequest): Promise<{ error: NotificationError | null }> {
      return this.request<Notification>('/Notifications/SendNotification', {
        method: 'POST',
        body: JSON.stringify({
          user_id : notification.user_id,
          title: notification.title,
          message: notification.message,
          type : notification.type
        }),
      });
    }

    
      async GetUserNotificationsAsync(user_id: string): Promise<{ data: NotificationModel [] | [], error: NotificationError | null }> {
      return this.request<NotificationModel[]>('/Notifications/user/' + user_id, {
        method: 'GET'
      });
    }

      async ReadNotificationsAsync(notification_id: string): Promise<{ data: string, error: NotificationError | null }> {
      return this.request<string>("/Notifications/" + notification_id + "/read", {
        method: 'PATCH'
      });
    }
  
          async ReadAllNotificationsAsync(user_id: string): Promise<{ data: string, error: NotificationError | null }> {
      return this.request<string>("/Notifications/user/" + user_id + "/read-all", {
        method: 'PATCH'
      });
    }

};
export const notificationService = new NotificationService();
