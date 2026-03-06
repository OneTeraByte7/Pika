import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Lightbulb,
    Clock,
    TrendingUp,
    Hash,
    Sparkles,
    Calendar,
    Target,
    Zap
} from 'lucide-react';
import { recommendationsAPI } from '../services/advanced';
import toast from 'react-hot-toast';

export default function RecommendationsPage() {
    const [loading, setLoading] = useState(false);
    const [topicSuggestions, setTopicSuggestions] = useState([]);
    const [optimalTimes, setOptimalTimes] = useState([]);
    const [contentIdeas, setContentIdeas] = useState([]);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const [topics, times, ideas] = await Promise.all([
                recommendationsAPI.getTopicSuggestions(1).catch(() => ({ data: { topics: mockTopics } })),
                recommendationsAPI.getOptimalTimes(1).catch(() => ({ data: { optimal_times: mockOptimalTimes } })),
                recommendationsAPI.getContentIdeas(1).catch(() => ({ data: { ideas: mockContentIdeas } }))
            ]);
            
            setTopicSuggestions(topics.data.topics || mockTopics);
            setOptimalTimes(times.data.optimal_times || mockOptimalTimes);
            setContentIdeas(ideas.data.ideas || mockContentIdeas);
        } catch (error) {
            console.error('Failed to load recommendations:', error);
            // Fallback to mock data
            setTopicSuggestions(mockTopics);
            setOptimalTimes(mockOptimalTimes);
            setContentIdeas(mockContentIdeas);
        } finally {
            setLoading(false);
        }
    };

    const mockTopics = [
        { topic: 'Web Development', score: 92, reason: 'High engagement in past posts', trending: true },
        { topic: 'AI & Machine Learning', score: 88, reason: 'Growing interest in your network', trending: true },
        { topic: 'Design Inspiration', score: 85, reason: 'Popular among followers', trending: false },
        { topic: 'Productivity Tips', score: 82, reason: 'High engagement rate', trending: false },
    ];

    const mockOptimalTimes = [
        { day: 'Monday', time: '9:00 AM', engagement: 'High', reason: 'Best for professional content' },
        { day: 'Wednesday', time: '2:00 PM', engagement: 'High', reason: 'Peak afternoon activity' },
        { day: 'Friday', time: '7:00 PM', engagement: 'Medium', reason: 'Weekend wind-down' },
        { day: 'Sunday', time: '11:00 AM', engagement: 'Medium', reason: 'Casual browsing time' },
    ];

    const mockContentIdeas = [
        {
            title: 'Behind-the-scenes: My development setup',
            category: 'Tutorial',
            platforms: ['Instagram', 'Twitter'],
            estimatedEngagement: 'High',
            tags: ['#coding', '#workspace', '#devlife']
        },
        {
            title: 'Top 5 JavaScript tips for beginners',
            category: 'Educational',
            platforms: ['Twitter', 'LinkedIn'],
            estimatedEngagement: 'Very High',
            tags: ['#javascript', '#webdev', '#programming']
        },
        {
            title: 'Weekend project showcase',
            category: 'Showcase',
            platforms: ['Instagram', 'Twitter'],
            estimatedEngagement: 'Medium',
            tags: ['#project', '#showcase', '#coding']
        }
    ];

    const getEngagementColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'very high':
                return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
            case 'high':
                return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
            case 'medium':
                return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
            default:
                return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        AI Recommendations
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Personalized content suggestions powered by AI
                    </p>
                </div>
                <button
                    onClick={fetchRecommendations}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-pika text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Sparkles className="w-5 h-5" />
                    Refresh
                </button>
            </div>

            {/* Trending Topics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Hash className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Trending Topics for You
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {topicSuggestions.map((topic, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700/50 rounded-xl border border-purple-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        {topic.topic}
                                        {topic.trending && (
                                            <TrendingUp className="w-4 h-4 text-purple-600" />
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {topic.reason}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {topic.score}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">score</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Optimal Posting Times */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Best Times to Post
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {optimalTimes.map((time, index) => (
                        <div
                            key={index}
                            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {time.day}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {time.time}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEngagementColor(time.engagement)}`}>
                                    {time.engagement}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {time.reason}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Content Ideas */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Content Ideas
                    </h2>
                </div>

                <div className="space-y-4">
                    {contentIdeas.map((idea, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {idea.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        Category: {idea.category}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {idea.tags?.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getEngagementColor(idea.estimatedEngagement)}`}>
                                    {idea.estimatedEngagement}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <Target className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Best for: {idea.platforms?.join(', ') || 'All platforms'}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
            >
                <h3 className="text-xl font-bold mb-4">💡 Pro Tips</h3>
                <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-purple-200">•</span>
                        <span className="text-purple-50">Post consistently at your optimal times for best results</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-purple-200">•</span>
                        <span className="text-purple-50">Use trending topics to increase discoverability</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-purple-200">•</span>
                        <span className="text-purple-50">Mix educational and entertainment content for balanced engagement</span>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
}
