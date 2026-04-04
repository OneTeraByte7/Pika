import React from 'react';
import { useInstagramAuth } from '../services/useInstagramAuth';
import { Instagram, Loader2 } from 'lucide-react';

export const InstagramConnectButton = ({ className = '' }) => {
  const { isConnecting, isConnected, connectInstagram } = useInstagramAuth();

  if (isConnected) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white rounded-lg cursor-not-allowed ${className}`}
      >
        <Instagram size={20} />
        <span>Instagram Connected</span>
      </button>
    );
  }

  return (
    <button
      onClick={connectInstagram}
      disabled={isConnecting}
      className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 hover:opacity-95 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isConnecting ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Instagram size={20} />
          <span>Connect Instagram</span>
        </>
      )}
    </button>
  );
};

export default InstagramConnectButton;
