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

  // Pega a URL da API da variável de ambiente que configuramos na Vercel
  // Se não houver variável, ele tenta o Render diretamente como fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  useEffect(() => {
    // Agora o fetch usa a URL dinâmica (Render em produção)
    fetch(`${API_URL}/api/professores`)
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar professores');
        return res.json();
      })
      .then((data) => setProfessores(data))
      .catch((err) => console.error("Erro na API do CT:", err))
      .finally(() => setLoading(false));
  }, [API_URL]);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12 text-blue-700">Nossos Senseis</h2>
        
        {loading ? (
          <p className="text-gray-500 animate-pulse">Carregando Senseis...</p>
        ) : professores.length === 0 ? (
          <p className="text-gray-500">Nenhum professor encontrado no sistema.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {professores.map((prof) => (
              <div key={prof.id} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    // Prioriza a foto que está na pasta public da Vercel
                    // Ele pega apenas o nome do arquivo (ex: aldisio.jpg)
                    src={prof.fotoUrl ? `/${prof.fotoUrl.split('/').pop()}` : "/padrao.jpg"} 
                    alt={prof.nomeCompleto}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-orange-600">{prof.nomeCompleto}</h3>
                <p className="text-gray-600 font-medium">Graduação: {prof.graduacao}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Teacher;