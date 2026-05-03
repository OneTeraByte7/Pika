import Link from 'next/link';
import { useState } from 'react';

type Profile = {
  id: string;
  name: string;
  age?: number;
  bio?: string;
  image?: string;
  images?: string[];
  location?: string;
  distance?: number;
  interests?: string[];
  verified?: boolean;
  online?: boolean;
};

type CardLayout = 'list' | 'discover';

export default function DatingProfileCard({ profile, layout = 'list', onLike, onPass }: { profile: Profile; layout?: CardLayout; onLike?: (id: string) => void; onPass?: (id: string) => void; }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const images = profile.images && profile.images.length > 0 ? profile.images : [profile.image || ''];
  
  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleAction = (action: 'like' | 'pass') => {
    setIsAnimating(true);
    setTimeout(() => {
      if (action === 'like' && onLike) onLike(profile.id);
      if (action === 'pass' && onPass) onPass(profile.id);
      setIsAnimating(false);
    }, 300);
  };

  // Discover layout - full screen card
  if (layout === 'discover') {
    return (
      <div className={`relative w-full max-w-md mx-auto h-screen max-h-[600px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        {/* Image Gallery */}
        <div className="relative w-full h-3/4 bg-gradient-to-b from-white/5 to-black/50">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[currentImageIndex]}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <div className="text-center">
                <div className="text-6xl mb-2">📷</div>
                <p className="text-white/60">No photos</p>
              </div>
            </div>
          )}

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all"
              >
                ‹
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all"
              >
                ›
              </button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Status Badges */}
          <div className="absolute top-4 right-4 flex gap-2">
            {profile.verified && (
              <div className="px-2 py-1 bg-blue-500/80 rounded-full text-xs text-white font-semibold flex items-center gap-1">
                ✓ Verified
              </div>
            )}
            {profile.online && (
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" title="Online" />
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-12">
          <div className="mb-2">
            <h2 className="text-3xl font-black text-white">
              {profile.name} {profile.age && <span className="text-2xl">{profile.age}</span>}
            </h2>
            {profile.location && (
              <p className="text-white/60 flex items-center gap-2 mt-1">
                📍 {profile.location} {profile.distance && <span>• {profile.distance}km away</span>}
              </p>
            )}
          </div>

          {profile.bio && <p className="text-white/80 text-sm mb-4">{profile.bio}</p>}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.interests.slice(0, 3).map((interest) => (
                <span key={interest} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80">
                  #{interest}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => handleAction('pass')}
              className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
              title="Pass"
            >
              ✕
            </button>
            <button
              onClick={() => handleAction('like')}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95 shadow-lg"
              title="Like"
            >
              ♥
            </button>
            <Link
              href={`/dating/profile/${profile.id}`}
              className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-xl transition-all hover:scale-110"
              title="View Profile"
            >
              ℹ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // List layout - compact card
  return (
    <div className="bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-2xl p-4 flex space-x-4 hover:border-white/20 transition-all hover:bg-gradient-to-r hover:from-white/10 hover:to-white/15">
      <div className="relative w-20 h-20 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
        {profile.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.image} alt={profile.name} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">📷</div>
        )}
        {profile.online && (
          <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border border-white" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold">
              {profile.name}
              {profile.age && <span className="ml-1 text-white/60">{profile.age}</span>}
            </h3>
            {profile.verified && <span className="text-blue-400 text-xs">✓</span>}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAction('pass')}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white rounded text-sm transition-all"
            >
              Pass
            </button>
            <button
              onClick={() => handleAction('like')}
              className="px-2 py-1 bg-red-500/80 hover:bg-red-600 text-white rounded text-sm transition-all"
            >
              ♥
            </button>
            <Link
              href={`/dating/profile/${profile.id}`}
              className="px-2 py-1 bg-blue-500/80 hover:bg-blue-600 text-white rounded text-sm transition-all"
            >
              View
            </Link>
          </div>
        </div>
        <p className="text-sm text-white/60 line-clamp-1">{profile.bio || 'No bio yet.'}</p>
        {profile.location && (
          <p className="text-xs text-white/40 mt-1">📍 {profile.location}</p>
        )}
      </div>
    </div>
  );
}
