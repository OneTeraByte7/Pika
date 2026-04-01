import '../styles/globals.css';
import { useEffect } from 'react';
import { useAuthStore } from '../store';
import { ImageErrorBoundary } from '../components/ImageWithFallback';

function MyApp({ Component, pageProps }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
    
    // Handle any remaining image loading errors
    const handleImageErrors = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.complete || img.naturalWidth === 0) {
          console.warn('Found broken image:', img.src);
          img.style.display = 'none'; // Hide broken images
        }
      });
    };

    // Check for broken images after initial load
    setTimeout(handleImageErrors, 1000);
    
    // Listen for image errors globally
    document.addEventListener('error', (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        e.target.style.display = 'none';
      }
    }, true);
  }, [initialize]);

  return (
    <ImageErrorBoundary>
      <Component {...pageProps} />
    </ImageErrorBoundary>
  );
}

export default MyApp;