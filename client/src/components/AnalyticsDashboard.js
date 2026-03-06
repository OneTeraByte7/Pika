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
import { analyticsAPI } from '../services/advanced';
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Track your performance across all platforms
                    </p>
                </div>
                <div className="flex gap-2">
                    {['24h', '7d', '30d', '90d'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                timeRange === range
                                    ? 'bg-gradient-pika text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                                {stat.label}
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Posts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Top Performing Posts
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {topPosts.map((post, index) => (
                            <div 
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white mb-1">
                                        {post.title}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {post.platform}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                                        {post.engagement}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        engagements
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
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Hash className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Trending Hashtags
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {trendingHashtags.map((hashtag, index) => (
                            <div 
                                key={index}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-pika rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {hashtag.tag}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {hashtag.count} posts
                                    </span>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
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
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Best Times to Post
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {['Morning (9-11 AM)', 'Afternoon (2-4 PM)', 'Evening (7-9 PM)'].map((time, index) => (
                        <div 
                            key={index}
                            className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700/50 rounded-xl border-2 border-purple-200 dark:border-gray-600"
                        >
                            <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {time}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Peak engagement time
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
