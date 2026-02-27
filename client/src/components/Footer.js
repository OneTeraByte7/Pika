import { motion } from 'framer-motion';
import { Twitter, Instagram, Github, Mail } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'How it Works', href: '#how-it-works' },
      { label: 'Roadmap', href: '#roadmap' },
    ],
    Company: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' },
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Support', href: '#support' },
      { label: 'Status', href: '#status' },
    ],
    Legal: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms', href: '#terms' },
      { label: 'Security', href: '#security' },
      { label: 'Cookies', href: '#cookies' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-white">Pika</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-xs">
              Voice-first AI agent for managing all your social media platforms in one place.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <div key={index}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="text-white font-semibold mb-3">Stay updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates on features and product news.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 Pika AI. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-400 hover:text-purple-400 transition-colors">
              Terms of Service
            </a>
            <a href="#cookies" className="text-gray-400 hover:text-purple-400 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
