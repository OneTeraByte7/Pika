import { motion } from 'framer-motion';
import { Heart, MessageCircle, TrendingUp, Bell} from 'lucide-react';

export default function BriefingCard({ briefing }) {
    if(!briefing) return null;   

    return (
    <div className="w-full max-w-2xl mx-auto px-4 space-y-4">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          📱 Your Social Update
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {briefing.summary}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl p-4 text-white"
        >
          <MessageCircle className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{briefing.unread_dms}</p>
          <p className="text-sm opacity-90">Unread DMs</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white"
        >
          <Bell className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold">{briefing.notifications.length}</p>
          <p className="text-sm opacity-90">Notifications</p>
        </motion.div>
      </div>

      {/* Top Posts */}
      {briefing.top_posts && briefing.top_posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Trending from Friends
          </h4>
          <div className="space-y-4">
            {briefing.top_posts.map((post, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-genz rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {post.user || 'Friend'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {post.caption}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {post.likes}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Highlights */}
      {briefing.highlights && briefing.highlights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-4">
            ✨ Highlights
          </h4>
          <div className="space-y-3">
            {briefing.highlights.map((highlight, index) => (
              <div
                key={index}
                className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
              >
                <p className="text-sm text-gray-800 dark:text-white">
                  {highlight.description}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  {highlight.platform}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
