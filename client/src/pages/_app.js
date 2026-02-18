import '../styles/globals.css';
import { useEffect } from 'react';
import { useAuthStore } from '../store';

function MyApp({ Component, pageProps }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <Component {...pageProps} />;
}

export default MyApp;