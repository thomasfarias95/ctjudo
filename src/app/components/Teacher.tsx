import Image from 'next/image';

interface ClassType {
  title: string;
  description: string;
  beltSystem: string;
  image: string;
}

const classTypes: ClassType[] = [
  
  {
   title: 'Sensei Tito',
    description: 'Com mais de 20 anos de experiencia de aula em Judô',
    beltSystem: '5º dan',
    image: "/profaldisio.jpg",
  },
  
];

const Classes: React.FC = () => {
  return (
    <section id="teacher" className="py-16 px-4 bg-gray text-judo-light-gray">
  <div className="container mx-auto max-w-5xl text-center">
    <h2 className="text-4xl font-bold mb-12 text-judo-blue">Sensei</h2>
    <div className="flex justify-center">
      {classTypes.map((classInfo, index) => (
        <div key={index} className="bg-judo-light-gray p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 max-w-md">
          <div className="relative h-72 w-full mb-4 rounded-md overflow-hidden">
            <Image
              src={classInfo.image || "/imagens/padrao.jpg"}
              alt={classInfo.title || "Imagem da aula"}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-judo-orange">{classInfo.title}</h3>
          <p className="text-lg leading-relaxed mb-4">{classInfo.description}</p>
          <p className="font-semibold text-judo-blue">
            Graduação: <span className="font-normal">{classInfo.beltSystem}</span>
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default Classes;