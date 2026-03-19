"use client";
import Image from 'next/image';

interface ClassType {
  title: string;
  description: string;
  ageRange: string;
  schedule: string;
  image: string;
  whatsappMsg: string; // Mensagem personalizada
  isNew?: boolean;     // Para destacar turmas de Abril
}

const classTypes: ClassType[] = [
  {
    title: 'Judô Infantil',
    description: 'Aulas dinâmicas e educativas para crianças, focando em coordenação motora, disciplina e socialização de forma lúdica.',
    ageRange: '4 a 14 anos',
    schedule: 'Manhã (10:00), Tarde (16:00) e Noite (19:00)',
    image: "/kids.jpg", 
    whatsappMsg: "Olá! Tenho interesse na turma de Judô Infantil. Poderia me passar mais detalhes sobre as vagas?",
    isNew: true // Marcado como destaque para os novos horários
  },
  {
    title: 'Judô Juvenil e Adulto',
    description: 'Aprimoramento técnico, condicionamento físico e inteligência tática para jovens e adultos em todos os níveis.',
    ageRange: 'A partir de 15 anos',
    schedule: 'Terças e Quintas - 20h00 às 21h00',
    image: "/adulto.jpg",
    whatsappMsg: "Olá! Gostaria de saber mais sobre os treinos de Judô Juvenil/Adulto no CT Ferroviário."
  },
  {
    title: 'Aulas Particulares',
    description: 'Treinamento individualizado com foco em Kata, aprofundamento técnico ou preparação para exames de faixa.',
    ageRange: 'Todas as idades',
    schedule: 'Manhã e Tarde (Agendamento Flexível)',
    image: "/kata.jpg", 
    whatsappMsg: "Olá! Gostaria de agendar uma aula particular ou treinamento de Kata personalizado."
  },
];

const Classes: React.FC = () => {
  const handleWhatsApp = (message: string) => {
    const phone = "55819XXXXXXXX"; // Substitua pelo seu número (DDD + número)
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="classes" className="py-16 px-4 bg-gray-900 text-white">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-4xl font-bold mb-4 text-orange-600">Nossas Aulas de Judô</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Escolha a modalidade ideal e venha treinar com a Equipe CT Ferroviário. 
          Novos horários disponíveis a partir de Abril!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {classTypes.map((classInfo, index) => (
            <div 
              key={index} 
              className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-orange-900/20 transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full border border-gray-700 relative overflow-hidden"
            >
              {/* Badge de Nova Turma */}
              {classInfo.isNew && (
                <div className="absolute top-4 right-[-35px] bg-orange-600 text-white text-[10px] font-bold py-1 px-10 rotate-45 shadow-lg">
                  ABRIL
                </div>
              )}

              <div className="relative h-52 w-full mb-6 rounded-xl overflow-hidden">
                <Image
                  src={classInfo.image}
                  alt={classInfo.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-3 text-white">{classInfo.title}</h3>
                <p className="text-sm leading-relaxed mb-6 text-gray-400">{classInfo.description}</p>
              </div>

              <div className="mt-4 bg-gray-900/50 p-4 rounded-xl text-left mb-6">
                <div className="mb-3">
                  <span className="block text-[10px] font-black text-orange-600 uppercase tracking-widest">Faixa Etária</span>
                  <span className="text-white text-sm">{classInfo.ageRange}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black text-orange-600 uppercase tracking-widest">Horários</span>
                  <span className="text-white text-sm">{classInfo.schedule}</span>
                </div>
              </div>

              <button
                onClick={() => handleWhatsApp(classInfo.whatsappMsg)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold transition-colors duration-300 flex items-center justify-center gap-2 group"
              >
                Tenho Interesse
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Classes;