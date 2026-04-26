import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import Link from 'next/link';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: '/month',
        hex: '#ffffff',
        description: 'For creators just getting started.',
        features: [
            '2 connected platforms',
            '10 AI voice commands/day',
            'Basic analytics',
            'Manual scheduling',
        ],
        cta: 'Get Started',
        href: '/register',
        highlight: false,
    },
    {
        name: 'Pro',
        price: '$19',
        period: '/month',
        hex: '#00f2ff',
        description: 'For serious creators ready to scale.',
        features: [
            'Unlimited platforms',
            'Unlimited voice commands',
            'Advanced analytics & AI insights',
            'Auto-scheduling & optimal times',
            'DM management',
            'Sentiment analysis',
            'Data export',
        ],
        cta: 'Start Free Trial',
        href: '/register',
        highlight: true,
    },
    {
        name: 'Team',
        price: '$49',
        period: '/month',
        hex: '#bd00ff',
        description: 'For agencies and power teams.',
        features: [
            'Everything in Pro',
            'Up to 5 team members',
            'Shared dashboard',
            'Priority support',
            'Custom AI training',
        ],
        cta: 'Contact Us',
        href: '/register',
        highlight: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-32 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-neon-green/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neon-green mb-4">Pricing</p>
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
                        Pick Your{' '}
                        <span
                            className="text-neon-green"
                            style={{ textShadow: '0 0 40px rgba(0,255,136,0.5)' }}
                        >
                            Power
                        </span>
                    </h2>
                    <p className="text-lg text-white/40 max-w-xl mx-auto">
                        No hidden fees. Cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative rounded-3xl p-8 transition-all duration-500 ${
                                plan.highlight
                                    ? 'bg-white/10 border-2 border-electric-blue'
                                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                            }`}
                            style={
                                plan.highlight
                                    ? { boxShadow: '0 0 60px rgba(0,242,255,0.12)' }
                                    : {}
                            }
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-electric-blue text-black text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 whitespace-nowrap">
                                    <Zap className="w-3 h-3 fill-current" />
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <p
                                    className="text-[10px] font-black uppercase tracking-[0.3em] mb-4"
                                    style={{ color: plan.hex }}
                                >
                                    {plan.name}
                                </p>
                                <div className="flex items-end gap-1 mb-3">
                                    <span className="text-5xl font-black text-white">{plan.price}</span>
                                    <span className="text-white/30 font-bold mb-2">{plan.period}</span>
                                </div>
                                <p className="text-white/40 text-sm">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-10">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex items-start gap-3">
                                        <Check
                                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                                            style={{ color: plan.hex }}
                                        />
                                        <span className="text-white/60 text-sm">{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.href}
                                className={`w-full block text-center py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${
                                    plan.highlight
                                        ? 'bg-electric-blue text-black shadow-neon-blue'
                                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                }`}
                            >
                                {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
