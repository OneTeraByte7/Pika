import { motion } from 'framer-motion';
import { Twitter, ArrowRight, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function TwitterBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="hidden sm:block"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <p className="text-sm md:text-base font-medium">
              <span className="font-bold">NEW:</span> Twitter Integration is Live! Connect your account and manage Twitter from Pika.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/social-dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
              >
                <Twitter className="w-4 h-4" />
                <span className="hidden sm:inline">Try It Now</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
