// Twitter API Service
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface TwitterAuthUrlResponse {
  auth_url: string;
  state: string;
}

export interface TwitterCallbackResponse {
  success: boolean;
  platform: string;
  username: string;
  user_id: string;
  message: string;
}

export interface ConnectedAccount {
  platform: string;
  username: string;
  connected_at: string;
  is_active: boolean;
}

export interface PostResponse {
  success: boolean;
  results: {
    [platform: string]: {
      success: boolean;
      post_id?: string;
      url?: string;
      error?: string;
    };
  };
  message: string;
}

class TwitterService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get Twitter OAuth authorization URL
   */
  async getAuthUrl(): Promise<TwitterAuthUrlResponse> {
    try {
      const response = await axios.get<TwitterAuthUrlResponse>(
        `${API_BASE_URL}/twitter/auth/url`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to get Twitter auth URL:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get authorization URL');
    }
  }

  /**
   * Complete Twitter OAuth callback
   */
  async handleCallback(code: string, state: string): Promise<TwitterCallbackResponse> {
    try {
      const response = await axios.post<TwitterCallbackResponse>(
        `${API_BASE_URL}/twitter/auth/callback`,
        { code, state },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Twitter OAuth callback failed:', error);
      throw new Error(error.response?.data?.detail || 'Failed to connect Twitter account');
    }
  }

  /**
   * Refresh Twitter access token
   */
  async refreshToken(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/twitter/refresh-token`,
        {},
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to refresh Twitter token:', error);
      throw new Error(error.response?.data?.detail || 'Failed to refresh token');
    }
  }

  /**
   * Get all connected social accounts
   */
  async getConnectedAccounts(): Promise<ConnectedAccount[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/social/accounts`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.accounts || [];
    } catch (error: any) {
      console.error('Failed to get connected accounts:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch accounts');
    }
  }

  /**
   * Post content to social platforms
   */
  async postContent(platforms: string[], content: string, mediaUrl?: string): Promise<PostResponse> {
    try {
      const response = await axios.post<PostResponse>(
        `${API_BASE_URL}/social/post`,
        {
          platform: platforms,
          content,
          media_url: mediaUrl
        },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to post content:', error);
      throw new Error(error.response?.data?.detail || 'Failed to post content');
    }
  }

  /**
   * Disconnect a social platform
   */
  async disconnectPlatform(platform: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/social/disconnect/${platform}`,
        {},
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to disconnect platform:', error);
      throw new Error(error.response?.data?.detail || 'Failed to disconnect platform');
    }
  }
}

export const twitterService = new TwitterService();
