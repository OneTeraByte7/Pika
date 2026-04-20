import DatingProfileCard from '../../components/dating/DatingProfileCard';

const sampleProfiles = [
  { id: '1', name: 'Alex', age: 28, bio: 'Loves hiking and coffee.', image: '' },
  { id: '2', name: 'Sam', age: 31, bio: 'Foodie and photographer.', image: '' },
  { id: '3', name: 'Taylor', age: 26, bio: 'Coder who likes art.', image: '' },
];

export default function DatingIndex() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-black text-white mb-6">Discover People</h1>
      <p className="text-white/70 mb-8">Browse profiles and express interest. Backend integration comes later.</p>

      <div className="grid gap-4">
        {sampleProfiles.map((p) => (
          <DatingProfileCard key={p.id} profile={p} />
        ))}
      </div>
    </div>
  );
}
