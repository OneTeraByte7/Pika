import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar,
    Clock,
    Plus,
    Edit,
    Trash2,
    Instagram,
    Twitter,
    CheckCircle,
    XCircle,
    Loader
} from 'lucide-react';
import { schedulerAPI } from '../services/advanced';
import toast from 'react-hot-toast';

export default function ContentScheduler() {
    const [upcomingPosts, setUpcomingPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        content: '',
        platforms: [],
        scheduled_time: '',
        media_url: ''
    });

    useEffect(() => {
        fetchUpcomingPosts();
    }, []);

    const fetchUpcomingPosts = async () => {
        setLoading(true);
        try {
            const response = await schedulerAPI.getUpcomingPosts(1, 7);
            setUpcomingPosts(response.data.upcoming_posts || []);
        } catch (error) {
            toast.error('Failed to load scheduled posts');
        } finally {
            setLoading(false);
        }
    };

    const handleSchedulePost = async (e) => {
        e.preventDefault();
        if (!formData.content || !formData.scheduled_time || formData.platforms.length === 0) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            await schedulerAPI.schedulePost({
                user_id: 1,
                platforms: formData.platforms,
                content: formData.content,
                scheduled_time: formData.scheduled_time,
                media_url: formData.media_url || null
            });
            toast.success('Post scheduled successfully!');
            setShowModal(false);
            setFormData({ content: '', platforms: [], scheduled_time: '', media_url: '' });
            fetchUpcomingPosts();
        } catch (error) {
            toast.error('Failed to schedule post');
        }
    };

    const handleCancelPost = async (postId) => {
        try {
            await schedulerAPI.cancelPost(postId);
            toast.success('Post cancelled');
            fetchUpcomingPosts();
        } catch (error) {
            toast.error('Failed to cancel post');
        }
    };

    const togglePlatform = (platform) => {
        setFormData(prev => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter(p => p !== platform)
                : [...prev.platforms, platform]
        }));
    };

    const platforms = [
        { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'blue' },
        { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'pink' },
    ];

    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Content Scheduler
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Schedule posts across all your platforms
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-pika text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Schedule Post
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {upcomingPosts.length}
                        </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Scheduled Posts</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">24</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Published This Week</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">3</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Posts Today</p>
                </motion.div>
            </div>

            {/* Upcoming Posts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Upcoming Posts
                </h2>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                ) : upcomingPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 dark:text-gray-400">No scheduled posts yet</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-4 px-6 py-2 bg-gradient-pika text-white rounded-full font-semibold"
                        >
                            Schedule Your First Post
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcomingPosts.map((post) => (
                            <div
                                key={post.id}
                                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-gray-900 dark:text-white font-medium mb-2">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(post.scheduled_time).toLocaleString()}
                                            </span>
                                            <div className="flex gap-2">
                                                {post.platforms?.map((platform) => {
                                                    const PlatformIcon = platforms.find(p => p.id === platform)?.icon;
                                                    return PlatformIcon ? (
                                                        <PlatformIcon key={platform} className="w-4 h-4" />
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCancelPost(post.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Schedule Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Schedule New Post
                            </h2>

                            <form onSubmit={handleSchedulePost} className="space-y-6">
                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Post Content *
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                                        placeholder="What's on your mind?"
                                        required
                                    />
                                </div>

                                {/* Platforms */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Select Platforms *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {platforms.map((platform) => {
                                            const Icon = platform.icon;
                                            return (
                                                <button
                                                    key={platform.id}
                                                    type="button"
                                                    onClick={() => togglePlatform(platform.id)}
                                                    className={`p-4 rounded-xl border-2 transition-all ${
                                                        formData.platforms.includes(platform.id)
                                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                                    }`}
                                                >
                                                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                                                        formData.platforms.includes(platform.id)
                                                            ? 'text-purple-600'
                                                            : 'text-gray-600 dark:text-gray-400'
                                                    }`} />
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {platform.name}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Schedule Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Schedule Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.scheduled_time}
                                        onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                                        min={getMinDateTime()}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>

                                {/* Media URL (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Media URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.media_url}
                                        onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-pika text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Schedule Post
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
