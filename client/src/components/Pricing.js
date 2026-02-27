import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out Pika',
    features: [
      '1 social account per platform',
      '50 voice queries/month',
      'Basic analytics',
      'Morning briefings',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
    gradient: 'from-gray-400 to-gray-600',
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For power users and creators',
    features: [
      'Unlimited accounts',
      'Unlimited voice queries',
      'Advanced analytics',
      'Priority DM management',
      'Custom voice commands',
      'API access',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    name: 'Team',
    price: '$39',
    period: 'per month',
    description: 'For agencies and teams',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Team collaboration',
      'Shared analytics',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 support',
    ],
    cta: 'Contact Sales',
    popular: false,
    gradient: 'from-blue-600 to-cyan-600',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
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
            Simple,{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              transparent pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that's right for you. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 ${
                plan.popular ? 'ring-4 ring-purple-600 ring-opacity-50' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className={`text-5xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mt-0.5`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href="/app">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} text-white`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Need a custom plan?{' '}
            <a href="#contact" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              Contact our sales team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
