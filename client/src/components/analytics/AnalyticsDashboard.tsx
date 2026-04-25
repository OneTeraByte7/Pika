import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Heart,
    MessageCircle,
    Share2,
    Users,
    Eye,
    BarChart3,
    Calendar,
    Hash,
    Zap
} from 'lucide-react';
import { analyticsAPI } from '../../services/advanced.js';
import toast from 'react-hot-toast';

export default function AnalyticsDashboard() {
    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [timeRange, setTimeRange] = useState('7d');

    const mockPosts = [
        {
            content: "Just launched my new project! 🚀 #coding #webdev",
            likes: 150,
            comments: 23,
            shares: 12,
            views: 1200,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            platform: "twitter"
        },
        {
            content: "Beautiful sunset today 🌅 #photography",
            likes: 320,
            comments: 45,
            shares: 28,
            views: 2500,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            platform: "instagram"
        },
        {
            content: "Quick tutorial on React hooks! #reactjs #javascript",
            likes: 89,
            comments: 15,
            shares: 34,
            views: 980,
            created_at: new Date(Date.now() - 259200000).toISOString(),
            platform: "twitter"
        }
    ];

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await analyticsAPI.analyzePosts(1, mockPosts);
            setAnalytics(response.data);
        } catch (error) {
            toast.error('Failed to load analytics');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            label: 'Total Engagement',
            value: '716',
            change: '+12.5%',
            icon: Heart,
            color: 'from-pink-500 to-rose-500'
        },
        {
            label: 'Avg. Engagement Rate',
            value: '4.8%',
            change: '+2.1%',
            icon: TrendingUp,
            color: 'from-purple-500 to-indigo-500'
        },
        {
            label: 'Total Reach',
            value: '4.7K',
            change: '+18.3%',
            icon: Eye,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            label: 'Followers Growth',
            value: '+234',
            change: '+8.7%',
            icon: Users,
            color: 'from-green-500 to-emerald-500'
        },
    ];

    const topPosts = [
        { title: 'Beautiful sunset today 🌅', engagement: 393, platform: 'Instagram', color: 'pink' },
        { title: 'Just launched my new project! 🚀', engagement: 185, platform: 'Twitter', color: 'blue' },
        { title: 'Quick tutorial on React hooks!', engagement: 138, platform: 'Twitter', color: 'blue' },
    ];

    const trendingHashtags = analytics?.trending_hashtags || [
        { tag: '#coding', count: 3, growth: '+45%' },
        { tag: '#webdev', count: 2, growth: '+32%' },
        { tag: '#photography', count: 2, growth: '+28%' },
        { tag: '#reactjs', count: 1, growth: '+15%' },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Intel Center
                    </h1>
                    <p className="text-white/40 font-medium mt-2">
                        Tracking your digital footprint in the void.
                    </p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                    {['24h', '7d', '30d', '90d'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${timeRange === range
                                    ? 'bg-electric-blue text-black shadow-neon-blue'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    const colorMap = {
                        'from-pink-500 to-rose-500': 'hot-pink',
                        'from-purple-500 to-indigo-500': 'vivid-purple',
                        'from-blue-500 to-cyan-500': 'electric-blue',
                        'from-green-500 to-emerald-500': 'neon-green'
                    };
                    const newColor = colorMap[stat.color] || 'electric-blue';

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card group hover:border-white/30 transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 bg-${newColor}/10 border border-${newColor}/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-6 h-6 text-${newColor}`} />
                                </div>
                                <span className="text-neon-green text-xs font-black uppercase tracking-widest">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                                {stat.label}
                            </h3>
                            <p className="text-4xl font-black tracking-tighter text-white">
                                {stat.value}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Top Posts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-hot-pink/10 border border-hot-pink/20 rounded-xl flex items-center justify-center">
                            <Zap className="w-5 h-5 text-hot-pink" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-white">
                            Alpha Content
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {topPosts.map((post, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
                            >
                                <div className="flex-1">
                                    <p className="font-bold text-white mb-1 group-hover:text-electric-blue transition-colors">
                                        {post.title}
                                    </p>
                                    <p className="text-xs font-black uppercase tracking-widest text-white/30">
                                        {post.platform}
                                    </p>
                                </div>
                                <div className="text-right pl-4">
                                    <p className="text-2xl font-black text-white">
                                        {post.engagement}
                                    </p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
                                        Engaged
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Trending Hashtags */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 bg-electric-blue/10 border border-electric-blue/20 rounded-xl flex items-center justify-center">
                            <Hash className="w-5 h-5 text-electric-blue" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-white">
                            Vibe Graph
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {trendingHashtags.slice(0, 4).map((hashtag, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-electric-blue/20 rounded-lg flex items-center justify-center text-electric-blue font-black text-xs">
                                        {index + 1}
                                    </div>
                                    <span className="font-bold text-white">
                                        {hashtag.tag}
                                    </span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/30">
                                        {hashtag.count} Posts
                                    </span>
                                    <span className="text-xs font-black text-neon-green">
                                        {hashtag.growth}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Optimal Posting Times */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-neon-green/10 border border-neon-green/20 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-neon-green" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white">
                        Peak Performance Hours
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {['Dawn (9-11 AM)', 'Zenith (2-4 PM)', 'Night (7-9 PM)'].map((time, index) => (
                        <div
                            key={index}
                            className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-neon-green/30 transition-all group"
                        >
                            <p className="text-xl font-black uppercase tracking-tight text-white mb-2 group-hover:text-neon-green transition-colors">
                                {time}
                            </p>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/20">
                                Optimal Sync
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
