import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { instagramService } from './instagramService';
import toast from 'react-hot-toast';

export const useInstagramAuth = () => {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkInstagramConnection();
  }, []);

  const checkInstagramConnection = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/social/accounts`, {
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      const instagram = (data.accounts || []).find((a: any) => a.platform === 'instagram' && a.is_active);
      setIsConnected(!!instagram);
    } catch (error) {
      console.error('Failed to check Instagram connection:', error);
    }
  };

  const connectInstagram = async () => {
    setIsConnecting(true);
    try {
      const { auth_url, state } = await instagramService.getAuthUrl();
      window.localStorage.setItem('instagram_oauth_state', state);
      window.localStorage.setItem('instagram_oauth_return_path', router.pathname);
      window.location.href = auth_url;
    } catch (error: any) {
      console.error('Failed to initiate Instagram OAuth:', error);
      toast.error(error.message || 'Failed to connect Instagram');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCallback = async (code: string, state: string) => {
    try {
      const savedState = typeof window !== 'undefined' ? window.localStorage.getItem('instagram_oauth_state') : null;
      if (state !== savedState) throw new Error('Invalid state parameter.');

      const result = await instagramService.handleCallback(code, state);
      if (typeof window !== 'undefined') window.localStorage.removeItem('instagram_oauth_state');
      setIsConnected(true);
      toast.success(`Instagram @${result.username} connected!`);
      const returnPath = typeof window !== 'undefined' ? (window.localStorage.getItem('instagram_oauth_return_path') || '/social-dashboard') : '/social-dashboard';
      if (typeof window !== 'undefined') window.localStorage.removeItem('instagram_oauth_return_path');
      router.push(returnPath);
      return result;
    } catch (error: any) {
      console.error('Instagram callback failed:', error);
      toast.error(error.message || 'Failed to complete Instagram connection');
      throw error;
    }
  };

  const disconnectInstagram = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/social/disconnect/instagram`, { method: 'POST' });
      setIsConnected(false);
      toast.success('Instagram disconnected');
    } catch (error: any) {
      console.error('Failed to disconnect Instagram:', error);
      toast.error('Failed to disconnect Instagram');
      throw error;
    }
  };

  return {
    isConnecting,
    isConnected,
    connectInstagram,
    handleCallback,
    disconnectInstagram,
    checkInstagramConnection
  };
};
