import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, Rocket, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '../store';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Visual Creator', href: '/visual-creator' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
          ? 'py-4 bg-pitch-black/60 backdrop-blur-2xl border-b border-white/10'
          : 'py-6 bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group relative">
            <motion.div
              className="w-12 h-12 bg-white/5 border border-white/20 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:border-electric-blue/50 group-hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all duration-500"
              whileHover={{ rotate: 12, scale: 1.1 }}
            >
              <Zap className="w-6 h-6 text-electric-blue" fill="currentColor" />
              <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-black uppercase tracking-tighter text-white group-hover:text-electric-blue transition-colors leading-none">
                Pika
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">
                AI Social
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="relative text-sm font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors group"
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-electric-blue transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            {/* (Dashboard link removed - moved into app More menu) */}

            <Link href="/app">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-black text-sm font-black uppercase tracking-widest rounded-full hover:bg-electric-blue transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-white group-hover:bg-electric-blue transition-colors" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 to-transparent transition-opacity duration-500" />
              </motion.button>
            </Link>

            {/* Auth actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/70">{user?.username || user?.email}</span>
                <button onClick={() => { logout(); window.location.href = '/'; }} className="px-4 py-2 bg-red-600 text-white rounded">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login"><a className="text-sm text-white/70 hover:text-white">Login</a></Link>
                <Link href="/register"><a className="px-4 py-2 bg-white text-black rounded text-sm font-bold">Sign up</a></Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-xl hover:border-white/30 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[88px] z-40 lg:hidden bg-pitch-black/95 backdrop-blur-2xl border-t border-white/10"
          >
            <div className="p-8 space-y-8 flex flex-col h-full overflow-y-auto">
              {navItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-4xl font-black uppercase tracking-tighter text-white/50 hover:text-electric-blue transition-colors flex items-center justify-between group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              ))}

              <div className="pt-8 border-t border-white/10">
                <Link href="/app" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full py-6 bg-vivid-purple text-white text-xl font-black uppercase tracking-widest rounded-3xl shadow-[0_0_30px_rgba(189,0,255,0.3)]">
                    Get Started Now
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
