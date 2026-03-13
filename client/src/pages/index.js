import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to landing page
    router.push('/landing');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pitch-black">
      <div className="text-white text-center">
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-t-2 border-electric-blue animate-spin" />
        </div>
        <p className="text-sm font-black uppercase tracking-[0.5em] animate-pulse">Initializing Pika</p>
      </div>
    </div>
  );
}