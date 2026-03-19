"use client";
import Image from 'next/image';

interface ClassType {
  title: string;
  description: string;
  ageRange: string;
  schedule: string;
  image: string;
  whatsappMsg: string; 
  isNew?: boolean;     
}

const classTypes: ClassType[] = [
  {
    title: 'Judô Infantil',
    description: 'Aulas dinâmicas e educativas para crianças, focando em coordenação motora, disciplina e socialização de forma lúdica.',
    ageRange: '4 a 14 anos',
    schedule: 'Manhã (10:00), Tarde (16:00) e Noite (19:00)',
    image: "/kids.jpg", 
    whatsappMsg: "Olá! Tenho interesse na turma de Judô Infantil. Poderia me passar mais detalhes sobre as vagas para os novos horários de Abril?",
    isNew: true 
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
    whatsappMsg: "Olá! Gostaria de agendar uma aula particular ou treinamento de Kata personalizado com o Sensei."
  },
];

const Classes: React.FC = () => {
  const handleWhatsApp = (message: string) => {
    // SEU NÚMERO ATUALIZADO
    const phone = "5581998264250"; 
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <section id="classes" className="py-20 px-4 bg-slate-950 text-white">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-4 text-orange-600 uppercase tracking-tighter">
          Nossas Aulas
        </h2>
        <p className="text-gray-400 mb-16 max-w-2xl mx-auto font-medium">
          Escolha a modalidade ideal e venha treinar com a Equipe <span className="text-white">CT Ferroviário</span>. 
          Matrículas abertas para os novos horários de Abril!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {classTypes.map((classInfo, index) => (
            <div 
              key={index} 
              className="bg-slate-900 p-2 rounded-[2rem] shadow-2xl hover:shadow-orange-600/10 transition-all duration-500 transform hover:-translate-y-3 flex flex-col h-full border border-slate-800 relative overflow-hidden group"
            >
              {/* Badge Dinâmica de Abril */}
              {classInfo.isNew && (
                <div className="absolute top-6 right-[-35px] bg-orange-600 text-white text-[10px] font-black py-1.5 px-12 rotate-45 shadow-xl z-10 uppercase tracking-widest">
                  Novidade
                </div>
              )}

              {/* Container da Imagem */}
              <div className="relative h-60 w-full rounded-[1.5rem] overflow-hidden mb-6">
                <Image
                  src={classInfo.image}
                  alt={classInfo.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
              </div>
              
              <div className="px-6 flex-grow">
                <h3 className="text-2xl font-black mb-3 text-white group-hover:text-orange-500 transition-colors">
                  {classInfo.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6 text-gray-400 font-medium">
                  {classInfo.description}
                </p>
              </div>

              {/* Informações de Logística */}
              <div className="mx-6 mb-8 bg-black/40 p-5 rounded-2xl text-left border border-slate-800">
                <div className="mb-4">
                  <span className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                    Público Alvo
                  </span>
                  <span className="text-gray-200 text-sm font-bold">{classInfo.ageRange}</span>
                </div>
                <div>
                  <span className="flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                    Disponibilidade
                  </span>
                  <span className="text-gray-200 text-sm font-bold">{classInfo.schedule}</span>
                </div>
              </div>

              {/* Botão de Ação */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleWhatsApp(classInfo.whatsappMsg)}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-black transition-all duration-300 flex items-center justify-center gap-3 group/btn shadow-lg shadow-orange-900/20"
                >
                  TENHO INTERESSE
                  <svg className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Classes;