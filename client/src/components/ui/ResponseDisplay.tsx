import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { usePikaStore } from '../../store';

export default function ResponseDisplay() {
    const { response, currentQuery, resetCOnversation } = usePikaStore();

    if (!response) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-xl mx-auto"
            >
                <div className="glass-card relative overflow-hidden">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-blue/50 to-transparent" />

                    <div className="flex items-start gap-4">
                        {/* Pika icon */}
                        <div className="w-10 h-10 rounded-xl bg-electric-blue/10 border border-electric-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Sparkles className="w-5 h-5 text-electric-blue fill-current" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-electric-blue mb-3">
                                Pika
                            </p>
                            <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">
                                {response}
                            </p>
                        </div>
                    </div>

                    {/* Reset button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={resetCOnversation}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors"
                        >
                            <RefreshCw className="w-3 h-3" />
                            New query
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
