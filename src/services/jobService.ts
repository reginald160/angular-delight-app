import { Job } from "@/hooks/useJobs";
import { authApi } from "./AuthService";



export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  isLocked : boolean
}

export interface JobError {
  message: string;
  status: number;
}

class JobService {

    async getAllJobs(): Promise<{ data: Job[] | null; error: JobError | null }> {    
        const result =  authApi.request<Job[]>("/Jobs");
        console.log("getCurrentUser result", result.then(res => console.log(res.data)));
        return result;
    }
}

export const jobService = new  JobService()