import { ApiResponse, CustomAnswerInput } from './types';

class ApiClient {
  private baseUrl = '/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth
  async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Startups
  async getStartups(): Promise<ApiResponse<any[]>> {
    return this.request('/startups');
  }

  async getMyStartups(): Promise<ApiResponse<any[]>> {
    return this.request('/startups/my');
  }

  async createStartup(data: any): Promise<ApiResponse<any>> {
    return this.request('/startups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStartup(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/startups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStartup(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request(`/startups/${id}`, {
      method: 'DELETE',
    });
  }

  async voteStartup(startupId: string, type: 'UPVOTE' | 'DOWNVOTE'): Promise<ApiResponse<any>> {
    return this.request('/startups/vote', {
      method: 'POST',
      body: JSON.stringify({ startupId, type }),
    });
  }

  async addStartupFeedback(startupId: string, comment: string): Promise<ApiResponse<any>> {
    return this.request('/startups/feedback', {
      method: 'POST',
      body: JSON.stringify({ startupId, comment }),
    });
  }

  async getStartupFeedback(startupId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/startups/${startupId}/feedback`);
  }

  // Jobs
  async getJobs(): Promise<ApiResponse<any[]>> {
    return this.request('/jobs');
  }

  async getJobsByStartup(startupId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/jobs/startup/${startupId}`);
  }

  async createJob(data: any): Promise<ApiResponse<any>> {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJob(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async applyToJob(jobId: string, customAnswers: CustomAnswerInput[]): Promise<ApiResponse<any>> {
    return this.request('/jobs/apply', {
      method: 'POST',
      body: JSON.stringify({ jobId, customAnswers }),
    });
  }

  async getJobApplications(jobId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/jobs/${jobId}/applications`);
  }

  async updateApplicationStatus(applicationId: string, status: string): Promise<ApiResponse<any>> {
    return this.request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Saved Jobs
  async saveJob(jobId: string): Promise<ApiResponse<any>> {
    return this.request('/jobs/save', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  }

  async unsaveJob(jobId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request(`/jobs/save/${jobId}`, {
      method: 'DELETE',
    });
  }

  async getSavedJobs(): Promise<ApiResponse<any[]>> {
    return this.request('/jobs/saved');
  }

  // Applications
  async getMyApplications(): Promise<ApiResponse<any[]>> {
    return this.request('/applications/my');
  }

  // Resume
  async getMyResume(): Promise<ApiResponse<any>> {
    return this.request('/resume');
  }

  async createResume(data: any): Promise<ApiResponse<any>> {
    return this.request('/resume', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateResume(data: any): Promise<ApiResponse<any>> {
    return this.request('/resume', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Investors
  async getInvestors(): Promise<ApiResponse<any[]>> {
    return this.request('/investors');
  }

  // Resources
  async getResources(): Promise<ApiResponse<any[]>> {
    return this.request('/resources');
  }
}

export const apiClient = new ApiClient();