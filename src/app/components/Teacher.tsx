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

  // Fallback para a URL correta com "-api" conforme seus logs
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario-api.onrender.com';

  useEffect(() => {
    const carregarProfessores = async () => {
      try {
        const res = await fetch(`${API_URL}/api/professores`);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        setProfessores(data);
      } catch (err) {
        // Silencia o erro fatal e apenas loga no console de forma controlada
        console.warn("Backend ainda despertando ou inacessível no momento.");
      } finally {
        setLoading(false);
      }
    };
    carregarProfessores();
  }, [API_URL]);

  return (
    <section id="teacher" className="py-16 bg-gray-100 scroll-mt-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-black mb-12 text-blue-900 uppercase tracking-tighter italic">
          Nossos Senseis
        </h2>
        
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
             <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-500 font-bold animate-pulse text-xs uppercase italic">Sincronizando tatame...</p>
          </div>
        ) : professores.length === 0 ? (
          <p className="text-gray-400 font-medium italic">Senseis em treinamento. Recarregue em instantes.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
            {professores.map((prof) => (
              <div key={prof.id} className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md border border-gray-200 transition-transform hover:-translate-y-2">
                <div className="relative h-96 w-full mb-6 rounded-2xl overflow-hidden bg-gray-200">
                  <Image
                    src={prof.fotoUrl && prof.fotoUrl.startsWith('http') ? prof.fotoUrl : "/padrao.jpg"} 
                    alt={prof.nomeCompleto}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="text-2xl font-black text-blue-900 uppercase italic">{prof.nomeCompleto}</h3>
                <p className="text-orange-600 font-black uppercase text-xs mt-2 tracking-widest">{prof.graduacao}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Teacher;