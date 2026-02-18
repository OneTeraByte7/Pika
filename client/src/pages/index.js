import { useEffect, useStore } from 'react';
import Head from 'next/head';
import { Sparkles, Menu, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import VoiceInterface from '../components/VoiceInterface';
import ResponseDisplay from '../components/ResponseDisplay';
import BriefingCard from '../components/BriefingCard';
import { pikaAPI } from '../services/api';
import { usePikaStore } from '../store';

export default function Home() {
    const [showBriefing, setShowBriefing] = useState(false);
    const { briefing, setBriefing } = usePikaStore();

    useEffect(() => {
        loadBriefing();
    }, []);

    const loadBriefing = async () => {
        try {
            const response = await pikaAPI getBriefing();
            setBriefing(response.data);
        } catch(error) {
            console.error('Failed to load briefing:', error);
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
              <button
                onClick={() => setShowBriefing(!showBriefing)}
                className="px-4 py-2 bg-gradient-pika text-white rounded-full font-medium hover:shadow-lg transition-shadow"
              >
                {showBriefing ? 'Chat' : "What's Up?"}
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8">
          {showBriefing ? (
            <BriefingCard briefing={briefing} />
          ) : (
            <>
              <VoiceInterface />
              <ResponseDisplay />
            </>
          )}
        </main>

        {/* Bottom Quick Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex justify-around">
            <button className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <div className="w-8 h-8 flex items-center justify-center">📱</div>
              <span className="text-xs font-medium">Feed</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <div className="w-8 h-8 flex items-center justify-center">💬</div>
              <span className="text-xs font-medium">DMs</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-purple-600 dark:text-purple-400">
              <div className="w-8 h-8 flex items-center justify-center">🎤</div>
              <span className="text-xs font-medium">Pika</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <div className="w-8 h-8 flex items-center justify-center">✍️</div>
              <span className="text-xs font-medium">Post</span>
            </button>
            <button className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <div className="w-8 h-8 flex items-center justify-center">👤</div>
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}