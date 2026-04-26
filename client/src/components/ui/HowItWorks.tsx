import { motion } from 'framer-motion';
import { UserPlus, Link2, Mic, TrendingUp } from 'lucide-react';

const steps = [
    {
        number: '01',
        icon: UserPlus,
        hex: '#00f2ff',
        title: 'Create Account',
        description: 'Sign up in seconds. No credit card required to get started.',
    },
    {
        number: '02',
        icon: Link2,
        hex: '#bd00ff',
        title: 'Connect Platforms',
        description: 'Link Instagram, Twitter, and TikTok with one-click OAuth.',
    },
    {
        number: '03',
        icon: Mic,
        hex: '#00ff88',
        title: 'Speak Your Intent',
        description: 'Tell Pika what to post, when to post, or what to analyze — out loud.',
    },
    {
        number: '04',
        icon: TrendingUp,
        hex: '#ff00e5',
        title: 'Watch It Grow',
        description: 'Track engagement, receive AI recommendations, and dominate the feed.',
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-vivid-purple/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-vivid-purple mb-4">Process</p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                        Four Steps to{' '}
                        <span
                            className="text-vivid-purple"
                            style={{ textShadow: '0 0 40px rgba(189,0,255,0.5)' }}
                        >
                            Control
                        </span>
                    </h2>
                    <p className="text-lg text-white/40 max-w-xl mx-auto">
                        From signup to full social domination in under five minutes.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="relative glass-card group hover:border-white/30"
                            >
                                {/* Background step number */}
                                <div
                                    className="absolute top-6 right-6 text-7xl font-black leading-none select-none pointer-events-none"
                                    style={{ color: `${step.hex}12` }}
                                >
                                    {step.number}
                                </div>

                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                                    style={{
                                        background: `${step.hex}15`,
                                        border: `1px solid ${step.hex}30`,
                                    }}
                                >
                                    <Icon className="w-7 h-7" style={{ color: step.hex }} />
                                </div>

                                <p
                                    className="text-xs font-black uppercase tracking-[0.3em] mb-2"
                                    style={{ color: step.hex }}
                                >
                                    Step {step.number}
                                </p>
                                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-white/40 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
