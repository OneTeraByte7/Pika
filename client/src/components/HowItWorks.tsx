import { motion } from 'framer-motion';
import { Link2, Mic2, Rocket, Bell, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Sync Up',
    description: 'Link your socials in one tap. Secure, fast, and ready for deployment.',
    icon: Link2,
    color: 'electric-blue',
  },
  {
    number: '02',
    title: 'Just Speak',
    description: 'Open your mouth and let Pika handle the heavy lifting. Pure voice magic.',
    icon: Mic2,
    color: 'vivid-purple',
  },
  {
    number: '03',
    title: 'Deploy',
    description: 'Watch your content hit the feed across all platforms at once.',
    icon: Rocket,
    color: 'hot-pink',
  },
  {
    number: '04',
    title: 'Stay Winning',
    description: 'Get AI alerts for what\'s trending. Never miss a vibe shift.',
    icon: Bell,
    color: 'neon-green',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-pitch-black relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4 mb-6"
            >
              <div className="h-[2px] w-12 bg-vivid-purple" />
              <span className="text-sm font-black uppercase tracking-[0.4em] text-vivid-purple">The Pipeline</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white"
            >
              Zero <br />
              <span className="text-vivid-purple">Friction.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xl text-white/40 font-medium max-w-sm"
          >
            Start your world domination in 4 simple moves.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Animated Connecting Path */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 hidden lg:block overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-electric-blue to-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="glass-card relative z-10 h-full hover:border-white/30 transition-all duration-500 overflow-hidden text-center md:text-left">
                    {/* Background Number */}
                    <span className="absolute -top-10 -right-6 text-9xl font-black text-white/[0.03] select-none group-hover:text-white/[0.05] transition-colors">
                      {step.number}
                    </span>

                    <div className="relative">
                        <div className={`w-16 h-16 rounded-2xl bg-${step.color}/10 border border-${step.color}/20 flex items-center justify-center mb-12 group-hover:scale-110 transition-transform duration-500 mx-auto md:mx-0`}>
                        <Icon className={`w-8 h-8 text-${step.color}`} />
                      </div>

                      <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
                        {step.title}
                      </h3>
                      <p className="text-lg text-white/40 font-medium leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${step.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <Link href="/app">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex flex-col items-center mx-auto"
            >
              <div className="px-16 py-8 bg-white text-black text-2xl font-black uppercase tracking-[0.2em] rounded-full group-hover:bg-electric-blue transition-all relative overflow-hidden">
                <span className="relative z-10">Ascend Now</span>
                <div className="absolute inset-0 bg-white group-hover:bg-electric-blue translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </div>
              <div className="mt-8 flex items-center space-x-2 text-white/40 group-hover:text-electric-blue transition-colors">
                <span className="text-xs font-bold uppercase tracking-[0.3em]">Join 10k+ Agents</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
