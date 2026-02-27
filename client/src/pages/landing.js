import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <>
      <Head>
        <title>Pika - Voice-First Social Media AI Agent</title>
        <meta name="description" content="Manage all your social media platforms with just your voice. Instagram, Twitter, and TikTok in one intelligent conversation." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#667eea" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster position="top-center" />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        
        <main>
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
