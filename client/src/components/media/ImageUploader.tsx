import { useState } from 'react';

export default function ImageUploader({ onUpload }: { onUpload: (file: File) => void }) {
    const [fileName, setFileName] = useState('');

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onUpload(file);
        }
    };

    return (
        <div className="p-4 border border-white/10 rounded-2xl bg-white/2">
            <label className="flex items-center gap-4">
                <input onChange={handleChange} type="file" accept="image/*" className="hidden" />
                <div className="px-4 py-2 bg-white/5 rounded-md">Choose Image</div>
                <div className="text-sm text-white/40">{fileName || 'No file selected'}</div>
            </label>
        </div>
    );
}
