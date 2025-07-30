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
          details: data.details,
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
    const timestamp = Date.now();
    return this.request(`/startups?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
  }

  async getMyStartups(): Promise<ApiResponse<any[]>> {
    const timestamp = Date.now();
    return this.request(`/startups/my?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
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
    const timestamp = Date.now();
    return this.request(`/jobs?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
  }

  async testProduction(): Promise<ApiResponse<any>> {
    return this.request('/test-production');
  }

  async getJobsByStartup(startupId: string): Promise<ApiResponse<any[]>> {
    const timestamp = Date.now();
    return this.request(`/jobs/startup/${startupId}?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
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
    const timestamp = Date.now();
    return this.request(`/jobs/saved?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
  }

  // Applications
  async getMyApplications(): Promise<ApiResponse<any[]>> {
    const timestamp = Date.now();
    return this.request(`/applications/my?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
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

  async uploadResumePdf(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

    try {
      const response = await fetch(`${this.baseUrl}/resume/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
          details: data.details,
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

  async uploadStartupFile(file: File, type: 'logo' | 'promo', startupId: string): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('startupId', startupId);

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

    try {
      const response = await fetch(`${this.baseUrl}/startups/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

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

  async deleteStartupFile(fileName: string, type: 'logo' | 'promo'): Promise<ApiResponse<any>> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

    try {
      const response = await fetch(`${this.baseUrl}/startups/upload?fileName=${encodeURIComponent(fileName)}&type=${type}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

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

  async deleteResumePdf(): Promise<ApiResponse<any>> {
    return this.request('/resume/upload', {
      method: 'DELETE',
    });
  }

  // Investors
  async getInvestors(): Promise<ApiResponse<any[]>> {
    const timestamp = Date.now();
    return this.request(`/investors?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
  }

  // Resources
  async getResources(): Promise<ApiResponse<any[]>> {
    const timestamp = Date.now();
    return this.request(`/resources?t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
  }

  async delistJob(id: string): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${id}/delist`, {
      method: 'PUT',
    });
  }

  async relistJob(id: string): Promise<ApiResponse<any>> {
    return this.request(`/jobs/${id}/delist`, {
      method: 'PATCH',
    });
  }

  // User Account Management
  async deleteAccount(): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('/user/delete', {
      method: 'DELETE',
    });
  }

  // User Profile Management
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('/user/profile');
  }

  async updateUserProfile(data: {
    name: string;
    email: string;
    website?: string;
    linkedin?: string;
    github?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Tools
  async getTools(params?: {
    category?: string;
    search?: string;
    sortBy?: string;
    featured?: boolean;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.featured) searchParams.append('featured', 'true');

    const query = searchParams.toString();
    const endpoint = query ? `/tools?${query}` : '/tools';
    
    return this.request(endpoint);
  }

  async getTool(id: string): Promise<ApiResponse<any>> {
    return this.request(`/tools/${id}`);
  }

  async rateTool(toolId: string, rating: number, review?: string): Promise<ApiResponse<any>> {
    return this.request(`/tools/${toolId}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'rate', rating, review }),
    });
  }

  async favoriteTool(toolId: string): Promise<ApiResponse<any>> {
    return this.request(`/tools/${toolId}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'favorite' }),
    });
  }

  async unfavoriteTool(toolId: string): Promise<ApiResponse<any>> {
    return this.request(`/tools/${toolId}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'unfavorite' }),
    });
  }

  async getToolReviews(toolId: string, page?: number, limit?: number): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    return this.request(`/tools/${toolId}/reviews?${params.toString()}`);
  }

  async getUserToolRating(toolId: string): Promise<ApiResponse<any>> {
    return this.request(`/tools/${toolId}/user-rating`);
  }

  // News
  async getNews(params?: {
    category?: string;
    search?: string;
    sortBy?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params?.featured) searchParams.append('featured', 'true');
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/news?${query}` : '/news';
    
    return this.request(endpoint);
  }

  async getNewsArticle(id: string): Promise<ApiResponse<any>> {
    return this.request(`/news/${id}`);
  }

  async saveNews(newsId: string): Promise<ApiResponse<any>> {
    return this.request('/news/save', {
      method: 'POST',
      body: JSON.stringify({ newsId }),
    });
  }

  async getSavedNews(params?: {
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/news/saved?${query}` : '/news/saved';
    
    return this.request(endpoint);
  }
}

export const apiClient = new ApiClient();