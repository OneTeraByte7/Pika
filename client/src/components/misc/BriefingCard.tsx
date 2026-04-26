import { motion } from 'framer-motion';
import { Zap, TrendingUp, MessageCircle, Heart, Bell } from 'lucide-react';
import { usePikaStore } from '../../store';

interface BriefingItem {
    type: string;
    content: string;
    platform?: string;
    count?: number;
}

interface Briefing {
    summary?: string;
    items?: BriefingItem[];
    highlights?: string[];
    top_insight?: string;
}

const iconForType = (type: string) => {
    if (type.includes('like') || type.includes('heart')) return Heart;
    if (type.includes('comment') || type.includes('reply')) return MessageCircle;
    if (type.includes('trend') || type.includes('growth')) return TrendingUp;
    return Bell;
};

export default function BriefingCard({ briefing: briefingProp }: { briefing?: Briefing }) {
    const storeBriefing = usePikaStore((s) => s.briefing);
    const briefing: Briefing | null = briefingProp || storeBriefing;

    if (!briefing) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <Zap className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20">No Briefing Yet</p>
                <p className="text-white/20 text-sm mt-2">Ask Pika to &ldquo;give me a briefing&rdquo; to get started.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vivid-purple/50 to-transparent" />
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-vivid-purple/10 border border-vivid-purple/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-vivid-purple fill-current" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-vivid-purple mb-2">Daily Briefing</p>
                        <p className="text-white/80 leading-relaxed text-sm">
                            {briefing.summary || briefing.top_insight || 'Here is your social media briefing.'}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Highlights */}
            {briefing.highlights && briefing.highlights.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                >
                    {briefing.highlights.map((h, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 px-5 py-4 bg-white/5 border border-white/8 rounded-2xl"
                        >
                            <span className="text-electric-blue mt-0.5">•</span>
                            <p className="text-white/70 text-sm">{h}</p>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Activity items */}
            {briefing.items && briefing.items.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 px-1">Activity</p>
                    {briefing.items.map((item, i) => {
                        const Icon = iconForType(item.type);
                        return (
                            <div
                                key={i}
                                className="flex items-center gap-4 px-5 py-4 bg-white/5 border border-white/8 rounded-2xl"
                            >
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-white/40" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/70 text-sm truncate">{item.content}</p>
                                    {item.platform && (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-0.5">
                                            {item.platform}
                                        </p>
                                    )}
                                </div>
                                {item.count !== undefined && (
                                    <span className="text-white font-black text-sm flex-shrink-0">{item.count}</span>
                                )}
                            </div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}
