"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Professor {
  id: number;
  nomeCompleto: string;
  graduacao: string;
  fotoUrl: string;
}

const Teacher: React.FC = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/professores')
      .then((res) => res.json())
      .then((data) => setProfessores(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12 text-blue-700">Nossos Senseis</h2>
        {loading ? <p>Carregando...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {professores.map((prof) => (
              <div key={prof.id} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden bg-gray-200">
                 <Image
                   src={prof.fotoUrl ? `/${prof.fotoUrl.split('/').pop()}` : "/padrao.jpg"} 
                   alt={prof.nomeCompleto}
                   fill
                   style={{ objectFit: 'cover', objectPosition: 'top' }} // 'top' ajuda a não cortar a cabeça do Sensei
                   sizes="(max-width: 768px) 100vw, 33vw"
                   className="transition-transform duration-500 hover:scale-105"
                     />
                    </div>
                <h3 className="text-2xl font-semibold text-orange-600">{prof.nomeCompleto}</h3>
                <p className="text-gray-600">Graduação: {prof.graduacao}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Teacher;