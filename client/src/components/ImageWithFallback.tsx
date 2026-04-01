import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  width?: number;
  height?: number;
  onError?: () => void;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallback,
  className = '',
  width,
  height,
  onError
}) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    setHasError(true);
    if (fallback) {
      setImageSrc(fallback);
    }
    onError?.();
  };

  const handleLoad = () => {
    setHasError(false);
  };

  // Reset when src changes
  React.useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  if (hasError && !fallback) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Image not found</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

// Error Boundary for catching React errors related to images
interface ImageErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ImageErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ImageErrorBoundary extends React.Component<ImageErrorBoundaryProps, ImageErrorBoundaryState> {
  constructor(props: ImageErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ImageErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Image Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Image Loading Error</h3>
            <p className="text-red-600 text-sm">
              There was a problem loading the image. Please refresh the page or try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ImageWithFallback;