

const Hero: React.FC = () => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
      
      <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center bg-no-repeat"></div>
      <div className="absolute inset-0 bg-judo-blue opacity-70 z-10"></div> 
      <div className="relative z-20 p-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg animate-fade-in-down">
          Equipe CT Ferroviário de Judô
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md animate-fade-in-up">
          Disciplina, Respeito e Superação no Tatame.
        </p>
        <a
          href="#contact"
          className="bg-judo-orange text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-lg transform hover:scale-105 animate-bounce-in"
        >
          Agende sua Aula Experimental!
        </a>
      </div>
    </section>
  );
};

export default Hero;