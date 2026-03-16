import Image from 'next/image';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 bg-white text-gray-800">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-judo-blue">
          Sobre o CT Ferroviário
        </h2>
        
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Imagem com efeito de borda suave */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/3] w-full shadow-2xl rounded-2xl overflow-hidden">
              <Image
                src="/ct.jpg" 
                alt="Equipe CT Ferroviário de Judô"
                fill
                style={{ objectFit: 'cover' }}
                className="hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Texto com tipografia mais confortável */}
          <div className="w-full md:w-1/2 space-y-6">
            <p className="text-lg leading-relaxed">
              Fundado na década de 70 pelo <strong>Sensei Tavares</strong>, o Ferroviário Clube de Judô carrega um legado de honra e tradição. Nossa missão é promover o judô como uma ferramenta de desenvolvimento humano integral, moldando não apenas atletas, mas cidadãos.
            </p>
            <p className="text-lg leading-relaxed">
              Nossos mestres transmitem os princípios milenares de disciplina, respeito e ética — a verdadeira base do Caminho Suave (Ju-do). Acreditamos que o judô é para todos, e por isso criamos um ambiente seguro e acolhedor, onde cada aluno evolui no seu próprio ritmo.
            </p>
            <div className="pt-4 border-l-4 border-judo-orange pl-4 italic text-gray-600">
              <p className="text-lg font-medium">
                "Venha fazer parte da nossa família no tatame e descubra o poder transformador do Judô."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;