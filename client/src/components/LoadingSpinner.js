import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', color = 'purple' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    purple: 'border-purple-600',
    pink: 'border-pink-600',
    blue: 'border-blue-600',
    white: 'border-white',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full`}
    />
  );
}
