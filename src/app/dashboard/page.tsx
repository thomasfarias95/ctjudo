"use client"; 

import { useState, useEffect } from 'react';
import { downloadRelatorioTecnico, updateAtletaStatus } from '@/service/api';
import { gerarDocumentoAtleta } from './geradorPDF';
import CadastroUsuarioForm from './CadastroUsuarioForm'; // Importando seu formulário

export default function DashboardAtletas() {
  const [atletas, setAtletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [papelInicial, setPapelInicial] = useState<'ALUNO' | 'PROFESSOR'>('ALUNO');

  useEffect(() => {
    fetchAtletas();
  }, []);

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

  // Abre o modal já selecionando se é aluno ou professor
  const openModal = (papel: 'ALUNO' | 'PROFESSOR') => {
    setPapelInicial(papel);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: number, statusAtual: any) => {
    const isAtivo = statusAtual !== false; 
    try {
      await updateAtletaStatus(id, !isAtivo);
      setAtletas(prev => prev.map(a => a.id === id ? { ...a, ativo: !isAtivo } : a));
    } catch (err) {
      alert("Erro ao alterar status.");
    }
  };

  if (loading) return <div className="p-6 text-center text-blue-900 font-bold italic">Abrindo o Dojô...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen relative">
      
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tighter uppercase italic">CT FERROVIÁRIO</h1>
          <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Gestão de Judô</p>
        </div>
        <button className="text-red-500 text-xs font-black uppercase hover:underline">Sair</button>
      </div>

      {/* CARDS DE RESUMO E MENU DE AÇÕES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border-b-4 border-blue-600 text-left">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Total Geral</p>
          <h2 className="text-3xl font-black text-blue-900">{atletas.length}</h2>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border-b-4 border-green-500 text-left">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Ativos</p>
          <h2 className="text-3xl font-black text-green-600">{atletas.filter(a => a.ativo !== false).length}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border-b-4 border-gray-400 text-left">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Inativos</p>
          <h2 className="text-3xl font-black text-gray-500">{atletas.filter(a => a.ativo === false).length}</h2>
        </div>

        {/* CARD DE AÇÕES RAPIDAS */}
        <div className="bg-blue-900 p-5 rounded-xl shadow-lg flex flex-col justify-center gap-2">
          <button 
            onClick={() => openModal('ALUNO')}
            className="w-full bg-white text-blue-900 text-[10px] font-black uppercase py-2 rounded hover:bg-blue-50 transition-all"
          >
            + Matricular Aluno
          </button>
          <button 
            onClick={() => openModal('PROFESSOR')}
            className="w-full bg-blue-700 text-white text-[10px] font-black uppercase py-2 rounded hover:bg-blue-600 transition-all"
          >
            + Novo Professor
          </button>
        </div>
      </div>

      {/* TABELA DE ATLETAS */}
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
                return (
                  <tr key={atleta.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-left">
                      <div className="font-extrabold text-gray-800 text-sm uppercase">{atleta.nomeCompleto || atleta.nome}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{atleta.turno || 'NOITE'}</div>
                    </td>
                    <td className="p-4 text-gray-600 text-[12px] font-bold uppercase text-left">{atleta.graduacao}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border ${statusAtivo ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {statusAtivo ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => gerarDocumentoAtleta(atleta)} className="p-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700">💰</button>
                        <button onClick={() => downloadRelatorioTecnico(atleta.id, atleta.nomeCompleto)} className="p-2 bg-slate-800 text-white rounded shadow-sm hover:bg-black">🥋</button>
                        <button 
                          onClick={() => handleToggleStatus(atleta.id, atleta.ativo)}
                          className={`px-3 py-1 rounded shadow-sm text-[10px] font-black text-white ${statusAtivo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
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

      {/* --- MODAL COM O SEU FORMULÁRIO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-900 p-4 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-black uppercase tracking-widest text-sm">Painel de Cadastro</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-300 font-bold px-2 text-xl">✕</button>
            </div>
            
            <div className="p-6">
              {/* Aqui renderizamos o seu formulário passando as props necessárias */}
              <CadastroUsuarioForm 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => {
                  setIsModalOpen(false);
                  fetchAtletas(); // Recarrega a lista após cadastrar!
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}