import { useState } from 'react';

export default function VoiceInterface() {
    const [listening, setListening] = useState(false);
    return (
        <div className="p-4 bg-white/5 rounded-2xl">
            <h3 className="font-bold">Voice Interface</h3>
            <p className="text-sm text-white/40 mt-2">Record audio to generate captions and voice posts.</p>
            <div className="mt-4">
                <button onClick={() => setListening(!listening)} className="px-4 py-2 bg-gradient-pika text-white rounded-2xl">{listening ? 'Stop' : 'Record'}</button>
            </div>
        </div>
    );
}
