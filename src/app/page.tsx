'use client';

import { useState, useEffect } from 'react';
import LandingContent from './components/LandingContent';
import LoadingScreen from './components/LoadingScreen';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Definimos 3 segundos para a animação aparecer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="animate-in fade-in duration-1000">
          <LandingContent />
        </div>
      )}
    </>
  );
}