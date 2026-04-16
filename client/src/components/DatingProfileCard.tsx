import Link from 'next/link';

type Profile = {
  id: string;
  name: string;
  age?: number;
  bio?: string;
  image?: string;
};

export default function DatingProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex space-x-4">
      <div className="w-24 h-24 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
        {profile.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.image} alt={profile.name} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">No Image</div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">{profile.name}{profile.age ? `, ${profile.age}` : ''}</h3>
            <p className="text-sm text-white/60">{profile.bio || 'No bio yet.'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/dating/profile/${profile.id}`} className="px-3 py-1 bg-electric-blue text-black rounded">View</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
