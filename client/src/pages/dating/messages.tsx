import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

const chatData = {
  '1': {
    name: 'Alex',
    age: 28,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    online: true,
    messages: [
      { id: 1, sender: 'Alex', text: 'Hey! How was your weekend?', timestamp: '2:30 PM', isOwn: false },
      { id: 2, sender: 'You', text: 'It was great! Went hiking at Muir Woods 🥾', timestamp: '2:32 PM', isOwn: true },
      { id: 3, sender: 'Alex', text: 'Oh I love it there! The view is incredible', timestamp: '2:33 PM', isOwn: false },
      { id: 4, sender: 'Alex', text: 'We should go together sometime!', timestamp: '2:33 PM', isOwn: false },
      { id: 5, sender: 'You', text: "That sounds amazing! Let's plan it 🗻", timestamp: '2:34 PM', isOwn: true },
      { id: 6, sender: 'Alex', text: "That sounds amazing! Let's do it 🎉", timestamp: '2:35 PM', isOwn: false },
    ],
  },
};

export default function Messages() {
  const router = useRouter();
  const { id } = router.query;
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(chatData['1' as keyof typeof chatData]?.messages || []);

  const chat = chatData['1' as keyof typeof chatData];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'You',
          text: messageText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true,
        },
      ]);
      setMessageText('');
    }
  };

  if (!chat) {
    return (
      <div className="min-h-screen bg-black pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h1 className="text-2xl font-bold text-white mb-4">No conversation found</h1>
          <Link href="/dating/matches" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all">
            Back to Matches
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 border-b border-white/10 backdrop-blur px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dating/matches" className="text-white/60 hover:text-white text-2xl">
              ←
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={chat.image}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                )}
              </div>
              <div>
                <h2 className="text-white font-bold">{chat.name}, {chat.age}</h2>
                <p className="text-white/50 text-xs">{chat.online ? 'Online now' : 'Offline'}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
              📞
            </button>
            <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
              ⋮
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  msg.isOwn
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-br-none'
                    : 'bg-white/10 text-white rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.isOwn ? 'text-white/70' : 'text-white/50'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-black/95 border-t border-white/10 backdrop-blur p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all flex-shrink-0">
            +
          </button>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Send a message..."
            className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-full transition-all flex-shrink-0"
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}
