// Social Media Dashboard Page
import React, { useState } from 'react';
import { TwitterConnectButton } from '../components/TwitterConnectButton';
import InstagramConnectButton from '../components/InstagramConnectButton';
import { ConnectedAccounts } from '../components/ConnectedAccounts';
import { TweetComposer } from '../components/TweetComposer';
import { Twitter, Settings, BarChart3 } from 'lucide-react';

export default function SocialDashboard() {
  const [activeTab, setActiveTab] = useState<'compose' | 'accounts' | 'analytics'>('compose');

  return (
    <div className="min-h-screen bg-pitch-black text-white">
      {/* Header */}
      <header className="bg-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/5 p-2 rounded-lg">
                <Twitter className="text-electric-blue" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black">Pika AI</h1>
                <p className="text-sm text-white/50">Social Media Manager</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TwitterConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('compose')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'compose'
                  ? 'border-electric-blue text-electric-blue'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Twitter size={18} />
                <span>Compose</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('accounts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'accounts'
                  ? 'border-electric-blue text-electric-blue'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings size={18} />
                <span>Accounts</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-electric-blue text-electric-blue'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={18} />
                <span>Analytics</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TweetComposer />
            </div>
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-electric-blue mt-0.5">•</span>
                    <span>Keep tweets under 280 characters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-electric-blue mt-0.5">•</span>
                    <span>Instagram requires an image URL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-electric-blue mt-0.5">•</span>
                    <span>Post at optimal times for engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-electric-blue mt-0.5">•</span>
                    <span>Use emojis to increase visibility</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-2">Pro Tip 💡</h3>
                <p className="text-sm text-white/70">
                  Post simultaneously to multiple platforms to save time and maintain consistent messaging across your social media presence.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div>
            <ConnectedAccounts />

            <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Add More Platforms</h3>
              <p className="text-white/70 mb-4">Connect additional social media platforms to expand your reach.</p>
              <div className="flex flex-wrap gap-3">
                <TwitterConnectButton />
                <InstagramConnectButton />
                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white/40 rounded-lg cursor-not-allowed"
                >
                  <span>TikTok</span>
                  <span className="text-xs">(Coming Soon)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-600">
              Track your social media performance, engagement metrics, and audience growth.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
