import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Connect Your Accounts',
    description: 'Link your Instagram, Twitter, and TikTok accounts securely in seconds.',
    color: 'from-purple-500 to-pink-500',
    emoji: '🔗',
  },
  {
    number: '02',
    title: 'Start Talking to Pika',
    description: 'Use natural voice commands to manage your social media. No typing required.',
    color: 'from-pink-500 to-rose-500',
    emoji: '🎤',
  },
  {
    number: '03',
    title: 'Get Things Done',
    description: 'Post content, check DMs, view analytics - all through conversation.',
    color: 'from-blue-500 to-cyan-500',
    emoji: '✨',
  },
  {
    number: '04',
    title: 'Stay Updated',
    description: 'Receive daily briefings and never miss important notifications.',
    color: 'from-orange-500 to-yellow-500',
    emoji: '📱',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Pika works
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get started in minutes. No learning curve, just natural conversation.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 dark:from-purple-800 dark:via-pink-800 dark:to-blue-800 transform -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Card */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700">
                  {/* Number Badge */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0`}>
                    <span className="text-2xl font-bold text-white">
                      {step.number}
                    </span>
                  </div>

                  {/* Emoji */}
                  <div className="text-5xl mb-4 text-center lg:text-left">
                    {step.emoji}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center lg:text-left">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-center lg:text-left">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg
                      className="w-8 h-8 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link href="/app">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              Try Pika Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
