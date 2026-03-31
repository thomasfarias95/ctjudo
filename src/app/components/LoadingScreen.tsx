'use client';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z- flex flex-col items-center justify-center bg-white w-screen h-screen">
      {/* Container da Animação */}
      <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
        <img 
          src="/animacao-judo.gif" 
          alt="Judô CT Ferroviário" 
          className="w-80 h-80 md:w-[450px] md:h-[450px] object-contain" 
        />
        
        <h1 className="mt-8 text-3xl md:text-5xl font-black text-blue-900 tracking-tighter uppercase italic">
          CT FERROVIÁRIO
        </h1>
        
        {/* Barra de progresso minimalista no rodapé */}
        <div className="absolute bottom-10 w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-900 animate-[loading_2s_ease-in-out_infinite] w-full origin-left"></div>
        </div>
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