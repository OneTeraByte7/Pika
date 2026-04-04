// Instagram OAuth Callback Page
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useInstagramAuth } from '../services/useInstagramAuth';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function InstagramCallback() {
  const router = useRouter();
  const { handleCallback } = useInstagramAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connecting your Instagram account...');

  useEffect(() => {
    const processCallback = async () => {
      const { code, state, error, error_description } = router.query;

      if (error) {
        setStatus('error');
        setMessage(error_description as string || 'Authorization failed');
        setTimeout(() => router.push('/social-dashboard'), 3000);
        return;
      }

      if (!code || !state) return;

      try {
        await handleCallback(code as string, state as string);
        setStatus('success');
        setMessage('Successfully connected Instagram account!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to connect Instagram account');
        setTimeout(() => router.push('/social-dashboard'), 3000);
      }
    };

    if (router.isReady) processCallback();
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connecting Instagram</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-4">Redirecting to dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-4">Redirecting back...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
