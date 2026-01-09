const API_BASE_URL = 'http://localhost:8082/api/v1';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthError {
  message: string;
  status: number;
}

class AuthApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: AuthError | null }> {
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

  async login(email: string, password: string): Promise<{ data: AuthResponse | null; error: AuthError | null }> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<{ data: AuthResponse | null; error: AuthError | null }> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
  }

  async logout(): Promise<{ error: AuthError | null }> {
        const refreshToken = localStorage.getItem("refreshToken");

    const { error } = await this.request<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    return { error };
  }

  async getCurrentUser(): Promise<{ data: AuthUser | null; error: AuthError | null }> {
    return this.request<AuthUser>('/auth/me');
  }
}

export const authApi = new AuthApiService();
