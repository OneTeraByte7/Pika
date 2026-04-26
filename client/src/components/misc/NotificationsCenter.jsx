import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageCircle, UserPlus, Twitter, Instagram, Check, CheckCheck, Loader2 } from 'lucide-react';
import { notificationsAPI } from '../../services/advanced';

const TYPE_CONFIG = {
    like:    { icon: Heart,         color: '#ff00e5', label: 'Like' },
    comment: { icon: MessageCircle, color: '#bd00ff', label: 'Comment' },
    follow:  { icon: UserPlus,      color: '#00ff88', label: 'Follow' },
    mention: { icon: Bell,          color: '#00f2ff', label: 'Mention' },
};

const PLATFORM_COLOR = { twitter: '#00f2ff', instagram: '#ff00e5' };

const MOCK_NOTIFICATIONS = [
    { id: '1', type: 'like', content: '@devuser liked your post "Just shipped v2.0 🚀"', platform: 'twitter', created_at: new Date(Date.now() - 120000).toISOString(), is_read: false },
    { id: '2', type: 'comment', content: '@sarah_codes commented: "This is exactly what I needed!"', platform: 'instagram', created_at: new Date(Date.now() - 600000).toISOString(), is_read: false },
    { id: '3', type: 'follow', content: '5 new followers today', platform: 'twitter', created_at: new Date(Date.now() - 3600000).toISOString(), is_read: false },
    { id: '4', type: 'mention', content: '@techblog mentioned you in a thread about AI tools', platform: 'twitter', created_at: new Date(Date.now() - 7200000).toISOString(), is_read: true },
    { id: '5', type: 'like', content: '42 likes on your latest carousel post', platform: 'instagram', created_at: new Date(Date.now() - 10800000).toISOString(), is_read: true },
    { id: '6', type: 'comment', content: '@john_doe replied to your comment', platform: 'twitter', created_at: new Date(Date.now() - 86400000).toISOString(), is_read: true },
];

function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
}

export default function NotificationsCenter() {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await notificationsAPI.getNotifications(1, false, 50);
                if (res.data?.notifications?.length) setNotifications(res.data.notifications);
            } catch {
                // keep mock
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const markAllRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (!unreadIds.length) return;
        try { await notificationsAPI.markAsRead(unreadIds); } catch {}
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const markRead = async (id) => {
        try { await notificationsAPI.markAsRead([id]); } catch {}
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.is_read) : notifications.filter(n => n.type === filter);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Notifications</h1>
                    <p className="text-white/40 mt-2 font-medium">
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: `Unread${unreadCount ? ` (${unreadCount})` : ''}` },
                    { id: 'like', label: 'Likes' },
                    { id: 'comment', label: 'Comments' },
                    { id: 'follow', label: 'Follows' },
                    { id: 'mention', label: 'Mentions' },
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        style={{
                            background: filter === f.id ? 'rgba(0,242,255,0.12)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${filter === f.id ? '#00f2ff40' : 'rgba(255,255,255,0.08)'}`,
                            color: filter === f.id ? '#00f2ff' : 'rgba(255,255,255,0.3)',
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <motion.div className="space-y-2">
                {loading && (
                    <div className="flex items-center gap-3 justify-center py-8 text-white/20">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Loading...</span>
                    </div>
                )}

                <AnimatePresence>
                    {filtered.length === 0 && !loading ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                            <Bell className="w-10 h-10 text-white/10 mx-auto mb-3" />
                            <p className="text-white/20 text-sm">Nothing here</p>
                        </motion.div>
                    ) : (
                        filtered.map((notif, i) => {
                            const typeConf = TYPE_CONFIG[notif.type] || TYPE_CONFIG.mention;
                            const Icon = typeConf.icon;
                            const PlatformIcon = notif.platform === 'twitter' ? Twitter : Instagram;
                            return (
                                <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => !notif.is_read && markRead(notif.id)}
                                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
                                        notif.is_read
                                            ? 'bg-white/2 border-white/5 hover:bg-white/5'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    {/* Type icon */}
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${typeConf.color}15`, border: `1px solid ${typeConf.color}25` }}>
                                        <Icon className="w-4 h-4" style={{ color: typeConf.color }} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm leading-relaxed ${notif.is_read ? 'text-white/40' : 'text-white/80'}`}>
                                            {notif.content}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <PlatformIcon className="w-3 h-3" style={{ color: PLATFORM_COLOR[notif.platform] }} />
                                            <span className="text-[10px] font-bold text-white/20">{timeAgo(notif.created_at)}</span>
                                        </div>
                                    </div>

                                    {!notif.is_read && (
                                        <div className="w-2 h-2 rounded-full bg-electric-blue flex-shrink-0 mt-2 shadow-neon-blue" />
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
