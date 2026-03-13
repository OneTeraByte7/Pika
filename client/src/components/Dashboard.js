import { motion } from 'framer-motion';
import { Instagram, Twitter, MessageCircle, TrendingUp, Zap, Bell } from 'lucide-react';

const platforms = [
  {
    name: 'Instagram',
    icon: Instagram,
    color: 'hot-pink',
    connected: true,
    stats: { followers: '2.4K', posts: 124, engagement: '4.2%' },
  },
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'electric-blue',
    connected: true,
    stats: { followers: '1.8K', posts: 342, engagement: '3.8%' },
  },
  {
    name: 'TikTok',
    icon: MessageCircle,
    color: 'white',
    connected: true,
    stats: { followers: '5.2K', posts: 67, engagement: '8.5%' },
  },
];

const recentActivity = [
  { platform: 'Instagram', action: 'New comment on your post', time: '5m ago', icon: Instagram, color: 'text-hot-pink' },
  { platform: 'Twitter', action: 'Your tweet got 24 likes', time: '12m ago', icon: Twitter, color: 'text-electric-blue' },
  { platform: 'TikTok', action: 'Video reached 1K views', time: '1h ago', icon: MessageCircle, color: 'text-white' },
  { platform: 'Instagram', action: '3 new DMs received', time: '2h ago', icon: Instagram, color: 'text-hot-pink' },
];

export default function Dashboard() {
  return (
    <div className="space-y-12 pb-12">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] p-12 bg-white text-black"
      >
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-electric-blue fill-current" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.4em]">Active Sypnosis</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Welcome Back.</h1>
          <p className="text-xl font-bold uppercase tracking-tight text-black/60 max-w-lg">
            You have <span className="text-black border-b-2 border-black">12 priority pings</span> waiting in the void.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-hot-pink/20 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
      </motion.div>

      {/* Connected Platforms */}
      <div>
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-[2px] w-8 bg-electric-blue" />
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Linked Nodes</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-card group hover:border-white/30 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-14 h-14 bg-${platform.color}/10 border border-${platform.color}/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-7 h-7 text-${platform.color}`} />
                  </div>
                  <span className={`px-4 py-1.5 bg-${platform.color}/5 border border-${platform.color}/20 text-${platform.color} text-[10px] font-black uppercase tracking-widest rounded-full`}>
                    Active
                  </span>
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-8">
                  {platform.name}
                </h3>

                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
                  <div>
                    <p className="text-xl font-black text-white">{platform.stats.followers}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Clout</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-white">{platform.stats.posts}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Drops</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-white">{platform.stats.engagement}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Vibe</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Activity & Stats Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black uppercase tracking-tight text-white">Live Stream</h3>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Realtime</span>
            </div>
          </div>

          <div className="space-y-6">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-6 p-4 rounded-2xl hover:bg-white/[0.03] transition-colors group cursor-default"
                >
                  <div className={`w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:border-white/30`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white mb-1 group-hover:text-electric-blue transition-colors">
                      {activity.action}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
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
          className="glass-card"
        >
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-10 h-10 bg-vivid-purple/10 border border-vivid-purple/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-vivid-purple" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">Pulse Check</h3>
          </div>

          <div className="space-y-10 pt-4">
            <div>
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Followers</span>
                <span className="text-xs font-black text-neon-green uppercase tracking-widest">+234</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  className="bg-electric-blue h-full shadow-[0_0_8px_#00f2ff]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Engagement Rate</span>
                <span className="text-xs font-black text-neon-green uppercase tracking-widest">+5.2%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  className="bg-hot-pink h-full shadow-[0_0_8px_#ff00e5]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Drops Lifecycle</span>
                <span className="text-xs font-black text-vivid-purple uppercase tracking-widest">12 Total</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '48%' }}
                  className="bg-vivid-purple h-full shadow-[0_0_8px_#bd00ff]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
