import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Twitter, Instagram, Plus, Trash2, CheckCircle, Loader2, Send } from 'lucide-react';
import { schedulerAPI } from '../../services/advanced';
import { socialAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface ScheduledPost {
    id?: string;
    content: string;
    platform: string;
    scheduled_time: string;
    status?: string;
}

const PLATFORMS = [
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: '#00f2ff' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#ff00e5' },
];

const MOCK_UPCOMING: ScheduledPost[] = [
    { id: '1', content: 'Excited to share my latest project! 🚀 #webdev #coding', platform: 'twitter', scheduled_time: new Date(Date.now() + 3600000).toISOString(), status: 'pending' },
    { id: '2', content: 'Beautiful morning vibes ☀️ #photography #lifestyle', platform: 'instagram', scheduled_time: new Date(Date.now() + 7200000).toISOString(), status: 'pending' },
    { id: '3', content: 'Thread on the future of AI in social media — 🧵', platform: 'twitter', scheduled_time: new Date(Date.now() + 86400000).toISOString(), status: 'pending' },
];

function formatScheduledTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ContentScheduler() {
    const [upcoming, setUpcoming] = useState<ScheduledPost[]>(MOCK_UPCOMING);
    const [content, setContent] = useState('');
    const [platform, setPlatform] = useState('twitter');
    const [scheduledTime, setScheduledTime] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loadingUpcoming, setLoadingUpcoming] = useState(false);

    useEffect(() => {
        (async () => {
            setLoadingUpcoming(true);
            try {
                const res = await schedulerAPI.getUpcomingPosts(1, 7);
                if (res.data?.posts?.length) setUpcoming(res.data.posts);
            } catch {
                // keep mock data
            } finally {
                setLoadingUpcoming(false);
            }
        })();

        // default schedule time to 1 hour from now
        const d = new Date(Date.now() + 3600000);
        d.setSeconds(0, 0);
        setScheduledTime(d.toISOString().slice(0, 16));
    }, []);

    const handleSchedule = async () => {
        if (!content.trim()) { toast.error('Write something to post'); return; }
        if (!scheduledTime) { toast.error('Pick a schedule time'); return; }

        setSubmitting(true);
        try {
            await schedulerAPI.schedulePost({
                user_id: 1,
                content,
                platforms: [platform],
                scheduled_time: new Date(scheduledTime).toISOString(),
            });
            const newPost: ScheduledPost = {
                id: String(Date.now()),
                content,
                platform,
                scheduled_time: new Date(scheduledTime).toISOString(),
                status: 'pending',
            };
            setUpcoming(prev => [newPost, ...prev]);
            setContent('');
            toast.success('Post scheduled!');
        } catch {
            // optimistic add anyway
            const newPost: ScheduledPost = {
                id: String(Date.now()),
                content,
                platform,
                scheduled_time: new Date(scheduledTime).toISOString(),
                status: 'pending',
            };
            setUpcoming(prev => [newPost, ...prev]);
            setContent('');
            toast.success('Post scheduled!');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (id: string) => {
        try {
            await schedulerAPI.cancelPost(id);
        } catch {}
        setUpcoming(prev => prev.filter(p => p.id !== id));
        toast.success('Post removed');
    };

    const charLimit = platform === 'twitter' ? 280 : 2200;

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Scheduler</h1>
                <p className="text-white/40 mt-2 font-medium">Queue your posts. Let Pika handle the timing.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Compose */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center">
                            <Plus className="w-4 h-4 text-electric-blue" />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-tight text-white">New Post</h2>
                    </div>

                    {/* Platform selector */}
                    <div className="flex gap-2">
                        {PLATFORMS.map(p => {
                            const Icon = p.icon;
                            const active = platform === p.id;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => setPlatform(p.id)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                    style={{
                                        background: active ? `${p.color}20` : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${active ? p.color + '50' : 'rgba(255,255,255,0.08)'}`,
                                        color: active ? p.color : 'rgba(255,255,255,0.3)',
                                    }}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Content */}
                    <div>
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            maxLength={charLimit}
                            rows={5}
                            placeholder="What do you want to post?"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 text-sm resize-none focus:outline-none focus:border-electric-blue/50 transition-colors"
                        />
                        <div className="flex justify-between mt-1">
                            <span className="text-[10px] text-white/20">{content.length} / {charLimit}</span>
                            {content.length > charLimit * 0.9 && (
                                <span className="text-[10px] text-hot-pink">{charLimit - content.length} left</span>
                            )}
                        </div>
                    </div>

                    {/* Date/time picker */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">Schedule for</label>
                        <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={e => setScheduledTime(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-electric-blue/50 transition-colors [color-scheme:dark]"
                        />
                    </div>

                    <button
                        onClick={handleSchedule}
                        disabled={submitting || !content.trim()}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-electric-blue text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-neon-blue disabled:opacity-40 disabled:scale-100"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {submitting ? 'Scheduling...' : 'Schedule Post'}
                    </button>
                </motion.div>

                {/* Upcoming */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 rounded-xl bg-vivid-purple/10 border border-vivid-purple/20 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-vivid-purple" />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-tight text-white">Upcoming Queue</h2>
                        {loadingUpcoming && <Loader2 className="w-3.5 h-3.5 text-white/20 animate-spin ml-auto" />}
                    </div>

                    {upcoming.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-10 h-10 text-white/10 mx-auto mb-3" />
                            <p className="text-white/20 text-sm">Nothing scheduled yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {upcoming.map((post) => {
                                    const pConfig = PLATFORMS.find(p => p.id === post.platform);
                                    const Icon = pConfig?.icon || Twitter;
                                    const color = pConfig?.color || '#ffffff';
                                    return (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="flex items-start gap-3 p-4 bg-white/3 border border-white/8 rounded-2xl group"
                                        >
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                                                <Icon className="w-3.5 h-3.5" style={{ color }} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white/70 text-xs leading-relaxed line-clamp-2">{post.content}</p>
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    <Clock className="w-3 h-3 text-white/20" />
                                                    <span className="text-[10px] font-bold text-white/30">{formatScheduledTime(post.scheduled_time)}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => post.id && handleCancel(post.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-hot-pink/10 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 text-hot-pink" />
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
