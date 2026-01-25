import { FileUploadDto } from "@/hooks/useJobs";

 const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || '';
// const API_BASE_URL = 'https://localhost:44368/api';

export interface NotificationErrorError {
  message: string;
  status: number;
}

export interface CreateNotificationRequest {
  user_id: string; // GUIDs are handled as strings in JSON
  title: string;
  message: string;
  type: string;
  is_read: boolean;
}

class NotificationService {
  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: NotificationError | null }> {
    try {
        
      const token = localStorage.getItem("accessToken");
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

   async SendNotificationAsync(notification: CreateNotificationRequest): Promise<{ error: NotificationErrorError | null }> {
      return this.request<Notification>('/auth/UpdateProfile', {
        method: 'POST',
        body: JSON.stringify(notification),
      });
    }

};
export const authApi = new NotificationService();
