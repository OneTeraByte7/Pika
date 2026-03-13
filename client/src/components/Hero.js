import { motion } from 'framer-motion';
import { Zap, Play, ArrowRight, Star, Sparkles, Command } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-pitch-black" />
        <div className="absolute inset-0 bg-grid-glow opacity-30" />
        <div className="absolute inset-0 bg-noise" />

        {/* Cinematic Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-vivid-purple/20 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-electric-blue/10 blur-[120px] rounded-full animate-glow" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full mb-12 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-electric-blue" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/80">
              The Future of Social AI
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[12vw] sm:text-[10vw] lg:text-[8vw] font-[900] leading-[0.8] uppercase tracking-tighter mb-12 select-none"
          >
            <span className="block text-white">Social</span>
            <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-vivid-purple to-hot-pink animate-gradient">
              Evolved.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl text-lg md:text-xl text-white/50 font-medium leading-relaxed mb-12"
          >
            Pika is the first voice-native AI agent that manages your entire social presence.
            Talk to your audience, automate your growth, and dominate the feed.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8"
          >
            <Link href="/app">
              <motion.button
                whileHover={{ scale: 1.05, shadow: "0 0 40px rgba(0, 242, 255, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-6 bg-electric-blue text-black font-black uppercase tracking-[0.2em] rounded-full overflow-hidden"
              >
                <div className="relative z-10 flex items-center space-x-3">
                  <span>Open Pika</span>
                  <Zap className="w-5 h-5 fill-black" />
                </div>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>
            </Link>

            <Link href="#how-it-works">
              <button className="flex items-center space-x-3 group">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:border-electric-blue group-hover:bg-electric-blue/10 transition-all">
                  <Play className="w-5 h-5 text-white group-hover:text-electric-blue fill-current" />
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                  Watch Demo
                </span>
              </button>
            </Link>
          </motion.div>

          {/* Floating Elements (Decorative) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 10, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[20%] left-[10%] w-32 h-32 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-xl flex items-center justify-center"
            >
              <Command className="w-10 h-10 text-electric-blue/50" />
            </motion.div>

            <motion.div
              animate={{
                y: [20, -20, 20],
                rotate: [0, -10, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[20%] right-[10%] w-40 h-40 bg-white/5 border border-white/10 rounded-[60px] backdrop-blur-xl flex items-center justify-center shadow-neon-purple"
            >
              <div className="w-full px-6 space-y-3">
                <div className="h-2 w-[80%] bg-vivid-purple/30 rounded-full" />
                <div className="h-2 w-[60%] bg-vivid-purple/20 rounded-full" />
                <div className="h-2 w-[90%] bg-vivid-purple/40 rounded-full" />
              </div>
            </motion.div>

            {/* Stars/Dots */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 2 + i % 3, repeat: Infinity }}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-4"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">Scroll</span>
        <div className="w-[2px] h-12 bg-gradient-to-b from-electric-blue to-transparent" />
      </motion.div>
    </section>
  );
}
