import Image from 'next/image';

const About: React.FC = () => {
  return (
    <section id="about" className="py-16 px-4 bg-judo-dark-gray text-judo-light-gray">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold mb-8 text-judo-blue">Sobre o CT Ferroviário de  Judô</h2>
        <div className="md:flex md:items-center md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/ct.jpg" 
              alt="Equipe CT Ferroviario de Judô"
              width={500}
              height={350}
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
          <div className="md:w-1/2 text-center">
            <p className="text-lg leading-relaxed mb-4">
              Fundada na decada de 70, o Ferroviário Clube de Judô tem como missão promover o judô como ferramenta de desenvolvimento humano integral. Nossos mestres e instrutores são dedicados a transmitir não apenas as técnicas de luta, mas também os princípios milenares de <strong>disciplina, respeito, ética e autoconfiança que são a base do judô.</strong>
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Acreditamos que o judô é para todos, independentemente da idade, gênero ou nível de experiência. Nossos treinos são cuidadosamente adaptados para garantir o aprendizado e a evolução de cada aluno, em <strong>um ambiente seguro, acolhedor e desafiador.</strong>
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Venha fazer parte da nossa família no tatame e descubra o poder transformador do judô!
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Associada à Federação Pernambucana de Judô (FPJU) e à Confederação Brasileira de Judô (CBJ).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;