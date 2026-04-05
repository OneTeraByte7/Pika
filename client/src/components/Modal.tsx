import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-6',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`glass-card w-full ${sizeClasses[size]} max-h-[85vh] overflow-hidden pointer-events-auto border-white/20`}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                  >
                    <X className="w-5 h-5 text-white/40 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(85vh-100px)] custom-scrollbar">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
