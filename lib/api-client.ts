import { ApiResponse, CustomAnswerInput } from './types';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

class ApiClient {
  // Use relative URLs in production, absolute in development
  private getBaseUrl() {
    if (isDevelopment) {
      return 'http://localhost:3000/api';
    }
    return '/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Check if endpoint is already a full URL
    const isFullUrl = endpoint.startsWith('http');
    const url = isFullUrl ? endpoint : `${this.getBaseUrl()}${endpoint}`;
    
    // Get auth token if exists
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('auth-token');
    }

    // Prepare headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Add custom headers if provided
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (value) {
          headers.set(key, value);
        }
      });
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: isDevelopment ? 'include' : 'same-origin',
      mode: isDevelopment ? 'cors' : 'same-origin',
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-2xx responses
      if (!response.ok) {
        let errorData;
        try {
          // Try to parse error response as JSON
          errorData = await response.json();
        } catch (e) {
          // If not JSON, use status text
          errorData = { error: response.statusText };
        }
        
        console.error('API Error:', {
          url,
          status: response.status,
          error: errorData.error || `Request failed with status ${response.status}`,
          details: errorData.details,
        });
        
        return {
          success: false,
          error: errorData.error || `Request failed with status ${response.status}`,
          details: errorData.details,
        };
      }
      
      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return { success: true, data: undefined as any };
      }
      
      // Parse successful response
      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
      };
      
    } catch (error) {
      console.error('API Request Error:', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
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
      const response = await fetch(`${this.getBaseUrl()}/resume/upload`, {
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
      const response = await fetch(`${this.getBaseUrl()}/startups/upload`, {
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
      const response = await fetch(`${this.getBaseUrl()}/startups/upload?fileName=${encodeURIComponent(fileName)}&type=${type}`, {
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
  async getNews(params: { limit?: number; sortBy?: string } = {}): Promise<ApiResponse<any[]>> {
    const query = new URLSearchParams();
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    
    return this.request(`/news?${query.toString()}`);
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

  // Reels (no startup association)
  async getReels(params?: {
    featured?: boolean;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<any[]>> {
    const searchParams = new URLSearchParams();
    if (params?.featured) searchParams.append('featured', 'true');
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());
    const query = searchParams.toString();
    const endpoint = query ? `/reels?${query}` : '/reels';
    return this.request(endpoint);
  }

  async createReel(data: {
    instagramUrls: string[];
    active?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request('/reels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReel(id: string, data: {
    instagramUrl?: string;
    active?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.request(`/reels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReel(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request(`/reels/${id}`, {
      method: 'DELETE',
    });
  }

  async incrementReelViews(id: string): Promise<ApiResponse<any>> {
    return this.request(`/reels/${id}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'view' }),
    });
  }

  // Personalized Reel Feed
  async getUserReelFeed(
    sync = false,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (sync) params.append('sync', 'true');
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    const queryString = params.toString();
    return this.request(`/reels/feed${queryString ? `?${queryString}` : ''}`);
  }

  async updateReelProgress(reelId: string, index: number): Promise<ApiResponse<any>> {
    return this.request('/reels/feed', {
      method: 'POST',
      body: JSON.stringify({ 
        action: 'update_progress', 
        reelId, 
        index 
      }),
    });
  }

  async resetReelFeed(): Promise<ApiResponse<any>> {
    return this.request('/reels/feed', {
      method: 'POST',
      body: JSON.stringify({ action: 'reset' }),
    });
  }

  async getReelFeedPosition(): Promise<ApiResponse<any>> {
    return this.request('/reels/feed', {
      method: 'POST',
      body: JSON.stringify({ action: 'get_position' }),
    });
  }

  // Coins
  async getUserCoins(includeTransactions = false): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (includeTransactions) params.append('transactions', 'true');
    
    return this.request(`/coins?${params.toString()}`);
  }

  async getCoinLeaderboard(limit = 10): Promise<ApiResponse<any[]>> {
    return this.request(`/coins/leaderboard?limit=${limit}`);
  }
}

export const apiClient = new ApiClient();