// Connected Accounts Component
import React, { useState, useEffect } from 'react';
import { twitterService, ConnectedAccount } from '../services/twitterService';
import { Twitter, Instagram, Music, Loader2, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  tiktok: Music
};

const platformColors = {
  twitter: 'bg-blue-500',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  tiktok: 'bg-black'
};

export const ConnectedAccounts = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await twitterService.getConnectedAccounts();
      setAccounts(data);
    } catch (error: any) {
      console.error('Failed to load accounts:', error);
      toast.error('Failed to load connected accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (platform: string) => {
    // guard `confirm` for SSR
    if (typeof window === 'undefined' || !window.confirm(`Are you sure you want to disconnect ${platform}?`)) {
      return;
    }

    try {
      setDisconnecting(platform);
      await twitterService.disconnectPlatform(platform);
      toast.success(`${platform} disconnected successfully`);
      await loadAccounts();
    } catch (error: unknown) {
      console.error('Failed to disconnect:', error);
      // @ts-ignore
      toast.error((error && (error as any).message) || `Failed to disconnect ${platform}`);
    } finally {
      setDisconnecting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-600 mb-4">No social accounts connected yet</p>
        <p className="text-sm text-gray-500">Connect your social media accounts to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Connected Accounts</h3>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => {
          const Icon = platformIcons[account.platform as keyof typeof platformIcons];
          const color = platformColors[account.platform as keyof typeof platformColors];

          return (
            <div
              key={account.platform}
              className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`${color} p-2 rounded-lg text-white`}>
                  {Icon && <Icon size={24} />}
                </div>
                
                <button
                  onClick={() => handleDisconnect(account.platform)}
                  disabled={disconnecting === account.platform}
                  className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  title="Disconnect"
                >
                  {disconnecting === account.platform ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <X size={18} />
                  )}
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 capitalize">
                    {account.platform}
                  </h4>
                  {account.is_active && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                </div>
                
                <p className="text-sm text-gray-600">@{account.username}</p>
                
                <p className="text-xs text-gray-400 mt-2">
                  Connected {new Date(account.connected_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
