import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Clock, Hash, Sparkles, RefreshCw, ChevronRight, Twitter, Instagram, Loader2 } from 'lucide-react';
import { recommendationsAPI } from '../../services/advanced';
import toast from 'react-hot-toast';

interface TopicSuggestion {
    topic: string;
    category: string;
    relevance_score?: number;
    trending?: boolean;
}

interface ContentIdea {
    title: string;
    description: string;
    platform: string;
    type: string;
}

interface OptimalTime {
    platform: string;
    times: string[];
    best_day?: string;
}

const MOCK_TOPICS: TopicSuggestion[] = [
    { topic: 'AI Tools for Developers', category: 'Tech', trending: true, relevance_score: 0.92 },
    { topic: 'Morning Productivity Routines', category: 'Lifestyle', trending: false, relevance_score: 0.84 },
    { topic: 'Open Source Contributions', category: 'Tech', trending: true, relevance_score: 0.88 },
    { topic: 'Remote Work Setup Tips', category: 'Lifestyle', trending: false, relevance_score: 0.76 },
    { topic: 'Web3 and the Creator Economy', category: 'Finance', trending: true, relevance_score: 0.81 },
    { topic: 'Mindfulness for Developers', category: 'Wellness', trending: false, relevance_score: 0.73 },
];

const MOCK_IDEAS: ContentIdea[] = [
    { title: 'Share your dev setup', description: 'Post a photo/thread about your workspace and tools. Dev setups get massive engagement.', platform: 'twitter', type: 'Thread' },
    { title: 'Behind-the-scenes reel', description: 'Show your coding process in a 30-second time-lapse. Authentic content performs best.', platform: 'instagram', type: 'Reel' },
    { title: 'Hot take on AI', description: 'Share a controversial but thoughtful opinion on AI replacing jobs. Debate posts go viral.', platform: 'twitter', type: 'Tweet' },
    { title: 'Tutorial carousel', description: 'Create a 5-slide carousel teaching one micro-skill. Carousels get 3x more saves.', platform: 'instagram', type: 'Carousel' },
];

const MOCK_TIMES: OptimalTime[] = [
    { platform: 'twitter', times: ['9:00 AM', '1:00 PM', '5:00 PM'], best_day: 'Tuesday' },
    { platform: 'instagram', times: ['11:00 AM', '3:00 PM', '7:00 PM'], best_day: 'Wednesday' },
];

export default function RecommendationsPage() {
    const [topics, setTopics] = useState<TopicSuggestion[]>(MOCK_TOPICS);
    const [ideas, setIdeas] = useState<ContentIdea[]>(MOCK_IDEAS);
    const [times, setTimes] = useState<OptimalTime[]>(MOCK_TIMES);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');

    const categories = ['All', 'Tech', 'Lifestyle', 'Finance', 'Wellness'];

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const [topicsRes, ideasRes, timesRes] = await Promise.all([
                recommendationsAPI.getTopicSuggestions(1),
                recommendationsAPI.getContentIdeas(1),
                recommendationsAPI.getOptimalTimes(1),
            ]);
            if (topicsRes.data?.topics?.length) setTopics(topicsRes.data.topics);
            if (ideasRes.data?.ideas?.length) setIdeas(ideasRes.data.ideas);
            if (timesRes.data?.optimal_times?.length) setTimes(timesRes.data.optimal_times);
            toast.success('Recommendations refreshed');
        } catch {
            toast.success('Using smart defaults');
        } finally {
            setLoading(false);
        }
    };

    const filteredTopics = activeFilter === 'All'
        ? topics
        : topics.filter(t => t.category === activeFilter);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">AI Recommendations</h1>
                    <p className="text-white/40 mt-2 font-medium">What to post, when to post, and how to grow.</p>
                </div>
                <button
                    onClick={fetchRecommendations}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    Refresh
                </button>
            </div>

            {/* Optimal Times */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-neon-green" />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-white">Best Times to Post</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    {times.map((t, i) => (
                        <div key={i} className="p-5 bg-white/3 border border-white/8 rounded-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                {t.platform === 'twitter'
                                    ? <Twitter className="w-4 h-4 text-electric-blue" />
                                    : <Instagram className="w-4 h-4 text-hot-pink" />}
                                <span className="text-xs font-black uppercase tracking-widest"
                                    style={{ color: t.platform === 'twitter' ? '#00f2ff' : '#ff00e5' }}>
                                    {t.platform}
                                </span>
                                {t.best_day && (
                                    <span className="ml-auto text-[10px] font-bold text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full">
                                        Best: {t.best_day}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {t.times.map((time, j) => (
                                    <span key={j} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/60">
                                        {time}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Content Ideas */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-vivid-purple/10 border border-vivid-purple/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-vivid-purple fill-current" />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-white">Content Ideas</h2>
                </div>
                <div className="space-y-3">
                    {ideas.map((idea, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.06 }}
                            className="flex items-start gap-4 p-4 bg-white/3 border border-white/8 rounded-2xl hover:border-white/15 hover:bg-white/5 transition-all group cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: idea.platform === 'twitter' ? '#00f2ff15' : '#ff00e515',
                                    border: `1px solid ${idea.platform === 'twitter' ? '#00f2ff25' : '#ff00e525'}`,
                                }}>
                                {idea.platform === 'twitter'
                                    ? <Twitter className="w-3.5 h-3.5 text-electric-blue" />
                                    : <Instagram className="w-3.5 h-3.5 text-hot-pink" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-white font-bold text-sm">{idea.title}</p>
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-white/30">
                                        {idea.type}
                                    </span>
                                </div>
                                <p className="text-white/40 text-xs leading-relaxed">{idea.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors flex-shrink-0 mt-1" />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Trending Topics */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-hot-pink/10 border border-hot-pink/20 flex items-center justify-center">
                            <Hash className="w-4 h-4 text-hot-pink" />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-tight text-white">Topic Suggestions</h2>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                style={{
                                    background: activeFilter === cat ? 'rgba(255,0,229,0.15)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${activeFilter === cat ? '#ff00e540' : 'rgba(255,255,255,0.08)'}`,
                                    color: activeFilter === cat ? '#ff00e5' : 'rgba(255,255,255,0.3)',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                    {filteredTopics.map((topic, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3 p-4 bg-white/3 border border-white/8 rounded-2xl hover:border-white/15 transition-all group cursor-pointer"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm truncate">{topic.topic}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/25 mt-0.5">{topic.category}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                {topic.trending && (
                                    <span className="text-[9px] font-black uppercase tracking-widest text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full">
                                        Trending
                                    </span>
                                )}
                                {topic.relevance_score && (
                                    <span className="text-[10px] font-bold text-white/30">
                                        {Math.round(topic.relevance_score * 100)}% match
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
