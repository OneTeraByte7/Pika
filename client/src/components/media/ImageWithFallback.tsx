import Image from 'next/image';
import { useState } from 'react';

export default function ImageWithFallback({ src, fallback, alt, className = '' }: { src: string; fallback?: string; alt?: string; className?: string }) {
    const [error, setError] = useState(false);
    return (
        <div className={className}>
            {!error ? (
                <Image src={src} alt={alt || ''} width={400} height={300} onError={() => setError(true)} />
            ) : (
                <img src={fallback || '/placeholder.png'} alt={alt || ''} />
            )}
        </div>
    );
}
