import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Activity,
    TrendingUp,
    Heart,
    MessageCircle,
    Eye,
    Users,
    Calendar,
    Target
} from 'lucide-react';
import { engagementAPI } from '../services/advanced';

export default function EngagementTracker() {
    const [timeRange, setTimeRange] = useState('30d');
    const [engagementScore, setEngagementScore] = useState(null);

    useEffect(() => {
        fetchEngagementData();
    }, [timeRange]);

    const fetchEngagementData = async () => {
        try {
            const days = parseInt(timeRange);
            const response = await engagementAPI.getEngagementScore(1, days);
            setEngagementScore(response.data);
        } catch (error) {
            console.error('Failed to load engagement data:', error);
        }
    };

    const metrics = [
        { 
            label: 'Engagement Score', 
            value: '87', 
            change: '+12%', 
            icon: Activity, 
            color: 'from-purple-500 to-indigo-500',
            trend: 'up'
        },
        { 
            label: 'Total Interactions', 
            value: '2.4K', 
            change: '+18%', 
            icon: Heart, 
            color: 'from-pink-500 to-rose-500',
            trend: 'up'
        },
        { 
            label: 'Response Rate', 
            value: '94%', 
            change: '+5%', 
            icon: MessageCircle, 
            color: 'from-blue-500 to-cyan-500',
            trend: 'up'
        },
        { 
            label: 'Reach Growth', 
            value: '+342', 
            change: '+23%', 
            icon: Users, 
            color: 'from-green-500 to-emerald-500',
            trend: 'up'
        },
    ];

    const platformEngagement = [
        { platform: 'Instagram', score: 92, interactions: 1200, color: 'bg-pink-500' },
        { platform: 'Twitter', score: 85, interactions: 890, color: 'bg-blue-500' },
        { platform: 'TikTok', score: 88, interactions: 650, color: 'bg-gray-900' },
    ];

    const engagementTypes = [
        { type: 'Likes', value: 1250, percentage: 45, color: 'bg-pink-500' },
        { type: 'Comments', value: 680, percentage: 25, color: 'bg-blue-500' },
        { type: 'Shares', value: 520, percentage: 19, color: 'bg-green-500' },
        { type: 'Saves', value: 305, percentage: 11, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Engagement Tracker
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Monitor user behavior and interaction patterns
                    </p>
                </div>
                <div className="flex gap-2">
                    {['7d', '30d', '90d'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                timeRange === range
                                    ? 'bg-gradient-pika text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-sm font-semibold ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{metric.change}</span>
                            </div>
                            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{metric.label}</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform Engagement</h2>
                </div>
                <div className="space-y-4">
                    {platformEngagement.map((platform, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                                    <span className="font-semibold text-gray-900 dark:text-white">{platform.platform}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{platform.interactions} interactions</span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{platform.score}/100</span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className={`${platform.color} h-2 rounded-full`} style={{ width: `${platform.score}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
