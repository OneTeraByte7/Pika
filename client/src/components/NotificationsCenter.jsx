import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Bell,
    Heart,
    MessageCircle,
    UserPlus,
    Share2,
    Check,
    Filter,
    Loader,
    Mail
} from 'lucide-react';
import { notificationsAPI } from '../services/advanced';
import toast from 'react-hot-toast';

export default function NotificationsCenter() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [digest, setDigest] = useState(null);

    useEffect(() => {
        fetchNotifications();
        fetchDigest();
    }, [filter]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationsAPI.getNotifications(
                1,
                filter === 'unread',
                50
            );
            setNotifications(response.data.notifications || []);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDigest = async () => {
        try {
            const response = await notificationsAPI.getDigest(1, 24);
            setDigest(response.data);
        } catch (error) {
            console.error('Failed to load digest:', error);
        }
    };

    const handleMarkAsRead = async (notificationIds) => {
        try {
            await notificationsAPI.markAsRead(notificationIds);
            toast.success('Marked as read');
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return Heart;
            case 'comment':
                return MessageCircle;
            case 'follow':
                return UserPlus;
            case 'share':
                return Share2;
            default:
                return Bell;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'like':
                return 'from-pink-500 to-rose-500';
            case 'comment':
                return 'from-blue-500 to-cyan-500';
            case 'follow':
                return 'from-purple-500 to-indigo-500';
            case 'share':
                return 'from-green-500 to-emerald-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const mockNotifications = [
        {
            id: '1',
            type: 'like',
            platform: 'Instagram',
            content: 'Sarah liked your post "Beautiful sunset today 🌅"',
            actor: '@sarah_designs',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            read: false,
            priority: 'medium'
        },
        {
            id: '2',
            type: 'comment',
            platform: 'Twitter',
            content: 'New comment on your tweet',
            actor: '@john_dev',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            read: false,
            priority: 'high'
        },
        {
            id: '3',
            type: 'follow',
            platform: 'Instagram',
            content: 'started following you',
            actor: '@creative_studio',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            read: true,
            priority: 'medium'
        },
        {
            id: '4',
            type: 'share',
            platform: 'Twitter',
            content: 'retweeted your post',
            actor: '@tech_news',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: true,
            priority: 'medium'
        }
    ];

    const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;
    const filteredNotifications = filter === 'unread' 
        ? displayNotifications.filter(n => !n.read)
        : displayNotifications;

    const getTimeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const unreadCount = displayNotifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Notifications
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filter === 'all'
                                ? 'bg-gradient-pika text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            filter === 'unread'
                                ? 'bg-gradient-pika text-white shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        Unread
                    </button>
                </div>
            </div>

            {/* Digest Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold">Daily Digest</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-3xl font-bold">{digest?.total_count || 47}</p>
                        <p className="text-purple-100 text-sm">Total interactions</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">{digest?.high_priority || 12}</p>
                        <p className="text-purple-100 text-sm">High priority</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">{digest?.platforms || 3}</p>
                        <p className="text-purple-100 text-sm">Platforms</p>
                    </div>
                </div>
            </motion.div>

            {/* Notifications List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                        <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400">
                            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        <AnimatePresence>
                            {filteredNotifications.map((notification, index) => {
                                const Icon = getNotificationIcon(notification.type);
                                const colorClass = getNotificationColor(notification.type);
                                
                                return (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                            !notification.read ? 'bg-purple-50 dark:bg-purple-900/10' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-1">
                                                    <div className="flex-1">
                                                        <p className="text-gray-900 dark:text-white font-medium">
                                                            <span className="text-purple-600 dark:text-purple-400 font-semibold">
                                                                {notification.actor}
                                                            </span>{' '}
                                                            {notification.content}
                                                        </p>
                                                    </div>
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => handleMarkAsRead([notification.id])}
                                                            className="p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded transition-colors flex-shrink-0"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>{notification.platform}</span>
                                                    <span>•</span>
                                                    <span>{getTimeAgo(notification.timestamp)}</span>
                                                    {notification.priority === 'high' && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                                                                High Priority
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>

            {/* Mark All as Read */}
            {unreadCount > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <button
                        onClick={() => {
                            const unreadIds = displayNotifications
                                .filter(n => !n.read)
                                .map(n => n.id);
                            handleMarkAsRead(unreadIds);
                        }}
                        className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
                    >
                        Mark All as Read
                    </button>
                </motion.div>
            )}
        </div>
    );
}
