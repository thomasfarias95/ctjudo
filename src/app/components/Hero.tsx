import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[85vh] flex items-center justify-center text-center text-white overflow-hidden">
      
      {/* Imagem de Fundo - Certifique-se de que a classe bg-hero-pattern está no tailwind.config.ts */}
      <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center bg-no-repeat scale-105"></div>
      
      {/* Overlay com o Azul Característico do Judô */}
      <div className="absolute inset-0 bg-judo-blue/70 z-10 backdrop-blur-[2px]"></div> 

      <div className="relative z-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl animate-fade-in-down tracking-tight">
          Equipe CT Ferroviário de Judô
        </h1>
        
        <p className="text-xl md:text-3xl mb-10 drop-shadow-md animate-fade-in-up font-light">
          Disciplina, Respeito e Superação <br className="hidden md:block" /> no Tatame e na Vida.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <a
            href="#contact"
            className="bg-judo-orange text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-orange-600 transition-all duration-300 shadow-xl transform hover:scale-110 active:scale-95"
          >
            Agende sua Aula!
          </a>
          
          <a
            href="#classes"
            className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full text-xl font-semibold hover:bg-white hover:text-judo-blue transition-all duration-300 backdrop-blur-sm"
          >
            Ver Horários
          </a>
        </div>
      </div>

      {/* Indicador de scroll para baixo */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce hidden md:block">
        <div className="w-1 h-12 bg-gradient-to-b from-white to-transparent rounded-full opacity-50"></div>
      </div>
    </section>
  );
};

export default Hero;