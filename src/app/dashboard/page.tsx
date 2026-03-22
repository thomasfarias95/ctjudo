"use client"; 

import { useState, useEffect } from 'react';
import { downloadRelatorioTecnico, updateAtletaStatus } from '@/service/api';
import { gerarDocumentoAtleta } from './geradorPDF';
import CadastroUsuarioForm from './CadastroUsuarioForm'; 

export default function DashboardAtletas() {
  const [atletas, setAtletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Lógica de Baixa Manual com Assinatura do Sensei
  const handleBaixaPagamento = async (id: number) => {
    setAtletas(prev => prev.map(a => 
      a.id === id ? { ...a, statusPagamento: 'EM_DIA', assinadoPor: 'ALDISIO SEVERINO' } : a
    ));
    // Aqui você dispararia o update para o seu banco via API
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

  if (loading) return <div className="p-6 text-center text-blue-900 font-black italic animate-pulse">CARREGANDO DOJO...</div>;

  // CÁLCULOS PARA OS DASHBOARDS
  const totalAtletas = atletas.length;
  const masc = atletas.filter(a => a.genero === 'MASCULINO' || a.sexo === 'M').length;
  const fem = atletas.filter(a => a.genero === 'FEMININO' || a.sexo === 'F').length;
  const emDia = atletas.filter(a => a.statusPagamento === 'EM_DIA').length;
  const pendentes = atletas.filter(a => a.statusPagamento === 'PENDENTE').length;
  
  // Dashboard Financeiro em Linha (Estimativa baseada em R$ 100,00)
  const faturamentoTotal = totalAtletas * 100;
  const totalRecebido = emDia * 100;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen text-black text-left font-sans">
      
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tighter uppercase italic leading-none">CT FERROVIÁRIO</h1>
          <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mt-1">Gestão de Judô • Sensei Aldisio</p>
        </div>
        <button onClick={() => window.location.href = '/'} className="text-red-500 text-[10px] font-black uppercase hover:underline">Sair</button>
      </div>

      {/* --- SEÇÃO 1: CARDS DE QUANTIDADE (GENERO E TOTAL) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-900">
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Total Alunos</p>
          <h2 className="text-2xl font-black text-blue-900">{totalAtletas}</h2>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Masculino ♂</p>
          <h2 className="text-2xl font-black text-blue-700">{masc}</h2>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-pink-500">
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Feminino ♀</p>
          <h2 className="text-2xl font-black text-pink-600">{fem}</h2>
        </div>
        <div className="bg-blue-900 p-4 rounded-xl shadow-lg flex flex-col justify-center">
          <button onClick={() => setIsModalOpen(true)} className="w-full bg-white text-blue-900 text-[10px] font-black uppercase py-2 rounded shadow-sm hover:bg-gray-100">+ Matricular</button>
        </div>
      </div>

      {/* --- SEÇÃO 2: DASHBOARD FINANCEIRO EM LINHA --- */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-8 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 w-full text-left">
            <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest mb-1">Status de Recebimento</p>
            <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden flex">
               <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(totalRecebido/faturamentoTotal)*100}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold uppercase">
              <span className="text-emerald-600">Recebido: R$ {totalRecebido.toLocaleString()}</span>
              <span className="text-red-500">Pendente: R$ {(faturamentoTotal - totalRecebido).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 border-r border-gray-100">
              <p className="text-gray-400 text-[8px] font-black uppercase">Em Dia</p>
              <p className="text-lg font-black text-emerald-600">{emDia}</p>
            </div>
            <div className="text-center px-4">
              <p className="text-gray-400 text-[8px] font-black uppercase">Atrasados</p>
              <p className="text-lg font-black text-red-600">{pendentes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABELA ATUALIZADA COM TUDO --- */}
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1e3a8a] text-white">
            <tr>
              <th className="p-4 font-bold uppercase text-[11px] tracking-widest">Atleta</th>
              <th className="p-4 font-bold uppercase text-[11px] tracking-widest text-center">Vencimento</th>
              <th className="p-4 font-bold uppercase text-[11px] tracking-widest text-center">Status</th>
              <th className="p-4 font-bold uppercase text-[11px] tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {atletas.map((atleta) => (
              <tr key={atleta.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-extrabold text-gray-800 text-sm uppercase leading-none mb-1">{atleta.nomeCompleto || atleta.nome}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{atleta.turno} • {atleta.graduacao}</div>
                </td>
                <td className="p-4 text-center font-bold text-gray-600 text-xs">Dia {atleta.diaVencimento || 28}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border ${atleta.statusPagamento === 'EM_DIA' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {atleta.statusPagamento || 'PENDENTE'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleBaixaPagamento(atleta.id)} className="p-2 bg-emerald-600 text-white rounded shadow-sm hover:bg-emerald-700" title="Dar Baixa">✅</button>
                    <button onClick={() => gerarDocumentoAtleta(atleta)} className="p-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700" title="Financeiro">💰</button>
                    <button onClick={() => downloadRelatorioTecnico(atleta.id, atleta.nomeCompleto)} className="p-2 bg-slate-800 text-white rounded shadow-sm hover:bg-black" title="Técnico">🥋</button>
                    <button onClick={() => handleToggleStatus(atleta.id, atleta.ativo)} className={`px-2 py-1 rounded text-[10px] font-black text-white ${atleta.ativo !== false ? 'bg-red-500' : 'bg-green-500'}`}>
                      {atleta.ativo !== false ? "OFF" : "ON"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CADASTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-900 p-4 text-white flex justify-between items-center sticky top-0 z-10">
              <h3 className="font-black uppercase tracking-widest text-xs italic">Painel de Matrícula CT</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white font-bold text-xl px-2">✕</button>
            </div>
            <div className="p-6">
              <CadastroUsuarioForm onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); fetchAtletas(); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}