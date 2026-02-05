// import { FileUploadDto } from "@/hooks/useJobs";
// import { UserProfile } from "./api";


//  const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || '';
// // const API_BASE_URL = 'https://localhost:44368/api';


// export interface AuthUser {
//   id: string;
//   email: string;
// }

// export interface RecentActivity {
//   type: string;
//   message: string;
//   time: string;
//   status: string;
// }
// export interface UsersResponse {
//   last_name: string;
//   first_name: string;
//   phone: string;
//   role: string;
// }

// export interface LoginUser {
//   Id: string;
//   Email: string;
//     FirstName: string;
//       LastName: string;
//       Role: string
//       CV: string;
//       Phone: string;
// }


// export interface AuthResponse {
//   accessToken: string;
//   refreshToken?: string;
//   isLocked : boolean
// }

// export interface AuthError {
//   message: string;
//   status: number;
// }

// class AuthApiService {
//   public async request<T>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<{ data: T | null; error: AuthError | null }> {
//     try {
//       const reactBaseUrl = window.location.origin;
//       const token = localStorage.getItem("accessToken");
//       const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//         ...options,
//         // credentials: 'include', // Include cookies for session management
//         headers: {
//           'Content-Type': 'application/json',
//           'X-Client-Base-Url': reactBaseUrl,
//           'X-Client-Endpoint': "reset-password",
//           ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           ...options.headers,
//         },
//       });

//       const data = await response.json().catch(() => null);

//       if (!response.ok) {
//         return {
//           data: null,
//           error: {
//             message: data?.message || data?.error || 'An error occurred',
//             status: response.status,
//           },
//         };
//       }

//       return { data, error: null };
//     } catch (err) {
//       return {
//         data: null,
//         error: {
//           message: err instanceof Error ? err.message : 'Network error',
//           status: 0,
//         },
//       };
//     }
//   }

//   async login(email: string, password: string): Promise<{ data: AuthResponse | null; error: AuthError | null }> {
//     return this.request<AuthResponse>('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email: email, password : password }),
//     });
//   }

//    deleteCVFile(): Promise<{ data: null; error: AuthError | null }> {
//     return this.request<null>(`/files/DeleteCV`, {
//       method: 'DELETE',
//     });
//   }
//   async ConfirmEmail(email: string, token: string): Promise<{ data: AuthResponse | null; error: AuthError | null }> {
//     const url = `/auth/confirm-email?userId=${email}&token=${encodeURIComponent(token)}`;
//     return this.request<AuthResponse>( url, {
//       method: 'GET',
//     });
//   }
//   async register(
//     email: string,
//     password: string,
//     firstName?: string,
//     lastName?: string
//   ): Promise<{ data: AuthResponse | null; error: AuthError | null }> {
//     return this.request<AuthResponse>('/auth/signup', {
//       method: 'POST',
//       body: JSON.stringify({ email: email, password : password, firstName: firstName, lastName: lastName }),
//     });
//   }

//   async logout(): Promise<{ error: AuthError | null }> {
//     //     const refreshToken = localStorage.getItem("refreshToken");

//     // const { error } = await this.request<void>('/auth/logout', {
//     //   method: 'POST',
//     //   body: JSON.stringify({ refreshToken }),
//     // });
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//       localStorage.removeItem("authUser");
//     return { error: null };
//   }

//   async UpdateProfile(
//     firstName : string,
//     lastName: string,
//     phone : string,
//   ): Promise<{ data: LoginUser | null; error: AuthError | null }> {
//     return this.request<LoginUser>('/auth/UpdateProfile', {
//       method: 'PATCH',
//       body: JSON.stringify({firstName, lastName, phone }),
//     });
//   }

//   async getCurrentUser(email:string): Promise<{ data: LoginUser | null; error: AuthError | null }> {

//     const result =  this.request<LoginUser>("/auth/me");
//     return result;
//   }
//    getCurrentUser1(email:string): Promise<{ data: LoginUser | null; error: AuthError | null }> {

//     const result =  this.request<LoginUser>("/auth/me");
//     return result;
//   }

//    getUsers(): Promise<{ data: UserProfile []| null; error: AuthError | null }> {
//     const result =  this.request<UserProfile []>("/auth/GetUsers");
//     return result;
//   }

//   getUserActivities(): Promise<{ data: RecentActivity []| null; error: AuthError | null }> {
//     const result =  this.request<RecentActivity []>("/auth/Activities");
//     return result;
//   }

//     lockUp(userId : string): Promise<{ data: UserProfile []| null; error: AuthError | null }> {
//     const result =  this.request<UserProfile []>("/auth/" + userId + "/toggle-lock", {
//         method: 'PATCH',
//     });
//     return result;
//   }
//   async getCV(id:string): Promise<{ data: FileUploadDto | null; error: AuthError | null }> {

//     const result =  this.request<FileUploadDto>("/files/GetCV");
//     return result;
//   }

