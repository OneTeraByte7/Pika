import Link from 'next/link';
import { useState } from 'react';

const sampleMatches = [
  {
    id: '1',
    name: 'Alex',
    age: 28,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    lastMessage: "That sounds amazing! Let's do it 🎉",
    timestamp: '2 min ago',
    unread: true,
    online: true,
    mutualInterests: 3,
  },
  {
    id: '3',
    name: 'Taylor',
    age: 26,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    lastMessage: 'That painting was incredible!',
    timestamp: '1 hour ago',
    unread: false,
    online: false,
    mutualInterests: 2,
  },
  {
    id: '4',
    name: 'Jordan',
    age: 29,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    lastMessage: 'Really interested in what you said',
    timestamp: '5 hours ago',
    unread: false,
    online: true,
    mutualInterests: 4,
  },
];

export default function Matches() {
  const [matches, setMatches] = useState(sampleMatches);
  const [filter, setFilter] = useState<'all' | 'online' | 'unread'>('all');

  const filteredMatches = matches.filter((m) => {
    if (filter === 'online') return m.online;
    if (filter === 'unread') return m.unread;
    return true;
  });

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-white">Matches</h1>
              <p className="text-white/60 mt-2">Your mutual connections</p>
            </div>
            <Link
              href="/dating"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all"
            >
              ← Discover
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-3 flex-wrap">
            {(['all', 'online', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  filter === f
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                }`}
              >
                {f === 'all' && `All (${matches.length})`}
                {f === 'online' && `Online (${matches.filter((m) => m.online).length})`}
                {f === 'unread' && `Unread (${matches.filter((m) => m.unread).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Matches List */}
        {filteredMatches.length > 0 ? (
          <div className="space-y-3">
            {filteredMatches.map((match) => (
              <Link key={match.id} href={`/dating/messages?id=${match.id}`}>
                <div className="bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-2xl p-4 hover:border-white/20 hover:from-white/10 hover:to-white/15 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={match.image}
                        alt={match.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {match.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-black" />
                      )}
                    </div>

                    {/* Match Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">{match.name}, {match.age}</h3>
                        {match.unread && (
                          <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-white/60 text-sm truncate group-hover:text-white/80 transition-all">
                        {match.lastMessage}
                      </p>
                      <div className="flex gap-2 mt-2 text-xs text-white/40">
                        <span>{match.timestamp}</span>
                        {match.mutualInterests > 0 && (
                          <span className="flex items-center gap-1">
                            🔥 {match.mutualInterests} interests
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Liked ${match.name}`);
                        }}
                        className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-full transition-all"
                        title="Like"
                      >
                        ♥
                      </button>
                      <span className="text-2xl">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-white mb-2">No matches yet</h2>
            <p className="text-white/60 mb-6">
              {filter === 'online'
                ? "No one is online right now. Try back later!"
                : filter === 'unread'
                  ? 'All caught up!'
                  : 'Start liking profiles to get matches!'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all"
              >
                View All Matches
              </button>
            )}
            {filter === 'all' && (
              <Link
                href="/dating"
                className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full font-semibold transition-all"
              >
                Start Exploring
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
