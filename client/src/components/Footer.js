import { motion } from 'framer-motion';
import { Twitter, Instagram, Github, Mail, Zap, ArrowUp } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Vault: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Pipeline', href: '#how-it-works' },
    ],
    intel: [
      { label: 'Status', href: '#' },
      { label: 'Docs', href: '#' },
      { label: 'API', href: '#' },
    ],
    Legal: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', color: 'electric-blue' },
    { icon: Instagram, href: '#', color: 'hot-pink' },
    { icon: Github, href: '#', color: 'white' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-pitch-black border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      {/* Glow Backdrop */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-electric-blue/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-24">
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-3">
            <div className="flex items-center space-x-4 mb-8 group cursor-default">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-electric-blue group-hover:shadow-neon-blue transition-all duration-500">
                <Zap className="w-7 h-7 text-electric-blue fill-current" />
              </div>
              <span className="text-4xl font-black uppercase tracking-tighter text-white">Pika.</span>
            </div>

            <p className="text-xl text-white/30 font-medium max-w-sm mb-12 italic leading-relaxed">
              Ascending the flow of social media through voice-native intelligence.
            </p>

            <div className="flex space-x-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:border-${social.color}/50 hover:bg-${social.color}/5 transition-all duration-500`}
                  >
                    <Icon className={`w-6 h-6 text-white group-hover:text-${social.color}`} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 col-span-1 lg:col-span-3">
            {Object.entries(footerLinks).map(([category, links], index) => (
              <div key={index}>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-8">{category}</h3>
                <ul className="space-y-6">
                  {links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className="text-lg font-bold text-white/40 hover:text-white transition-colors flex items-center group"
                      >
                        <span className="w-0 group-hover:w-4 h-[2px] bg-electric-blue mr-0 group-hover:mr-3 transition-all duration-300" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="glass-card mb-24 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center lg:text-left">
              <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Join the Collective</h3>
              <p className="text-white/40 font-medium">Get the latest patches and drops before anyone else.</p>
            </div>

            <div className="flex w-full lg:w-auto gap-4">
              <input
                type="email"
                placeholder="VIBE@CHECK.COM"
                className="flex-1 lg:w-80 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-electric-blue text-white font-bold uppercase tracking-widest placeholder:text-white/10"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-electric-blue transition-all"
              >
                In
              </motion.button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/5 to-vivid-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
          <p className="text-xs font-bold uppercase tracking-widest text-white/20">
            © 2024 PIKA AI / CORE PROTOCOL
          </p>

          <div className="flex items-center space-x-8">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-3 group"
            >
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-colors">Surface</span>
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:border-electric-blue transition-all">
                <ArrowUp className="w-4 h-4 text-white group-hover:text-electric-blue" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
