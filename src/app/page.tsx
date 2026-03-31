'use client';

import { useState, useEffect } from 'react';
import LandingContent from './components/LandingContent'; // O conteúdo da Landing Page que você moveu
import LoadingScreen from './components/LoadingScreen';   // O componente com o GIF dos judocas

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Aumentamos para 5 segundos para garantir que o backend do Render 
    // tenha tempo de sair do modo de espera (Cold Start).
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        /* Tela cheia com a animação de judô */
        <LoadingScreen />
      ) : (
        /* Transição suave para o site real */
        <div className="animate-in fade-in duration-1000">
          <LandingContent />
        </div>
      )}
    </>
  );
}