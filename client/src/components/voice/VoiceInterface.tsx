import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2, Volume2, Sparkles } from 'lucide-react';
import { usePikaStore } from '../../store';
import { pikaAPI } from '../../services/api';
import voiceService from '../../services/voice';
import toast from 'react-hot-toast';

type Status = 'idle' | 'listening' | 'processing' | 'speaking';

const EXAMPLE_COMMANDS = [
    'Post "Good morning!" to Twitter',
    'Show me my analytics for today',
    'Schedule a post for 9 AM tomorrow',
    'What are my most liked posts?',
    'Reply to my latest Instagram comment',
    'Check my engagement rate this week',
];

export default function VoiceInterface() {
    const [status, setStatus] = useState<Status>('idle');
    const { isListening, currentQuery, setListening, setCurrentQuery, setResponse } = usePikaStore();
    const sessionId = useRef<string>(
        typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `session-${Date.now()}`
    );

    const handleMicClick = useCallback(() => {
        if (status === 'listening') {
            voiceService.stopListening();
            setListening(false);
            setStatus('idle');
            return;
        }

        setStatus('listening');
        setListening(true);
        setCurrentQuery('');

        voiceService.startListening(
            async (transcript: string) => {
                setCurrentQuery(transcript);
                setListening(false);
                setStatus('processing');

                try {
                    const res = await pikaAPI.query({ text: transcript, session_id: sessionId.current });
                    const reply =
                        res.data?.response ||
                        res.data?.message ||
                        res.data?.result ||
                        'Done.';

                    setResponse(reply);
                    setStatus('speaking');
                    voiceService.speak(reply);

                    setTimeout(() => setStatus('idle'), 3000);
                } catch (err) {
                    toast.error('Pika could not process your request.');
                    setStatus('idle');
                    setResponse(null);
                }
            },
            (error: string) => {
                setListening(false);
                setStatus('idle');
                if (error !== 'no-speech') {
                    toast.error(`Mic error: ${error}`);
                }
            }
        );
    }, [status, setListening, setCurrentQuery, setResponse]);

    const statusConfig = {
        idle:       { label: 'Tap to speak',       color: '#ffffff40' },
        listening:  { label: 'Listening...',        color: '#00f2ff' },
        processing: { label: 'Processing...',       color: '#bd00ff' },
        speaking:   { label: 'Pika is responding',  color: '#00ff88' },
    };

    const { label, color } = statusConfig[status];

    return (
        <div className="flex flex-col items-center gap-10 py-12">

            {/* Orb + rings */}
            <div className="relative flex items-center justify-center">

                {/* Animated pulse rings when listening */}
                {status === 'listening' && (
                    <>
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full border border-electric-blue/30"
                                initial={{ width: 120, height: 120, opacity: 0.6 }}
                                animate={{ width: 120 + i * 60, height: 120 + i * 60, opacity: 0 }}
                                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
                            />
                        ))}
                    </>
                )}

                {/* Speaking rings */}
                {status === 'speaking' && (
                    <>
                        {[1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute rounded-full border border-neon-green/30"
                                initial={{ width: 120, height: 120, opacity: 0.5 }}
                                animate={{ width: 120 + i * 50, height: 120 + i * 50, opacity: 0 }}
                                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
                            />
                        ))}
                    </>
                )}

                {/* Main orb button */}
                <motion.button
                    onClick={handleMicClick}
                    disabled={status === 'processing'}
                    whileHover={status !== 'processing' ? { scale: 1.08 } : {}}
                    whileTap={status !== 'processing' ? { scale: 0.94 } : {}}
                    className="relative w-28 h-28 rounded-full flex items-center justify-center focus:outline-none z-10"
                    style={{
                        background:
                            status === 'listening'
                                ? 'radial-gradient(circle, rgba(0,242,255,0.2) 0%, rgba(0,242,255,0.05) 100%)'
                                : status === 'speaking'
                                ? 'radial-gradient(circle, rgba(0,255,136,0.2) 0%, rgba(0,255,136,0.05) 100%)'
                                : status === 'processing'
                                ? 'radial-gradient(circle, rgba(189,0,255,0.2) 0%, rgba(189,0,255,0.05) 100%)'
                                : 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                        border: `1.5px solid ${color}`,
                        boxShadow:
                            status !== 'idle'
                                ? `0 0 30px ${color}40, 0 0 60px ${color}20`
                                : '0 0 0px transparent',
                    }}
                >
                    <AnimatePresence mode="wait">
                        {status === 'processing' ? (
                            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Loader2 className="w-10 h-10 animate-spin" style={{ color }} />
                            </motion.div>
                        ) : status === 'speaking' ? (
                            <motion.div key="speaker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Volume2 className="w-10 h-10" style={{ color }} />
                            </motion.div>
                        ) : status === 'listening' ? (
                            <motion.div
                                key="mic-on"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: [1, 1.15, 1] }}
                                exit={{ opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                            >
                                <Mic className="w-10 h-10" style={{ color }} />
                            </motion.div>
                        ) : (
                            <motion.div key="mic-idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Mic className="w-10 h-10 text-white/50" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Status label */}
            <motion.p
                key={status}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-black uppercase tracking-[0.3em]"
                style={{ color }}
            >
                {label}
            </motion.p>

            {/* Live transcript */}
            <AnimatePresence>
                {currentQuery && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-xl text-center px-6 py-4 bg-white/5 border border-white/10 rounded-2xl"
                    >
                        <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-2">You said</p>
                        <p className="text-white font-medium leading-relaxed">&ldquo;{currentQuery}&rdquo;</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Example commands (only when idle and no query) */}
            <AnimatePresence>
                {status === 'idle' && !currentQuery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-xl"
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-center mb-4 flex items-center justify-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            Try saying
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {EXAMPLE_COMMANDS.map((cmd, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => {
                                        setCurrentQuery(cmd);
                                        setStatus('processing');
                                        pikaAPI.query({ text: cmd, session_id: sessionId.current })
                                            .then((res) => {
                                                const reply =
                                                    res.data?.response ||
                                                    res.data?.message ||
                                                    res.data?.result ||
                                                    'Done.';
                                                setResponse(reply);
                                                setStatus('speaking');
                                                voiceService.speak(reply);
                                                setTimeout(() => setStatus('idle'), 3000);
                                            })
                                            .catch(() => {
                                                toast.error('Pika could not process your request.');
                                                setStatus('idle');
                                            });
                                    }}
                                    className="px-4 py-3 bg-white/3 border border-white/8 rounded-xl text-left text-xs text-white/40 hover:text-white hover:bg-white/8 hover:border-white/15 transition-all"
                                >
                                    &ldquo;{cmd}&rdquo;
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
