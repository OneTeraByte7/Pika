import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/ui/Navbar';
import TwitterBanner from '../components/social/twitter/TwitterBanner';
import Hero from '../components/ui/Hero';
import Features from '../components/features/Features';
import HowItWorks from '../components/ui/HowItWorks';
import Pricing from '../components/misc/Pricing';
import Footer from '../components/ui/Footer';

export default function Landing() {
  return (
    <>
      <Head>
        <title>Pika - Voice-First Social Media AI Agent</title>
        <meta name="description" content="Manage all your social media platforms with just your voice. Instagram, Twitter, and TikTok in one intelligent conversation." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#7e22ce" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster position="top-center" />

      <div className="min-h-screen bg-pitch-black text-white selection:bg-electric-blue selection:text-black antialiased">
        <Navbar />

        <main className="relative overflow-hidden">
          {/* Global Glows */}
          <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-vivid-purple/5 blur-[120px] rounded-full pointer-events-none" />

          <Hero />
          <Features />
          <HowItWorks />
          <Pricing />
        </main>

        <Footer />
      </div>
    </>
  );
}
