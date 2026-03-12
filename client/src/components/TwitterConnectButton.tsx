// Twitter Connect Button Component
import React from 'react';
import { useTwitterAuth } from '../services/useTwitterAuth';
import { Twitter, Loader2 } from 'lucide-react';

export const TwitterConnectButton = ({ className = '' }) => {
  const { isConnecting, isConnected, connectTwitter } = useTwitterAuth();

  if (isConnected) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg cursor-not-allowed ${className}`}
      >
        <Twitter size={20} />
        <span>Twitter Connected</span>
      </button>
    );
  }

  return (
    <button
      onClick={connectTwitter}
      disabled={isConnecting}
      className={`flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isConnecting ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Twitter size={20} />
          <span>Connect Twitter</span>
        </>
      )}
    </button>
  );
};
