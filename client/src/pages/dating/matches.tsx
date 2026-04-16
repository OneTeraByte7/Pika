import Link from 'next/link';

export default function Matches() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-black text-white mb-4">Matches</h1>
      <p className="text-white/70 mb-6">Your mutual matches will appear here once matching is enabled.</p>
      <Link href="/dating" className="px-4 py-2 bg-white text-black rounded">Back to Browse</Link>
    </div>
  );
}
