import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                Voice-First AI Agent
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Social media,
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                simplified.
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Manage all your social platforms with just your voice. 
              Pika aggregates Instagram, Twitter, and TikTok into one intelligent conversation.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/app">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  Start Talking
                </motion.button>
              </Link>
              <Link href="#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
                >
                  See Demo
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">50%</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Less Time</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">3+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Platforms</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">∞</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Possibilities</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[500px] hidden md:block"
          >
            {/* Floating Card 1 */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 left-0 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 dark:text-white">Sarah Chen</p>
                  <p className="text-xs text-gray-500">@sarahc</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                "Pika just posted my content to all platforms in seconds! 🚀"
              </p>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-32 right-0 w-72 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Your Morning Brief</h3>
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-sm opacity-90 mb-4">
                You have 12 new DMs and your latest post got 234 likes across all platforms.
              </p>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full" />
                <div className="w-8 h-8 bg-white/20 rounded-full" />
                <div className="w-8 h-8 bg-white/20 rounded-full" />
              </div>
            </motion.div>

            {/* Floating Card 3 */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute bottom-0 left-12 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-pika rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Pika AI</p>
                  <p className="text-xs text-gray-500">Voice Assistant</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <div className="w-1 h-8 bg-purple-400 rounded-full voice-wave" style={{ animationDelay: '0s' }} />
                <div className="w-1 h-8 bg-purple-400 rounded-full voice-wave" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-8 bg-purple-400 rounded-full voice-wave" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-8 bg-purple-400 rounded-full voice-wave" style={{ animationDelay: '0.3s' }} />
                <div className="w-1 h-8 bg-purple-400 rounded-full voice-wave" style={{ animationDelay: '0.4s' }} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
