import Image from 'next/image';
import { useState, Component, ReactNode } from 'react';

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

interface ErrorBoundaryState { hasError: boolean }
export class ImageErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: false }; }
    componentDidCatch(error: Error) { console.warn('ImageErrorBoundary caught:', error); }
    render() { return this.props.children; }
}
