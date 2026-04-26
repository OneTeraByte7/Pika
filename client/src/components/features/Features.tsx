import { motion } from 'framer-motion';
import { Mic, BarChart3, Calendar, Zap, MessageSquare, Shield } from 'lucide-react';

const features = [
    {
        icon: Mic,
        hex: '#00f2ff',
        title: 'Voice Control',
        description: 'Just speak — Pika handles posting, replying, and scheduling across all your platforms.',
    },
    {
        icon: BarChart3,
        hex: '#bd00ff',
        title: 'Smart Analytics',
        description: 'Real-time insights on engagement, reach, and audience growth in one unified dashboard.',
    },
    {
        icon: Calendar,
        hex: '#00ff88',
        title: 'Auto Scheduler',
        description: 'AI picks the optimal time to post so your content always lands when it matters most.',
    },
    {
        icon: Zap,
        hex: '#ff00e5',
        title: 'Instant Posting',
        description: 'Publish simultaneously to Instagram, Twitter, and TikTok with a single command.',
    },
    {
        icon: MessageSquare,
        hex: '#fff200',
        title: 'DM Management',
        description: 'Read, reply, and manage direct messages from all platforms in one unified inbox.',
    },
    {
        icon: Shield,
        hex: '#00f2ff',
        title: 'Sentiment AI',
        description: 'Detect toxic content and analyze comment sentiment before you engage.',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-32 relative">
            <div className="absolute inset-0 bg-grid-glow opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-electric-blue mb-4">Capabilities</p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                        Built to Dominate
                    </h2>
                    <p className="text-lg text-white/40 max-w-xl mx-auto">
                        Every tool you need to rule your social presence, powered by voice-native AI.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="glass-card group hover:border-white/30"
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                                    style={{
                                        background: `${feature.hex}15`,
                                        border: `1px solid ${feature.hex}30`,
                                    }}
                                >
                                    <Icon className="w-7 h-7" style={{ color: feature.hex }} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-white/40 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
