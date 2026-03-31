'use client';

import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z- flex flex-col items-center justify-center bg-white">
      {/* O GIF de Judô que você renomeou na pasta public */}
      <img 
        src="/animacao-judo.gif" 
        alt="Carregando CT Ferroviário..." 
        className="w-64 h-64 object-contain transition-all duration-700"
      />
      
      <div className="text-center space-y-2">
        <h2 className="mt-4 text-2xl font-bold text-blue-900 animate-pulse tracking-wide">
          CT FERROVIÁRIO
        </h2>
        
        <div className="flex flex-col items-center">
          <p className="text-gray-600 font-medium">Preparando o Tatame...</p>
          <span className="text-gray-400 text-xs mt-2 uppercase tracking-widest italic">
            Iniciando sistemas
          </span>
        </div>
      </div>

      {/* Uma barrinha de progresso fake para dar um charme extra */}
      <div className="w-48 h-1 bg-gray-100 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-blue-900 animate-[loading_2s_ease-in-out_infinite] w-full origin-left"></div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}