// Instagram API Service
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface InstagramAuthUrlResponse {
  auth_url: string;
  state: string;
}

export interface InstagramCallbackResponse {
  success: boolean;
  platform: string;
  username: string;
  user_id: string;
  message: string;
}

class InstagramService {
  private getAuthHeaders() {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = window.localStorage.getItem('access_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (e) {}
    return headers;
  }

  private extractErrorMessage(err: unknown) {
    try {
      // @ts-ignore
      if (err && err.response && err.response.data) return err.response.data.detail || err.response.data.message || String(err);
    } catch {}
    try {
      // @ts-ignore
      if (err && err.message) return err.message;
    } catch {}
    return String(err ?? 'Unknown error');
  }

  async getAuthUrl(): Promise<InstagramAuthUrlResponse> {
    try {
      const response = await axios.get<InstagramAuthUrlResponse>(
        `${API_BASE_URL}/instagram/auth/url`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      console.error('Failed to get Instagram auth URL:', error);
      throw new Error(this.extractErrorMessage(error) || 'Failed to get authorization URL');
    }
  }

  async handleCallback(code: string, state: string): Promise<InstagramCallbackResponse> {
    try {
      const response = await axios.post<InstagramCallbackResponse>(
        `${API_BASE_URL}/instagram/auth/callback`,
        { code, state },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: unknown) {
      console.error('Instagram OAuth callback failed:', error);
      throw new Error(this.extractErrorMessage(error) || 'Failed to connect Instagram account');
    }
  }
}

export const instagramService = new InstagramService();
