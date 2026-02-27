import { useState } from 'react';
import Head from 'next/head';
import { Sparkles, Home, MessageSquare, PlusCircle, BarChart3, User, Settings, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import VoiceInterface from '../components/VoiceInterface';
import ResponseDisplay from '../components/ResponseDisplay';
import BriefingCard from '../components/BriefingCard';
import Dashboard from '../components/Dashboard';
import { usePikaStore } from '../store';

export default function App() {
  const [activeTab, setActiveTab] = useState('pika');
  const [showBriefing, setShowBriefing] = useState(false);
  const { briefing } = usePikaStore();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dms', label: 'DMs', icon: MessageSquare },
    { id: 'pika', label: 'Pika', icon: Sparkles, isPrimary: true },
    { id: 'post', label: 'Post', icon: PlusCircle },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard />;
      case 'dms':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                DMs Coming Soon
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Unified DM management across all platforms
              </p>
            </div>
          </div>
        );
      case 'pika':
        return showBriefing ? (
          <BriefingCard briefing={briefing} />
        ) : (
          <>
            <VoiceInterface />
            <ResponseDisplay />
          </>
        );
      case 'post':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <PlusCircle className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Create Post
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Post to multiple platforms at once
              </p>
              <button className="px-6 py-3 bg-gradient-pika text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                Start Creating
              </button>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Analytics Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed insights across all your platforms
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Pika - Your Voice AI Social Agent</title>
        <meta name="description" content="Manage all your social media with voice" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#667eea" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster position="top-center" />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-10 h-10 bg-gradient-pika rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-pika bg-clip-text text-transparent">
                Pika
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {activeTab === 'pika' && (
                <button
                  onClick={() => setShowBriefing(!showBriefing)}
                  className="px-4 py-2 bg-gradient-pika text-white rounded-full font-medium hover:shadow-lg transition-shadow"
                >
                  {showBriefing ? 'Chat' : "What's Up?"}
                </button>
              )}
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-4 py-3 z-50">
          <div className="max-w-7xl mx-auto flex justify-around items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center space-y-1 relative ${
                    tab.isPrimary ? 'px-6' : 'px-2'
                  }`}
                >
                  {tab.isPrimary ? (
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      isActive 
                        ? 'bg-gradient-pika scale-110' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      <Icon className={`w-7 h-7 ${
                        isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                  ) : (
                    <>
                      <Icon className={`w-6 h-6 transition-colors ${
                        isActive 
                          ? 'text-purple-600 dark:text-purple-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`} />
                      <span className={`text-xs font-medium transition-colors ${
                        isActive 
                          ? 'text-purple-600 dark:text-purple-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {tab.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-600 rounded-full"
                        />
                      )}
                    </>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
