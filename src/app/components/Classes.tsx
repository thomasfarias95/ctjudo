import Image from 'next/image';

interface ClassType {
  title: string;
  description: string;
  ageRange: string;
  schedule: string;
  image: string;
}

const classTypes: ClassType[] = [
  {
    title: 'Judô Infantil',
    description: 'Aulas dinâmicas e educativas para crianças, focando em coordenação motora, disciplina, socialização e os valores do judô de forma lúdica.',
    ageRange: '4 a 14 anos',
    schedule: 'Terças e Quintas - 19h00 às 20h00,',
    image: "/kids.jpg", 
  },
  {
    title: 'Judô Juvenil e Adulto',
    description: 'Aprimoramento técnico, condicionamento físico e preparação para competições. Desenvolva sua força, agilidade e inteligência tática.',
    ageRange: 'A partir de 15 anos',
    schedule: 'Terças e Quintas - 20h00 às 21h00,',
    image: "/adulto.jpg", 
  },
  {
    title: 'Aulas Particulares',
    description: 'Treinamento individualizado com foco em habilidades específicas, Kata, aprofundamento técnico ou preparação para exames de faixa/competições.',
    ageRange: 'Todas as idades',
    schedule: 'Agendamento Flexível',
    image: "/kata.jpg", 
  },
];

const Classes: React.FC = () => {
  return (
    <section id="classes" className="py-16 px-4 bg-gray text-judo-light-gray">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-4xl font-bold mb-12 text-judo-blue">Nossas Aulas de Judô</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {classTypes.map((classInfo, index) => (
            <div key={index} className="bg-judo-light-gray p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
              <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                <Image
                  src={classInfo.image}
                  alt={classInfo.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-judo-orange">{classInfo.title}</h3>
              <p className="text-lg leading-relaxed mb-4">{classInfo.description}</p>
              <p className="font-semibold text-judo-blue">Faixa Etária: <span className="font-normal">{classInfo.ageRange}</span></p>
              <p className="font-semibold text-judo-blue">Horários: <span className="font-normal">{classInfo.schedule}</span></p>
            </div>
          ))}
        </div>
        <a
          href="#contact"
          className="mt-12 inline-block bg-judo-blue text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-800 transition duration-300 shadow-lg transform hover:scale-105"
        >
         Agende sua Aula!
        </a>
      </div>
    </section>
  );
};

export default Classes;