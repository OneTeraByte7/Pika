import { useState, useEffect } from 'react';
import DatingProfileCard from '../../components/dating/DatingProfileCard';
import Link from 'next/link';

const sampleProfiles = [
  {
    id: '1',
    name: 'Alex',
    age: 28,
    bio: 'Adventure seeker ✈️ Love hiking and discovering new coffee spots.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1495563671223-8a13fb4d2bac?w=400&h=500&fit=crop',
    ],
    location: 'San Francisco, CA',
    distance: 2,
    interests: ['hiking', 'coffee', 'travel'],
    verified: true,
    online: true,
  },
  {
    id: '2',
    name: 'Sam',
    age: 31,
    bio: 'Foodie and photographer 📸 Always up for trying new restaurants.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    ],
    location: 'Oakland, CA',
    distance: 8,
    interests: ['photography', 'food', 'art'],
    verified: false,
    online: false,
  },
  {
    id: '3',
    name: 'Taylor',
    age: 26,
    bio: 'Designer by day, artist by night 🎨 Let\'s create something together.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=500&fit=crop',
    ],
    location: 'Berkeley, CA',
    distance: 5,
    interests: ['design', 'art', 'music'],
    verified: true,
    online: true,
  },
  {
    id: '4',
    name: 'Jordan',
    age: 29,
    bio: 'Tech enthusiast & startup founder. Let\'s talk about changing the world 🚀',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    location: 'San Francisco, CA',
    distance: 3,
    interests: ['tech', 'startups', 'innovation'],
    verified: true,
    online: true,
  },
];

export default function DatingIndex() {
  const [profiles, setProfiles] = useState(sampleProfiles);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [passedProfiles, setPassedProfiles] = useState<string[]>([]);

  const handleLike = (id: string) => {
    setLikedProfiles([...likedProfiles, id]);
    removeProfile(id);
  };

  const handlePass = (id: string) => {
    setPassedProfiles([...passedProfiles, id]);
    removeProfile(id);
  };

  const removeProfile = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-white">Discover</h1>
              <p className="text-white/60 mt-2">Browse profiles and express interest</p>
            </div>
            <Link
              href="/dating/matches"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-red-600 transition-all"
            >
              ♥ {likedProfiles.length}
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm">
            <div className="px-3 py-1 bg-white/5 rounded-full text-white/70">
              👤 {profiles.length} profiles
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-full text-white/70">
              ❤️ {likedProfiles.length} likes
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-full text-white/70">
              ✕ {passedProfiles.length} passed
            </div>
          </div>
        </div>

        {/* Card Stack */}
        {profiles.length > 0 ? (
          <div className="relative">
            {/* Background cards (subtle depth effect) */}
            {profiles.length > 1 && (
              <div className="absolute inset-0 mx-auto max-w-md h-96 rounded-3xl bg-white/5 border border-white/10 transform translate-y-2 translate-x-1" />
            )}
            {profiles.length > 2 && (
              <div className="absolute inset-0 mx-auto max-w-md h-96 rounded-3xl bg-white/5 border border-white/10 transform translate-y-4 translate-x-2" />
            )}

            {/* Main card */}
            <DatingProfileCard
              profile={profiles[0]}
              layout="discover"
              onLike={handleLike}
              onPass={handlePass}
            />
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">No more profiles!</h2>
            <p className="text-white/60 mb-6">You've seen everyone. Check back soon for new matches.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setProfiles(sampleProfiles);
                  setLikedProfiles([]);
                  setPassedProfiles([]);
                }}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all"
              >
                Reset Deck
              </button>
              <Link
                href="/dating/matches"
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full font-semibold transition-all"
              >
                View Matches
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
