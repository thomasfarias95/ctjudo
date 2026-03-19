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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  useEffect(() => {
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
    // ADICIONADO: id="teacher" e scroll-mt-20 para compensar a altura do Navbar fixo
    <section id="teacher" className="py-16 bg-gray-100 scroll-mt-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-black mb-12 text-blue-900 uppercase tracking-tighter">
          Nossos Senseis
        </h2>
        
        {loading ? (
          <p className="text-gray-500 animate-pulse font-bold">Sincronizando tatame...</p>
        ) : professores.length === 0 ? (
          <p className="text-gray-500 font-medium">Nenhum professor encontrado no sistema.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
            {professores.map((prof) => (
              <div key={prof.id} className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md border border-gray-200 transition-transform hover:-translate-y-2">
                <div className="relative h-96 w-full mb-6 rounded-2xl overflow-hidden bg-gray-200 shadow-inner">
                  <Image
                    src={prof.fotoUrl.startsWith('http') 
                      ? prof.fotoUrl 
                      : `/${prof.fotoUrl.split('/').pop()}` || "/padrao.jpg"} 
                    alt={prof.nomeCompleto}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top transition-transform duration-700 hover:scale-110"
                    priority={prof.id <= 2}
                  />
                </div>
                {/* Estilo em sintonia com o resto do sistema (Fonte Black/Bold) */}
                <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tight italic">
                  {prof.nomeCompleto}
                </h3>
                <p className="text-orange-600 font-black uppercase text-xs tracking-[0.2em] mt-2">
                  {prof.graduacao}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Teacher;