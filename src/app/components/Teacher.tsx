import Image from 'next/image';

interface ClassType {
  title: string;
  description: string;
  experience: string;
  image: string;
}

const classTypes: ClassType[] = [
  {
    title: 'Professor Tito',
    description: 'Faixa Preto 5ª Dan',
    experience: 'Professor a mais de 20 anos de experiência no Judô, formado em Educação Fisica e abitro categoria FIJ C.',
    image: "/tito.jpg", 
  },
  {
    title: '',
    description: '',
    experience: '',
    image: "/download(1).jpg", 
  },
  {
    title: '',
    description: '',
    experience: '',
    image: "/download.jpg", 
  },
];

const Teacher: React.FC = () => {
  return (
    <section id="classes" className="py-16 px-4 bg-gray text-judo-light-gray">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="text-4xl font-bold mb-12 text-judo-blue">Nossos Sensei-gata de Judô</h2>
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
              <p className="font-semibold text-judo-blue">Experiência: <span className="font-normal">{classInfo.experience}</span></p>
              
            </div>
          ))}
        </div>
        <a
          href="#contact"
          className="mt-12 inline-block bg-judo-blue text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-800 transition duration-300 shadow-lg transform hover:scale-105"
        >
          Veja a Grade Completa e Agende sua Aula!
        </a>
      </div>
    </section>
  );
};

export default Teacher;