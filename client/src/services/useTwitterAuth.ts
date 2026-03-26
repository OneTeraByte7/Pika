// Twitter OAuth Hook
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { twitterService } from '../services/twitterService';
import toast from 'react-hot-toast';

export const useTwitterAuth = () => {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  /**
   * Check if Twitter is already connected
   */
  useEffect(() => {
    checkTwitterConnection();
  }, []);

  const checkTwitterConnection = async () => {
    try {
      const accounts = await twitterService.getConnectedAccounts();
      const twitterAccount = accounts.find(acc => acc.platform === 'twitter' && acc.is_active);
      setIsConnected(!!twitterAccount);
    } catch (error) {
      console.error('Failed to check Twitter connection:', error);
    }
  };

  /**
   * Start Twitter OAuth flow
   */
  const connectTwitter = async () => {
    setIsConnecting(true);
    try {
      if (typeof window === 'undefined') throw new Error('Cannot start OAuth from server side');

      // Get authorization URL from backend
      const { auth_url, state } = await twitterService.getAuthUrl();

      // Save state for verification
      window.localStorage.setItem('twitter_oauth_state', state);

      // Save current path to return to after OAuth
      window.localStorage.setItem('twitter_oauth_return_path', router.pathname);

      // Redirect to Twitter
      window.location.href = auth_url;
    } catch (error: unknown) {
      console.error('Failed to initiate Twitter OAuth:', error);
      // @ts-ignore
      toast.error((error && (error as any).message) || 'Failed to connect Twitter');
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Handle OAuth callback
   */
  const handleCallback = async (code: string, state: string) => {
    try {
      // Verify state matches
      const savedState = typeof window !== 'undefined' ? window.localStorage.getItem('twitter_oauth_state') : null;
      if (state !== savedState) {
        throw new Error('Invalid state parameter. Possible CSRF attack.');
      }

      // Exchange code for tokens
      const result = await twitterService.handleCallback(code, state);

      // Clean up
      if (typeof window !== 'undefined') window.localStorage.removeItem('twitter_oauth_state');

      // Update connection status
      setIsConnected(true);

      // Show success message
      toast.success(`Twitter account @${result.username} connected successfully!`);

      // Get return path
      const returnPath = typeof window !== 'undefined' ? (window.localStorage.getItem('twitter_oauth_return_path') || '/dashboard') : '/dashboard';
      if (typeof window !== 'undefined') window.localStorage.removeItem('twitter_oauth_return_path');

      // Redirect back to original page
      router.push(returnPath);

      return result;
    } catch (error: unknown) {
      console.error('OAuth callback failed:', error);
      // @ts-ignore
      toast.error((error && (error as any).message) || 'Failed to complete Twitter connection');
      throw error;
    }
  };

  /**
   * Disconnect Twitter account
   */
  const disconnectTwitter = async () => {
    try {
      await twitterService.disconnectPlatform('twitter');
      setIsConnected(false);
      toast.success('Twitter account disconnected');
    } catch (error: any) {
      console.error('Failed to disconnect Twitter:', error);
      toast.error(error.message || 'Failed to disconnect Twitter');
      throw error;
    }
  };

  /**
   * Refresh expired token
   */
  const refreshToken = async () => {
    try {
      await twitterService.refreshToken();
      toast.success('Twitter token refreshed');
    } catch (error: any) {
      console.error('Failed to refresh token:', error);
      toast.error(error.message || 'Failed to refresh token');
      throw error;
    }
  };

  return {
    isConnecting,
    isConnected,
    connectTwitter,
    handleCallback,
    disconnectTwitter,
    refreshToken,
    checkTwitterConnection
  };
};
