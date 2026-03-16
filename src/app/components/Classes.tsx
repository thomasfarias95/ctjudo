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
    description: 'Aulas dinâmicas e educativas para crianças, focando em coordenação motora, disciplina e socialização de forma lúdica.',
    ageRange: '4 a 14 anos',
    schedule: 'Manhã (10:00), Tarde (16:00) e Noite (19:00)',
    image: "/kids.jpg", 
  },
  {
    title: 'Judô Juvenil e Adulto',
    description: 'Aprimoramento técnico, condicionamento físico e inteligência tática para jovens e adultos em todos os níveis.',
    ageRange: 'A partir de 15 anos',
    schedule: 'Terças e Quintas - 20h00 às 21h00',
    image: "/adulto.jpg", 
  },
  {
    title: 'Aulas Particulares',
    description: 'Treinamento individualizado com foco em Kata, aprofundamento técnico ou preparação para exames de faixa.',
    ageRange: 'Todas as idades',
    schedule: 'Manhã e Tarde (Agendamento Flexível)',
    image: "/kata.jpg", 
  },
];

const Classes: React.FC = () => {
  return (
    <section id="classes" className="py-16 px-4 bg-gray-900 text-white">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-4xl font-bold mb-12 text-judo-orange">Nossas Aulas de Judô</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {classTypes.map((classInfo, index) => (
            <div 
              key={index} 
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-gray-700"
            >
              <div className="relative h-52 w-full mb-4 rounded-md overflow-hidden">
                <Image
                  src={classInfo.image}
                  alt={classInfo.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-md"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-2xl font-semibold mb-3 text-judo-orange">{classInfo.title}</h3>
                <p className="text-md leading-relaxed mb-4 text-gray-200">{classInfo.description}</p>
              </div>

              <div className="mt-4 border-t pt-4 border-gray-700 text-left">
                <p className="text-sm font-bold text-judo-blue uppercase tracking-wide">Faixa Etária</p>
                <p className="text-white mb-2">{classInfo.ageRange}</p>
                
                <p className="text-sm font-bold text-judo-blue uppercase tracking-wide">Horários</p>
                <p className="text-white">{classInfo.schedule}</p>
              </div>
            </div>
          ))}
        </div>

        <a
          href="#contact"
          className="mt-12 inline-block bg-judo-orange text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-lg transform hover:scale-105"
        >
           Quero agendar uma aula experimental!
        </a>
      </div>
    </section>
  );
};

export default Classes;