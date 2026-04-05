import { motion } from 'framer-motion';
import { Check, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Dip your toes in the void.',
    features: [
      '1 Platform Connect',
      'Daily Briefings',
      'Basic Voice Commands',
      'Standard Support',
    ],
    cta: 'Start Now',
    popular: false,
    color: 'white',
  },
  {
    name: 'Main',
    price: '$12',
    period: 'monthly',
    description: 'Full power. No limits.',
    features: [
      'All Sync Platforms',
      'Unlimited Voice AI',
      'Hype Analytics',
      'Priority DMs',
      'Custom Commands',
    ],
    cta: 'Ascend Free',
    popular: true,
    color: 'electric-blue',
  },
  {
    name: 'Squad',
    price: '$39',
    period: 'monthly',
    description: 'For the elite agencies.',
    features: [
      'Everything in Main',
      '10 Team Seats',
      'White Label API',
      '24/7 Ghost Support',
    ],
    cta: 'Get Elite',
    popular: false,
    color: 'vivid-purple',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-pitch-black relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-4 py-1 bg-white/5 border border-white/10 rounded-full mb-6"
          >
            <Star className="w-3 h-3 text-electric-blue fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Tiers of Power</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-8"
          >
            Pick Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-vivid-purple">Energy.</span>
          </motion.h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative glass-card p-12 border-2 ${plan.popular ? 'border-electric-blue shadow-neon-blue' : 'border-white/10'
                } hover:border-white/30 transition-all duration-500`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-12 -translate-y-1/2 px-6 py-2 bg-electric-blue text-black text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="mb-12">
                <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-white/50 mb-8">{plan.name}</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-7xl font-black tracking-tighter text-white">{plan.price}</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-white/30">{plan.period}</span>
                </div>
                <p className="mt-4 text-white/60 font-medium">{plan.description}</p>
              </div>

              <ul className="space-y-6 mb-12 border-t border-white/5 pt-12">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${plan.popular ? 'bg-electric-blue shadow-[0_0_8px_#00f2ff]' : 'bg-white/20'}`} />
                    <span className="text-lg text-white/80 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/app">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-6 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${plan.popular
                      ? 'bg-electric-blue text-black shadow-neon-blue'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }`}
                >
                  {plan.cta}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Custom Inquiry */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <p className="text-white/40 font-medium italic">
            Need more juice? <a href="#" className="text-white hover:text-electric-blue transition-colors underline underline-offset-8 decoration-white/20 group">
              Talk to the Architects <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
