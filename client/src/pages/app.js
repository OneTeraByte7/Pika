import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Sparkles, Home, MessageSquare, PlusCircle, BarChart3, User, Settings, Menu, Calendar, Bell, Lightbulb, Download, Activity, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import VoiceInterface from '../components/voice/VoiceInterface';
import ResponseDisplay from '../components/ui/ResponseDisplay';
import BriefingCard from '../components/misc/BriefingCard';
import Dashboard from '../components/features/Dashboard';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import ContentScheduler from '../components/features/ContentScheduler';
import NotificationsCenter from '../components/misc/NotificationsCenter';
import RecommendationsPage from '../components/features/RecommendationsPage';
import DataExport from '../components/analytics/DataExport';
import EngagementTracker from '../components/analytics/EngagementTracker';
import SentimentAnalysis from '../components/analytics/SentimentAnalysis';
import { usePikaStore } from '../store';

export default function App() {
  const [activeTab, setActiveTab] = useState('pika');
  const [showBriefing, setShowBriefing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const router = useRouter();
  const { briefing } = usePikaStore();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'pika', label: 'Pika', icon: Sparkles, isPrimary: true },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
  ];

  const moreMenuItems = [
    { id: 'social-dashboard', label: 'Dashboard', icon: Home },
    { id: 'scheduler', label: 'Scheduler', icon: Calendar },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'recommendations', label: 'AI Ideas', icon: Lightbulb },
    { id: 'sentiment', label: 'Sentiment AI', icon: Brain },
    { id: 'engagement', label: 'Engagement', icon: Activity },
    { id: 'export', label: 'Export Data', icon: Download },
    { id: 'dms', label: 'DMs', icon: MessageSquare },
    { id: 'post', label: 'Post', icon: PlusCircle },
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
        return <AnalyticsDashboard />;
      case 'scheduler':
        return <ContentScheduler />;
      case 'notifications':
        return <NotificationsCenter />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'sentiment':
        return <SentimentAnalysis />;
      case 'engagement':
        return <EngagementTracker />;
      case 'export':
        return <DataExport />;
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

      <div className="min-h-screen bg-pitch-black text-white selection:bg-electric-blue selection:text-black">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-2xl bg-black/60 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => setActiveTab('home')}>
              <motion.div
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-0.5"
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white fill-current" />
                </div>
              </motion.div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">
                  Pika
                </h1>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Neural Hub</span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {activeTab === 'pika' && (
                <button
                  onClick={() => setShowBriefing(!showBriefing)}
                  className="hidden md:flex items-center px-6 py-2.5 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-neon-white"
                >
                  {showBriefing ? 'Terminal' : "Sync Void"}
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                  <Menu className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
                </button>

                <AnimatePresence>
                  {showMoreMenu && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                        onClick={() => setShowMoreMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 mt-4 w-64 bg-[#0b1220] border border-white/10 rounded-2xl p-2 z-50 shadow-lg"
                      >
                        {moreMenuItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                // If this item is the social dashboard, navigate to the page.
                                if (item.id === 'social-dashboard') {
                                  router.push('/social-dashboard');
                                  setShowMoreMenu(false);
                                  return;
                                }

                                setActiveTab(item.id);
                                setShowMoreMenu(false);
                              }}
                              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all group ${isActive ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'
                                }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? 'bg-electric-blue text-black' : 'bg-white/5 text-white/40 group-hover:text-white'
                                }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'
                                }`}>
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl">
          <div className="flex items-center space-x-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative group flex flex-col items-center"
                >
                  <Icon className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-white/30 group-hover:text-white/60'
                    }`} />

                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute -bottom-2 w-1.5 h-1.5 bg-electric-blue rounded-full shadow-neon-blue"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