//   getBaseUrl(): string {
//     return API_BASE_URL;
//   }

//     async getCurrentAuthUser(): Promise<LoginUser | null> {
//   const userData = localStorage.getItem("authUser");

//   if (!userData) {
//     return null;
//   }

//   try {
//     return JSON.parse(userData) as LoginUser;
//   } catch {
//     return null;
//   }
// };
//   async getAuthUser(): Promise<AuthUser | null> {
//   const userData = localStorage.getItem("authUser");

//   if (!userData) {
//     return null;
//   }

//   try {
//     return JSON.parse(userData) as AuthUser;
//   } catch {
//     return null;
//   }
// };


  


// }

// export const authApi = new AuthApiService();


import { FileUploadDto } from "@/hooks/useJobs";
import { UserProfile } from "./api";


 const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || '';
// const API_BASE_URL = 'https://localhost:44368/api';


export interface AuthUser {
  id: string;
  email: string;
}

export interface RecentActivity {
  type: string;
  message: string;
  time: string;
  status: string;
}
export interface UsersResponse {
  last_name: string;
  first_name: string;
  phone: string;
  role: string;
}

export interface LoginUser {
  Id: string;
  Email: string;
    FirstName: string;
      LastName: string;
      Role: string
      CV: string;
      Phone: string;
}


export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  isLocked : boolean
}

export interface AuthError {
  message: string;
  status: number;
}

class AuthApiService {
    completeProfile(phone: string, industry: string, jobPreferences: { jobTypes: string[]; yearsOfExperience: string; preferredLocations: string[]; }): { error: any; } | PromiseLike<{ error: any; }> {
        throw new Error('Method not implemented.');
    }
  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: AuthError | null }> {
    try {
      const reactBaseUrl = window.location.origin;
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        // credentials: 'include', // Include cookies for session management
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Base-Url': reactBaseUrl,
          'X-Client-Endpoint': "reset-password",
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
      body: JSON.stringify({ email: email, password : password }),
    });
  }

   deleteCVFile(): Promise<{ data: null; error: AuthError | null }> {
    return this.request<null>(`/files/DeleteCV`, {
      method: 'DELETE',
    });
  }
  async ConfirmEmail(email: string, token: string): Promise<{ data: AuthResponse | null; error: AuthError | null }> {
    const url = `/auth/confirm-email?userId=${email}&token=${encodeURIComponent(token)}`;
    return this.request<AuthResponse>( url, {
      method: 'GET',
    });
  }
  async register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<{ data: AuthResponse | null; error: AuthError | null }> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email: email, password : password, firstName: firstName, lastName: lastName }),
    });
  }

  async logout(): Promise<{ error: AuthError | null }> {
    //     const refreshToken = localStorage.getItem("refreshToken");

    // const { error } = await this.request<void>('/auth/logout', {
    //   method: 'POST',
    //   body: JSON.stringify({ refreshToken }),
    // });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
      localStorage.removeItem("authUser");
    return { error: null };
  }

  async UpdateProfile(
    firstName : string,
    lastName: string,
    phone : string,
  ): Promise<{ data: LoginUser | null; error: AuthError | null }> {
    return this.request<LoginUser>('/auth/UpdateProfile', {
      method: 'PATCH',
      body: JSON.stringify({firstName, lastName, phone }),
    });
  }

  async getCurrentUser(email:string): Promise<{ data: LoginUser | null; error: AuthError | null }> {

    const result =  this.request<LoginUser>("/auth/me");
    console.log("getCurrentUser result", result.then(res => console.log(res.data)));
    return result;
  }
   getCurrentUser1(email:string): Promise<{ data: LoginUser | null; error: AuthError | null }> {

    const result =  this.request<LoginUser>("/auth/me");
    console.log("getCurrentUser result", result.then(res => console.log(res.data)));
    return result;
  }

   getUsers(): Promise<{ data: UserProfile []| null; error: AuthError | null }> {
    const result =  this.request<UserProfile []>("/auth/GetUsers");
    return result;
  }

  getUserActivities(): Promise<{ data: RecentActivity []| null; error: AuthError | null }> {
    const result =  this.request<RecentActivity []>("/auth/Activities");
    return result;
  }

    lockUp(userId : string): Promise<{ data: UserProfile []| null; error: AuthError | null }> {
    const result =  this.request<UserProfile []>("/auth/" + userId + "/toggle-lock", {
        method: 'PATCH',
    });
    return result;
  }
  async getCV(id:string): Promise<{ data: FileUploadDto | null; error: AuthError | null }> {

    const result =  this.request<FileUploadDto>("/files/GetCV");
    console.log("getCV result", result.then(res => console.log(res.data)));
    return result;
  }

  getBaseUrl(): string {
    return API_BASE_URL;
  }

    async getCurrentAuthUser(): Promise<LoginUser | null> {
  const userData = localStorage.getItem("authUser");

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData) as LoginUser;
  } catch {
    return null;
  }
};
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
