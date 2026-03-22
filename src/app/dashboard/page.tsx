"use client"; 

import { useState, useEffect } from 'react';
import { downloadRelatorioTecnico, updateAtletaStatus } from '@/service/api';
import { gerarDocumentoAtleta } from './geradorPDF'; // Seu jsPDF local

export default function DashboardAtletas() {
  const [atletas, setAtletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. CARREGAR ATLETAS AO ABRIR A PÁGINA
  useEffect(() => {
    const fetchAtletas = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/atletas`);
        if (!response.ok) throw new Error("Erro ao buscar dados");
        const data = await response.json();
        setAtletas(data);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAtletas();
  }, []);

  // 2. FUNÇÃO DE STATUS (CORRIGIDA)
  const handleToggleStatus = async (id: number, statusAtual: any) => {
    // Tratamos o status atual para garantir que seja booleano
    const isAtivo = statusAtual !== false; 
    
    try {
      await updateAtletaStatus(id, !isAtivo);
      
      // Atualiza o estado local para a UI refletir a mudança instantaneamente
      setAtletas(prev => prev.map(a => 
        a.id === id ? { ...a, ativo: !isAtivo } : a
      ));
    } catch (err) {
      alert("Erro ao alterar status no servidor.");
    }
  };

  if (loading) return <div className="p-6 text-center text-blue-900 font-bold">Carregando tatame...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-900 uppercase tracking-wider">
        Gestão CT Ferroviário
      </h1>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-4 font-semibold uppercase text-sm">Atleta</th>
              <th className="p-4 font-semibold uppercase text-sm">Graduação</th>
              <th className="p-4 font-semibold uppercase text-sm">Status</th>
              <th className="p-4 text-center font-semibold uppercase text-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {atletas.map((atleta) => {
              // Lógica para garantir que o status nunca seja 'null' na renderização
              const statusAtivo = atleta.ativo !== false;
              const nomeParaExibir = atleta.nomeCompleto || atleta.nome || "Atleta sem nome";

              return (
                <tr key={atleta.id} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{nomeParaExibir}</div>
                    <div className="text-xs text-gray-500 uppercase">{atleta.turno || 'Turno não definido'}</div>
                  </td>
                  <td className="p-4 text-gray-700 font-medium">
                    {atleta.graduacao || 'Branca'}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${statusAtivo ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                      {statusAtivo ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    {/* PDF Financeiro (Local - jsPDF) */}
                    <button 
                      onClick={() => gerarDocumentoAtleta(atleta)}
                      className="p-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 active:scale-90 transition-all"
                      title="Cronograma Financeiro"
                    >
                      💰
                    </button>

                    {/* PDF Técnico (Java/Render) */}
                    <button 
                      onClick={() => downloadRelatorioTecnico(atleta.id, nomeParaExibir)}
                      className="p-2 bg-gray-800 text-white rounded shadow hover:bg-black active:scale-90 transition-all"
                      title="Relatório Técnico"
                    >
                      🥋
                    </button>

                    {/* Toggle Status - Botão de ON/OFF */}
                    <button 
                      onClick={() => handleToggleStatus(atleta.id, atleta.ativo)}
                      className={`px-3 py-1 rounded shadow text-xs font-bold text-white transition-all active:scale-90 ${statusAtivo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      {statusAtivo ? "OFF" : "ON"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {atletas.length === 0 && (
        <div className="p-10 text-center text-gray-500 italic">Nenhum atleta cadastrado no momento.</div>
      )}
    </div>
  );
}