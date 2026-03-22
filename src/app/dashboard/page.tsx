"use client"; 

import { useState, useEffect } from 'react';
import { downloadRelatorioTecnico, updateAtletaStatus } from '@/service/api';
import { gerarDocumentoAtleta } from './geradorPDF';
import CadastroUsuarioForm from './CadastroUsuarioForm'; 

export default function DashboardAtletas() {
  const [atletas, setAtletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. BUSCAR DADOS DO BACKEND (RENDER)
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

  useEffect(() => {
    fetchAtletas();
  }, []);

  // 2. ALTERAR STATUS (ATIVO/INATIVO)
  const handleToggleStatus = async (id: number, statusAtual: any) => {
    const isAtivo = statusAtual !== false; 
    try {
      await updateAtletaStatus(id, !isAtivo);
      setAtletas(prev => prev.map(a => a.id === id ? { ...a, ativo: !isAtivo } : a));
    } catch (err) {
      alert("Erro ao alterar status.");
    }
  };

  if (loading) return <div className="p-6 text-center text-blue-900 font-black italic uppercase animate-pulse">Abrindo o Dojô...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen relative text-black text-left">
      
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tighter uppercase italic">CT FERROVIÁRIO</h1>
          <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase text-left">Gestão de Judô • Sensei Aldisio</p>
        </div>
        <button 
          onClick={() => window.location.href = '/'} 
          className="text-red-500 text-[10px] font-black uppercase hover:text-red-700 transition-colors border-b border-transparent hover:border-red-700"
        >
          Sair do Sistema
        </button>
      </div>

      {/* --- SEÇÃO DE CARDS DE RESUMO (6 COLUNAS) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        
        {/* Atletas Total */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-blue-600">
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest text-left">Total Geral</p>
          <h2 className="text-2xl font-black text-blue-900 text-left">{atletas.length}</h2>
        </div>
        
        {/* Ativos */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-green-500">
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest text-left">No Tatame</p>
          <h2 className="text-2xl font-black text-green-600 text-left">
            {atletas.filter(a => a.ativo !== false).length}
          </h2>
        </div>

        {/* Em Dia */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-emerald-500">
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest text-left">Em Dia</p>
          <h2 className="text-2xl font-black text-emerald-600 text-left">
            {atletas.filter(a => a.statusPagamento === 'EM_DIA').length}
          </h2>
        </div>

        {/* Pendentes */}
        <div className="bg-white p-4 rounded-xl shadow-sm border-b-4 border-red-500">
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest text-left">Pendentes</p>
          <h2 className="text-2xl font-black text-red-600 text-left">
            {atletas.filter(a => a.statusPagamento === 'PENDENTE').length}
          </h2>
        </div>

        {/* MENU DE AÇÕES (Ocupa 2 espaços no Desktop) */}
        <div className="lg:col-span-2 bg-blue-900 p-4 rounded-xl shadow-lg flex flex-col justify-center gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-white text-blue-900 text-[9px] font-black uppercase py-2 rounded hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
          >
            + Matricular Aluno
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-700 text-white text-[9px] font-black uppercase py-2 rounded hover:bg-blue-600 transition-all active:scale-95"
          >
            + Novo Professor
          </button>
        </div>
      </div>

      {/* --- TABELA (ESTILO DO PRINT) --- */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1e3a8a] text-white">
              <tr>
                <th className="p-4 font-bold uppercase text-[11px] tracking-widest text-left">Atleta</th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-widest text-left">Graduação</th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-widest text-center">Status</th>
                <th className="p-4 font-bold uppercase text-[11px] tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {atletas.map((atleta) => {
                const statusAtivo = atleta.ativo !== false;
                // Tratamento anti-null para o nome e turno
                const nomeExibir = atleta.nomeCompleto || atleta.nome || "ATLETA SEM NOME";
                const turnoExibir = atleta.turno || "NÃO DEFINIDO";

                return (
                  <tr key={atleta.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-left">
                      <div className="font-extrabold text-gray-800 text-sm uppercase leading-none mb-1">{nomeExibir}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{turnoExibir}</div>
                    </td>
                    <td className="p-4 text-gray-600 text-[11px] font-bold uppercase text-left">
                      {atleta.graduacao || 'BRANCA'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border ${statusAtivo ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {statusAtivo ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => gerarDocumentoAtleta(atleta)} 
                          className="p-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 transition-all active:scale-90"
                          title="Financeiro"
                        >
                          💰
                        </button>
                        <button 
                          onClick={() => downloadRelatorioTecnico(atleta.id, nomeExibir)} 
                          className="p-2 bg-slate-800 text-white rounded shadow-sm hover:bg-black transition-all active:scale-90"
                          title="Ficha Técnica"
                        >
                          🥋
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(atleta.id, atleta.ativo)}
                          className={`px-3 py-1 rounded shadow-sm text-[10px] font-black text-white transition-all active:scale-90 ${statusAtivo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                        >
                          {statusAtivo ? "OFF" : "ON"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL COM FORMULÁRIO DE CADASTRO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-900 p-4 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-black uppercase tracking-widest text-xs">Painel de Matrícula CT</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-300 font-bold text-xl px-2">✕</button>
            </div>
            
            <div className="p-6">
              <CadastroUsuarioForm 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => {
                  setIsModalOpen(false);
                  fetchAtletas(); // Refresh automático na tabela
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}