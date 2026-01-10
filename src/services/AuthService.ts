const API_BASE_URL = 'https://dummyjson.com';

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

      console.log("Using token:", token);
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
      body: JSON.stringify({ username: "emilys", password : "emilyspass" }),
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

  async getCurrentUser(email:string): Promise<{ data: AuthUser | null; error: AuthError | null }> {
      const url = `/auth/getUser?email=${encodeURIComponent(email)}`;
    const result =  this.request<AuthUser>("/user/me");
    console.log("getCurrentUser result", result);

    return result;
  }

  async getAuthUser(): Promise<AuthUser | null> {
  const userData = localStorage.getItem("authUser");

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData) as AuthUser;
  } catch {
    return null;
  }
};
  


}

export const authApi = new AuthApiService();
