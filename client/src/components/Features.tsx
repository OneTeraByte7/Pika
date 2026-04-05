import { motion } from 'framer-motion';
import { Mic2, Zap, MessageSquare, BarChart3, ShieldAlert, Laptop, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Mic2,
    title: 'Voice Native',
    description: 'No more typing. Just speak to Pika and watch your ideas turn into viral posts instantly.',
    color: 'electric-blue',
    gridSpan: 'md:col-span-2 lg:col-span-2',
  },
  {
    icon: Zap,
    title: '1-Tap Blast',
    description: 'Sync Instagram, X, and TikTok with one command.',
    color: 'vivid-purple',
    gridSpan: 'md:col-span-1 lg:col-span-1',
  },
  {
    icon: MessageSquare,
    title: 'DM Sorter',
    description: 'AI filters the clout from the noise. Respond to what matters without getting lost in the sauce.',
    color: 'hot-pink',
    gridSpan: 'md:col-span-1 lg:col-span-1',
  },
  {
    icon: BarChart3,
    title: 'Hype Metrics',
    description: 'Real-time vibes check across all platforms. Know exactly what\'s trending before it peak.',
    color: 'neon-green',
    gridSpan: 'md:col-span-2 lg:col-span-2',
  },
  {
    icon: ShieldAlert,
    title: 'Ghost Mode',
    description: 'Full privacy. Your data stays Yours. No trackers, no cap.',
    color: 'cyber-yellow',
    gridSpan: 'md:col-span-1 lg:col-span-1',
  },
  {
    icon: Laptop,
    title: 'PWA Max',
    description: 'Desktop or Mobile. It just works. Install it for the full experience.',
    color: 'electric-blue',
    gridSpan: 'md:col-span-2 lg:col-span-2',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-pitch-black relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-4 mb-6"
          >
            <div className="h-[2px] w-12 bg-electric-blue" />
            <span className="text-sm font-black uppercase tracking-[0.4em] text-electric-blue">The Loadout</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white"
          >
            High Tech. <br />
            <span className="text-white/20 italic">No Effort.</span>
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${feature.gridSpan} group relative glass-card overflow-hidden cursor-default`}
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="mb-12">
                    <div className={`w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-${feature.color}/20 group-hover:border-${feature.color}/50 transition-all duration-500 mx-auto`}>
                      <Icon className={`w-8 h-8 text-${feature.color}`} />
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-white/40 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-pitch-black bg-white/10 overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                        </div>
                      ))}
                    </div>
                    <Sparkles className={`w-5 h-5 text-${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  </div>
                </div>

                {/* Hover Glow */}
                <div className={`absolute -bottom-20 -right-20 w-64 h-64 bg-${feature.color}/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
