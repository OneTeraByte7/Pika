import { useState } from 'react';

export default function TweetComposer({ onPost }: { onPost?: (text: string) => void }) {
    const [text, setText] = useState('');
    return (
        <div className="space-y-3">
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full p-3 rounded-lg bg-white/5" placeholder="What's happening?" />
            <div className="flex justify-end">
                <button onClick={() => onPost?.(text)} className="px-4 py-2 bg-gradient-pika text-white rounded-2xl">Post</button>
            </div>
        </div>
    );
}
