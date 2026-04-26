import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mic, Zap } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
            {/* Background glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-electric-blue/8 blur-[140px] rounded-full pointer-events-none animate-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-vivid-purple/8 blur-[140px] rounded-full pointer-events-none animate-glow" />
            <div className="absolute inset-0 bg-grid-glow opacity-20 pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-electric-blue/30 rounded-full mb-10"
                >
                    <Zap className="w-3.5 h-3.5 text-electric-blue fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-electric-blue">Voice-First AI Social Agent</span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-8"
                >
                    <span className="text-white">Create.</span>{' '}
                    <span
                        className="text-electric-blue"
                        style={{ textShadow: '0 0 60px rgba(0,242,255,0.5)' }}
                    >
                        Schedule.
                    </span>{' '}
                    <span className="text-white">Grow.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-white/40 font-medium max-w-2xl mx-auto mb-14 leading-relaxed"
                >
                    Manage all your social media with just your voice. Instagram, Twitter, and TikTok —
                    one intelligent conversation.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
                >
                    <Link
                        href="/register"
                        className="group flex items-center gap-3 px-8 py-4 bg-electric-blue text-black text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-neon-blue"
                    >
                        Get Started Free
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                        <Mic className="w-4 h-4 text-vivid-purple" />
                        See it in action
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-3 gap-8 max-w-md mx-auto border-t border-white/5 pt-12"
                >
                    {[
                        { label: 'Platforms', value: '3+' },
                        { label: 'Time Saved', value: '10x' },
                        { label: 'AI Powered', value: '100%' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-4xl font-black text-white">{stat.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-2">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
