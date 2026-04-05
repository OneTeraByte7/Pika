import { motion } from 'framer-motion';
import { Heart, MessageCircle, TrendingUp, Bell, Zap, Star } from 'lucide-react';

export default function BriefingCard({ briefing }) {
  if (!briefing) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 space-y-8">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card relative overflow-hidden group"
      >
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-electric-blue/10 border border-electric-blue/20 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-electric-blue fill-current" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/60">
              The Digest
            </h3>
          </div>
          <p className="text-xl font-bold text-white leading-relaxed italic">
            "{briefing.summary}"
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-electric-blue/5 blur-[40px] rounded-full" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card border-hot-pink/20 hover:border-hot-pink/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <MessageCircle className="w-6 h-6 text-hot-pink" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Sync</span>
          </div>
          <p className="text-5xl font-black text-white mb-1">{briefing.unread_dms}</p>
          <p className="text-xs font-black uppercase tracking-widest text-white/40">Unread Pings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card border-electric-blue/20 hover:border-electric-blue/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <Bell className="w-6 h-6 text-electric-blue" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Alerts</span>
          </div>
          <p className="text-5xl font-black text-white mb-1">{briefing.notifications.length}</p>
          <p className="text-xs font-black uppercase tracking-widest text-white/40">Broadcasts</p>
        </motion.div>
      </div>

      {/* Top Posts */}
      {briefing.top_posts && briefing.top_posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 flex items-center">
              <TrendingUp className="w-4 h-4 mr-3 text-vivid-purple" />
              Wave Trending
            </h4>
          </div>
          <div className="space-y-4">
            {briefing.top_posts.map((post, index) => (
              <div
                key={index}
                className="flex items-center space-x-6 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white group-hover:text-electric-blue transition-colors">
                    @{post.user || 'Unknown'}
                  </p>
                  <p className="text-xs font-medium text-white/40 truncate">
                    {post.caption}
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-[10px] font-black uppercase tracking-widest">
                    <span className="flex items-center text-hot-pink">
                      <Heart className="w-3 h-3 mr-1.5 fill-current" />
                      {post.likes}
                    </span>
                    <span className="flex items-center text-electric-blue">
                      <MessageCircle className="w-3 h-3 mr-1.5 fill-current" />
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
          className="glass-card"
        >
          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-white/40 mb-8 flex items-center">
            <Star className="w-4 h-4 mr-3 text-cyber-yellow" />
            Key Highlights
          </h4>
          <div className="space-y-4">
            {briefing.highlights.map((highlight, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 border-l-2 border-electric-blue rounded-r-2xl"
              >
                <p className="text-sm font-bold text-white leading-relaxed">
                  {highlight.description}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-electric-blue mt-3">
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
