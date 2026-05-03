import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

// Sample profile data - will be fetched from backend later
const profileData = {
  '1': {
    id: '1',
    name: 'Alex',
    age: 28,
    bio: 'Adventure seeker ✈️ Love hiking and discovering new coffee spots. Open to spontaneous road trips and meaningful conversations.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      'https://images.unsplash.com/photo-1495563671223-8a13fb4d2bac?w=400&h=500&fit=crop',
    ],
    location: 'San Francisco, CA',
    distance: 2,
    interests: ['hiking', 'coffee', 'travel', 'photography', 'cooking'],
    verified: true,
    online: true,
    joined: '2 months ago',
    height: '5\'10"',
    relationship: 'Looking for something real',
    education: 'UC Berkeley - Computer Science',
    work: 'Product Manager at Tech Startup',
  },
  '2': {
    id: '2',
    name: 'Sam',
    age: 31,
    bio: 'Foodie and photographer 📸 Always up for trying new restaurants. Let\'s explore the city together!',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
    ],
    location: 'Oakland, CA',
    distance: 8,
    interests: ['photography', 'food', 'art', 'music', 'travel'],
    verified: false,
    online: false,
    joined: '4 months ago',
    height: '5\'8"',
    relationship: 'Open to dating',
    education: 'SFSU - Fine Arts',
    work: 'Freelance Photographer',
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!id || !profileData[id as keyof typeof profileData]) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-2xl font-bold text-white mb-4">Profile not found</h1>
          <Link href="/dating" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all">
            Back to Discovery
          </Link>
        </div>
      </div>
    );
  }

  const profile = profileData[id as keyof typeof profileData];
  const images = profile.images || [profile.image];

  return (
    <div className="min-h-screen bg-black pt-16 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dating"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white">Full Profile</h1>
          <div className="w-10" />
        </div>

        {/* Image Gallery */}
        <div className="relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <img
            src={images[currentImageIndex]}
            alt={profile.name}
            className="w-full h-96 object-cover"
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-2xl transition-all"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((currentImageIndex + 1) % images.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white text-2xl transition-all"
              >
                ›
              </button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex gap-2 px-4 justify-center">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Status Badges */}
          <div className="absolute top-4 right-4 flex gap-2">
            {profile.verified && (
              <div className="px-3 py-1 bg-blue-500 rounded-full text-sm text-white font-semibold flex items-center gap-1">
                ✓ Verified
              </div>
            )}
            {profile.online && (
              <div className="px-3 py-1 bg-green-500 rounded-full text-sm text-white font-semibold flex items-center gap-1">
                ● Online
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-6">
          {/* Name & Basic Info */}
          <div>
            <h2 className="text-4xl font-black text-white">
              {profile.name}, {profile.age}
            </h2>
            <p className="text-white/60 flex items-center gap-2 mt-2">
              📍 {profile.location} • {profile.distance}km away
            </p>
            <p className="text-white/50 text-sm mt-1">Joined {profile.joined}</p>
          </div>

          {/* Bio */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-white leading-relaxed">{profile.bio}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-white/50 text-xs mb-1">HEIGHT</p>
              <p className="text-white font-semibold">{profile.height}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-white/50 text-xs mb-1">LOOKING FOR</p>
              <p className="text-white font-semibold text-sm">{profile.relationship}</p>
            </div>
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-white/50 text-xs mb-1">EDUCATION</p>
              <p className="text-white font-semibold text-sm">{profile.education}</p>
            </div>
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-white/50 text-xs mb-1">WORK</p>
              <p className="text-white font-semibold text-sm">{profile.work}</p>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              🎯 Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span key={interest} className="px-4 py-2 bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-400/30 text-pink-300 rounded-full text-sm font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 sticky bottom-0 bg-gradient-to-t from-black via-black to-transparent pt-6">
            <button className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all">
              ✕ Pass
            </button>
            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2">
              ♥ Like
            </button>
            <button className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all">
              💬 Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
