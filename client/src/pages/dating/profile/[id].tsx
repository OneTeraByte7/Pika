import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  // Placeholder - will fetch real profile from backend later
  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-black text-white mb-4">Profile {id}</h1>
      <p className="text-white/70 mb-6">This is a placeholder profile page. Back-end powered data will be added later.</p>
      <div className="space-x-4">
        <Link href="/dating" className="px-4 py-2 bg-white text-black rounded">Back</Link>
        <button className="px-4 py-2 bg-vivid-purple text-white rounded">Like</button>
      </div>
    </div>
  );
}
