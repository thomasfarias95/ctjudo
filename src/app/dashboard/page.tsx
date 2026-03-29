"use client";

import { useState, useEffect } from 'react';
import { updateAtletaStatus } from '@/service/api';
import { gerarDocumentoAtleta } from './geradorPDF';
import { gerarReciboIndividual } from './gerarReciboIndividual';
import CadastroUsuarioForm from './CadastroUsuarioForm';

export default function DashboardAtletas() {
  // --- ESTADOS DE DADOS ---
  const [atletas, setAtletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificacao, setNotificacao] = useState<{msg: string, tipo: 'sucesso' | 'erro'} | null>(null);

  // --- ESTADOS DE FILTRO ---
  const [busca, setBusca] = useState('');
  const [filtroAtividade, setFiltroAtividade] = useState<'TODOS' | 'ATIVOS' | 'INATIVOS'>('TODOS');
  const [filtroFinanceiro, setFiltroFinanceiro] = useState<'TODOS' | 'EM_DIA' | 'PENDENTE'>('TODOS');
  const [filtroGenero, setFiltroGenero] = useState<'TODOS' | 'MASC' | 'FEM'>('TODOS');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  const GRADUACOES = [
    "BRANCA", "CINZA", "AZUL", "AMARELA", "LARANJA", 
    "VERDE", "ROXA", "MARROM", "PRETA 1º DAN", "PRETA 2º DAN"
  ];

  // --- FUNÇÃO PARA MOSTRAR TOAST ---
  const avisar = (msg: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setNotificacao({ msg, tipo });
    setTimeout(() => setNotificacao(null), 3000);
  };

  // --- BUSCA DE DADOS ---
  const fetchAtletas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cadastro/atletas?t=${new Date().getTime()}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setAtletas(Array.isArray(data) ? data : []);
    } catch (error) {
      avisar("Erro ao carregar dados do servidor", "erro");
      setAtletas([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) { window.location.href = '/'; return; }
    fetchAtletas();
  }, []);

  // --- ATUALIZAÇÃO MANUAL DE GRADUAÇÃO ---
  const handleUpdateGraduacao = async (id: number, novaGraduacao: string) => {
    try {
      // Update local para velocidade de UI
      setAtletas(prev => prev.map(a => a.id === id ? { ...a, graduacao: novaGraduacao } : a));

      const resp = await fetch(`${API_URL}/api/cadastro/atletas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ graduacao: novaGraduacao })
      });

      if (resp.ok) {
        avisar("Graduação atualizada com sucesso!");
      } else {
        throw new Error();
      }
    } catch (e) {
      avisar("Erro ao salvar graduação", "erro");
      fetchAtletas(); // Reverte se falhar
    }
  };

  // --- LÓGICA DE FILTRAGEM ---
  const atletasFiltrados = atletas.filter(atleta => {
    const nome = (atleta.nomeCompleto || atleta.nome || "").toLowerCase();
    const bateNome = nome.includes(busca.toLowerCase());
    const bateAtividade = filtroAtividade === 'TODOS' ? true : filtroAtividade === 'ATIVOS' ? atleta.ativo !== false : atleta.ativo === false;
    const bateFinanceiro = filtroFinanceiro === 'TODOS' ? true : filtroFinanceiro === 'EM_DIA' ? atleta.statusPagamento === 'EM_DIA' : atleta.statusPagamento !== 'EM_DIA';
    const gen = (atleta.genero || atleta.sexo || "").toUpperCase();
    const bateGenero = filtroGenero === 'TODOS' ? true : filtroGenero === 'MASC' ? (gen === 'MASCULINO' || gen === 'M') : (gen === 'FEMININO' || gen === 'F');
    return bateNome && bateAtividade && bateFinanceiro && bateGenero;
  });

  // --- EXPORTAR PARA CSV ---
  const handleExportar = () => {
    const cabecalho = "Nome;Graduacao;Turno;Vencimento;Status\n";
    const corpo = atletasFiltrados.map(a => `${a.nomeCompleto};${a.graduacao};${a.turno};${a.diaVencimento};${a.statusPagamento}`).join("\n");
    const blob = new Blob(["\ufeff" + cabecalho + corpo], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Relatorio_CTF_${new Date().toLocaleDateString()}.csv`;
    link.click();
    avisar("Relatório Excel (CSV) gerado!");
  };

  // --- AÇÕES ---
  const handleBaixaPagamento = async (id: number) => {
    const atletaAlvo = atletas.find(a => a.id === id);
    if (!atletaAlvo) return;
    
    setAtletas(prev => prev.map(a => a.id === id ? { ...a, statusPagamento: 'EM_DIA' } : a));
    
    try {
      const resp = await fetch(`${API_URL}/api/cadastro/atletas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusPagamento: 'EM_DIA' })
      });
      if (resp.ok) { 
        gerarReciboIndividual({ ...atletaAlvo, statusPagamento: 'EM_DIA' });
        avisar(`Pagamento de ${atletaAlvo.nomeCompleto} confirmado!`);
      }
    } catch (e) { 
      avisar("Falha ao processar pagamento", "erro"); 
      fetchAtletas(); 
    }
  };

  const handleToggleStatus = async (id: number, ativo: any) => {
    try {
      await updateAtletaStatus(id, !ativo);
      setAtletas(prev => prev.map(a => a.id === id ? { ...a, ativo: !ativo } : a));
      avisar(`Status do atleta atualizado!`);
    } catch (e) { avisar("Erro ao mudar status", "erro"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-900 animate-pulse italic uppercase text-sm">Carregando CT Ferroviário...</div>;

  return (
    <div className={`p-4 md:p-8 min-h-screen transition-all duration-500 font-sans ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-black'}`}>
      
      {/* NOTIFICAÇÃO (TOAST) */}
      {notificacao && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-2xl shadow-2xl font-black uppercase italic text-[10px] tracking-widest animate-bounce border-b-4 ${notificacao.tipo === 'sucesso' ? 'bg-emerald-500 text-white border-emerald-700' : 'bg-red-600 text-white border-red-800'}`}>
          {notificacao.tipo === 'sucesso' ? '✓ ' : '⚠ '} {notificacao.msg}
        </div>
      )}

      {/* HEADER */}
      <div className={`mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-6 gap-4 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
        <div>
          <h1 className={`text-4xl font-black uppercase italic tracking-tighter leading-none ${darkMode ? 'text-white' : 'text-blue-900'}`}>CT FERROVIÁRIO</h1>
          <div className="flex gap-4 mt-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Painel de Controle</p>
            <button onClick={() => setDarkMode(!darkMode)} className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${darkMode ? 'border-slate-700 text-yellow-400' : 'border-gray-300 text-blue-900'}`}>
              {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
            </button>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={handleExportar} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-700 transition-all">Exportar Planilha</button>
            <button onClick={() => { localStorage.clear(); window.location.href='/'; }} className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Sair</button>
        </div>
      </div>

      {/* FILTROS */}
      <div className={`p-6 rounded-[2rem] shadow-sm border mb-8 space-y-4 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col xl:flex-row gap-4">
          <input 
            type="text" 
            placeholder="🔍 Buscar atleta pelo nome..." 
            className={`flex-1 p-3 rounded-xl outline-none text-sm font-bold uppercase italic border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:ring-blue-500' : 'bg-gray-50 border-gray-200 focus:ring-blue-900'}`}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div className="flex flex-wrap gap-3">
            <div className={`flex p-1 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
              {['TODOS', 'ATIVOS', 'INATIVOS'].map((f) => (
                <button key={f} onClick={() => setFiltroAtividade(f as any)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filtroAtividade === f ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}>{f}</button>
              ))}
            </div>
            <div className={`flex p-1 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
              {['TODOS', 'EM_DIA', 'PENDENTE'].map((f) => (
                <button key={f} onClick={() => setFiltroFinanceiro(f as any)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filtroFinanceiro === f ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400'}`}>{f}</button>
              ))}
            </div>
            <div className={`flex p-1 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
              {['TODOS', 'MASC', 'FEM'].map((f) => (
                <button key={f} onClick={() => setFiltroGenero(f as any)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${filtroGenero === f ? 'bg-pink-600 text-white shadow-md' : 'text-gray-400'}`}>{f}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABELA COM EDIÇÃO DE GRADUAÇÃO */}
      <div className={`rounded-[2rem] shadow-2xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className={darkMode ? 'bg-slate-800 text-white' : 'bg-blue-900 text-white'}>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest italic">Atleta / Graduação</th>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-center italic">Vencimento</th>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-center italic">Financeiro</th>
                <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-right italic">Gestão</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-gray-50'}`}>
              {atletasFiltrados.map((atleta) => (
                <tr key={atleta.id} className={`transition-colors ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-blue-50/40'}`}>
                  <td className="p-6">
                    <div className="font-black text-base uppercase leading-tight">{atleta.nomeCompleto || atleta.nome}</div>
                    
                    {/* SELECT DE GRADUAÇÃO EDITÁVEL */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px]">🥋</span>
                      <select 
                        value={atleta.graduacao?.toUpperCase()} 
                        onChange={(e) => handleUpdateGraduacao(atleta.id, e.target.value)}
                        className={`bg-transparent text-[10px] font-black uppercase outline-none border-b border-transparent hover:border-blue-500 transition-all cursor-pointer ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                      >
                        {GRADUACOES.map(g => (
                          <option key={g} value={g} className={darkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}>
                            {g}
                          </option>
                        ))}
                      </select>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">• {atleta.turno}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center font-bold text-gray-500 text-xs">DIA {atleta.diaVencimento || 10}</td>
                  <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black border-2 ${atleta.statusPagamento === 'EM_DIA' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'}`}>
                      {atleta.statusPagamento || 'PENDENTE'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                        <button onClick={() => handleBaixaPagamento(atleta.id)} className="w-9 h-9 bg-emerald-500 text-white rounded-lg font-black hover:scale-110 transition-transform">✓</button>
                        <button onClick={() => gerarDocumentoAtleta(atleta)} className="w-9 h-9 bg-blue-600 text-white rounded-lg font-black hover:scale-110 transition-transform">$</button>
                        
                        <a 
                          href={`${API_URL}/api/cadastro/atletas/${atleta.id}/relatorio-pdf`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-9 h-9 bg-slate-700 text-white rounded-lg flex items-center justify-center font-black hover:scale-110 transition-transform"
                        >
                          🥋
                        </a>

                        <button onClick={() => handleToggleStatus(atleta.id, atleta.ativo)} className={`px-3 h-9 rounded-lg text-[9px] font-black text-white ${atleta.ativo !== false ? 'bg-red-500' : 'bg-green-600'}`}>
                          {atleta.ativo !== false ? "SUSPENDER" : "ATIVAR"}
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MATRÍCULA */}
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 bg-blue-700 text-white px-8 py-4 rounded-full font-black uppercase italic shadow-2xl hover:scale-105 transition-all z-40 border-4 border-white">
        + Matricular Atleta
      </button>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-100'}`}>
            <div className="bg-blue-900 p-6 text-white flex justify-between items-center font-black italic uppercase text-xs">
              Nova Inscrição <button onClick={() => setIsModalOpen(false)} className="text-xl">✕</button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <CadastroUsuarioForm onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); fetchAtletas(); avisar("Atleta matriculado com sucesso!"); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}