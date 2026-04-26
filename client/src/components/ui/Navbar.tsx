import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/60 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-0.5"
                    >
                        <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white fill-current" />
                        </div>
                    </motion.div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black uppercase tracking-tighter text-white leading-none">Pika</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 leading-none">Neural Hub</span>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-black text-white/50 hover:text-white transition-colors uppercase tracking-widest hidden sm:block"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="px-5 py-2.5 bg-electric-blue text-black text-xs font-black rounded-xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-neon-blue"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
