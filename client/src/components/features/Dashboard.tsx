import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Instagram, Activity, Users, MessageCircle, Zap, RefreshCw, Circle } from 'lucide-react';
import { socialAPI } from '../../services/api';

interface Account {
    platform: string;
    username: string;
    is_active: boolean;
    connected_at: string;
}

interface ActivityItem {
    type: string;
    content: string;
    platform: string;
    timestamp: string;
    engagement?: number;
}

const PLATFORM_ICON: Record<string, JSX.Element> = {
    twitter: <Twitter className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
};

const PLATFORM_COLOR: Record<string, string> = {
    twitter: '#00f2ff',
    instagram: '#ff00e5',
};

const MOCK_ACTIVITY: ActivityItem[] = [
    { type: 'like', content: 'Someone liked your post "Just launched my new project 🚀"', platform: 'twitter', timestamp: '2m ago', engagement: 12 },
    { type: 'comment', content: 'New comment: "This is amazing, keep it up!"', platform: 'instagram', timestamp: '15m ago', engagement: 3 },
    { type: 'follow', content: '3 new followers this hour', platform: 'twitter', timestamp: '34m ago' },
    { type: 'like', content: '28 likes on your latest reel', platform: 'instagram', timestamp: '1h ago', engagement: 28 },
    { type: 'comment', content: 'Replied to your thread about #webdev', platform: 'twitter', timestamp: '2h ago', engagement: 5 },
];

export default function Dashboard() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [activity, setActivity] = useState<ActivityItem[]>(MOCK_ACTIVITY);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await socialAPI.getAccounts();
                setAccounts(res.data?.accounts || []);
            } catch {
                setAccounts([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const stats = [
        { label: 'Connected', value: loading ? '—' : String(accounts.length), icon: Circle, color: '#00f2ff' },
        { label: 'Activity (24h)', value: '47', icon: Activity, color: '#bd00ff' },
        { label: 'New Followers', value: '+12', icon: Users, color: '#00ff88' },
        { label: 'Unread DMs', value: '5', icon: MessageCircle, color: '#ff00e5' },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Command Center</h1>
                <p className="text-white/40 mt-2 font-medium">Your social universe at a glance.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="glass-card !p-6"
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                                <Icon className="w-5 h-5" style={{ color: s.color }} />
                            </div>
                            <p className="text-3xl font-black text-white">{s.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">{s.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Connected Accounts */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-electric-blue fill-current" />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-tight text-white">Connected Accounts</h2>
                    </div>

                    {loading ? (
                        <div className="flex items-center gap-3 text-white/30">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Loading accounts...</span>
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-white/20 text-sm font-medium">No accounts connected yet.</p>
                            <p className="text-white/10 text-xs mt-1">Go to Social Dashboard to connect.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {accounts.map((acc, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/8 rounded-2xl">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: `${PLATFORM_COLOR[acc.platform] || '#ffffff'}15`, border: `1px solid ${PLATFORM_COLOR[acc.platform] || '#ffffff'}30` }}>
                                        <span style={{ color: PLATFORM_COLOR[acc.platform] || '#fff' }}>
                                            {PLATFORM_ICON[acc.platform] || <Circle className="w-4 h-4" />}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white text-sm capitalize">{acc.platform}</p>
                                        <p className="text-xs text-white/30 truncate">@{acc.username}</p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${acc.is_active ? 'bg-neon-green' : 'bg-white/20'}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Activity Feed */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-vivid-purple/10 border border-vivid-purple/20 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-vivid-purple" />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-tight text-white">Live Activity</h2>
                    </div>

                    <div className="space-y-3">
                        {activity.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.06 }}
                                className="flex items-start gap-3 p-3 bg-white/3 border border-white/5 rounded-xl"
                            >
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ background: `${PLATFORM_COLOR[item.platform] || '#fff'}10` }}>
                                    <span style={{ color: PLATFORM_COLOR[item.platform] || '#fff' }}>
                                        {PLATFORM_ICON[item.platform] || <Circle className="w-3 h-3" />}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/70 text-xs leading-relaxed">{item.content}</p>
                                </div>
                                <span className="text-[10px] font-bold text-white/20 flex-shrink-0">{item.timestamp}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
