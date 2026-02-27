import { motion } from 'framer-motion';
import { Instagram, Twitter, MessageCircle, TrendingUp } from 'lucide-react';

const platforms = [
  {
    name: 'Instagram',
    icon: Instagram,
    color: 'from-pink-500 to-purple-600',
    connected: true,
    stats: { followers: '2.4K', posts: 124, engagement: '4.2%' },
  },
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'from-blue-400 to-blue-600',
    connected: true,
    stats: { followers: '1.8K', posts: 342, engagement: '3.8%' },
  },
  {
    name: 'TikTok',
    icon: MessageCircle,
    color: 'from-gray-900 to-gray-700',
    connected: true,
    stats: { followers: '5.2K', posts: 67, engagement: '8.5%' },
  },
];

const recentActivity = [
  { platform: 'Instagram', action: 'New comment on your post', time: '5m ago', icon: Instagram, color: 'text-pink-500' },
  { platform: 'Twitter', action: 'Your tweet got 24 likes', time: '12m ago', icon: Twitter, color: 'text-blue-500' },
  { platform: 'TikTok', action: 'Video reached 1K views', time: '1h ago', icon: MessageCircle, color: 'text-gray-700' },
  { platform: 'Instagram', action: '3 new DMs received', time: '2h ago', icon: Instagram, color: 'text-pink-500' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-purple-100 text-lg">
          You have 12 new notifications across all platforms.
        </p>
      </motion.div>

      {/* Connected Platforms */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Connected Platforms
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                    Connected
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {platform.name}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platform.stats.followers}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platform.stats.posts}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {platform.stats.engagement}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Engagement</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity & Quick Stats Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className={`${activity.color} mt-1`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.platform} • {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            This Week's Growth
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Followers
                </span>
                <span className="text-sm font-bold text-green-600">+234</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Engagement Rate
                </span>
                <span className="text-sm font-bold text-green-600">+5.2%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Posts Published
                </span>
                <span className="text-sm font-bold text-purple-600">12</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 h-2 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
