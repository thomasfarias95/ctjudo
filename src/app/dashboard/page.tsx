'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api, { updateAtletaStatus, updateAtleta } from '../../service/api';
import { gerarDocumentoAtleta } from './geradorPDF';
import { gerarReciboIndividual } from './gerarReciboIndividual';
import CadastroUsuarioForm from './CadastroUsuarioForm';

export default function DashboardAtletas() {
  const router = useRouter();
  
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

  const GRADUACOES = [
    "BRANCA","BRANCA/CINZA" ,"CINZA","CINZA/AZUL", "AZUL", "AZUL/AMARELA","AMARELA","AMARELA/LARANJA", "LARANJA", 
    "VERDE", "ROXA", "MARROM", "PRETA 1º DAN", "PRETA 2º DAN","PRETA 3º DAN","PRETA 4º DAN","PRETA 5º DAN","KODANSHA 6º DAN",
    "KODANSHA 7º DAN","KODANSHA 8º DAN", "KODANSHA 9º DAN", "KODANSHA 10º DAN"
  ];

  const avisar = (msg: string, tipo: 'sucesso' | 'erro' = 'sucesso') => {
    setNotificacao({ msg, tipo });
    setTimeout(() => setNotificacao(null), 3000);
  };

  const fetchAtletas = async () => {
    try {
      const response = await api.get('/api/cadastro/atletas');
      setAtletas(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error("Erro ao carregar atletas:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      } else {
        avisar("Servidor demorou a responder. Tente recarregar.", "erro");
      }
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { 
      router.push('/login'); 
      return; 
    }
    fetchAtletas();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const handleUpdateGraduacao = async (id: number, novaGraduacao: string) => {
    try {
      setAtletas(prev => prev.map(a => a.id === id ? { ...a, graduacao: novaGraduacao } : a));
      await updateAtleta(id, { graduacao: novaGraduacao });
      avisar("Graduação atualizada!");
    } catch (e) { 
      avisar("Erro ao salvar", "erro"); 
      fetchAtletas(); 
    }
  };

  const handleBaixaPagamento = async (id: number) => {
    const atletaAlvo = atletas.find(a => a.id === id);
    if (!atletaAlvo) return;
    try {
      setAtletas(prev => prev.map(a => a.id === id ? { ...a, statusPagamento: 'EM_DIA' } : a));
      await updateAtleta(id, { statusPagamento: 'EM_DIA' });
      gerarReciboIndividual({ ...atletaAlvo, statusPagamento: 'EM_DIA' });
      avisar(`Confirmado: ${atletaAlvo.nomeCompleto}`);
    } catch (e) { 
      avisar("Falha no pagamento", "erro"); 
      fetchAtletas(); 
    }
  };

  const handleToggleStatus = async (id: number, ativo: boolean) => {
    try {
      await updateAtletaStatus(id, !ativo);
      setAtletas(prev => prev.map(a => a.id === id ? { ...a, ativo: !ativo } : a));
      avisar(`Status alterado!`);
    } catch (e) { 
      avisar("Erro no status", "erro"); 
    }
  };

  const atletasFiltrados = atletas.filter(atleta => {
    const nome = (atleta.nomeCompleto || atleta.nome || "").toLowerCase();
    const bateNome = nome.includes(busca.toLowerCase());
    const bateAtividade = filtroAtividade === 'TODOS' ? true : filtroAtividade === 'ATIVOS' ? atleta.ativo !== false : atleta.ativo === false;
    const bateFinanceiro = filtroFinanceiro === 'TODOS' ? true : filtroFinanceiro === 'EM_DIA' ? atleta.statusPagamento === 'EM_DIA' : atleta.statusPagamento !== 'EM_DIA';
    return bateNome && bateAtividade && bateFinanceiro;
  });

  // --- ESTADO DE CARREGAMENTO MINIMALISTA ---
  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center space-y-4 ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-blue-900'}`}>
        <div className="w-12 h-12 border-4 border-blue-900 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="font-black uppercase italic tracking-tighter animate-pulse text-sm">
          Sincronizando Atletas...
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-8 min-h-screen transition-all ${darkMode ? 'bg-slate-950 text-white' : 'bg-gray-50 text-black'}`}>
      
      {/* TOAST RESPONSIVO */}
      {notificacao && (
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-5 z-50 px-6 py-4 rounded-2xl shadow-2xl font-black uppercase italic text-[10px] animate-bounce border-b-4 ${notificacao.tipo === 'sucesso' ? 'bg-emerald-500 text-white border-emerald-700' : 'bg-red-600 text-white border-red-800'}`}>
          {notificacao.msg}
        </div>
      )}

      {/* HEADER MOBILE-FRIENDLY */}
      <div className={`mb-8 flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-6 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-blue-900 dark:text-white">CT FERROVIÁRIO</h1>
          <button onClick={() => setDarkMode(!darkMode)} className="mt-2 text-[9px] font-black uppercase px-3 py-1 rounded-full border border-gray-300 dark:border-slate-700">
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
          </button>
        </div>
        <button onClick={handleLogout} className="w-full md:w-auto bg-red-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase">Sair do Painel</button>
      </div>

      {/* BUSCA E FILTROS ACESSÍVEIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input 
          type="text" 
          placeholder="🔍 Nome do atleta..." 
          className={`p-4 rounded-2xl font-bold uppercase italic border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className="flex gap-2">
          <select 
            value={filtroAtividade} 
            onChange={(e) => setFiltroAtividade(e.target.value as any)}
            className={`flex-1 p-4 rounded-2xl text-[10px] font-black uppercase border ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}
          >
            <option value="TODOS">TODOS OS STATUS</option>
            <option value="ATIVOS">SÓ ATIVOS</option>
            <option value="INATIVOS">SÓ INATIVOS</option>
          </select>
        </div>
      </div>

      {/* TABELA COM SCROLL HORIZONTAL (CRUCIAL PARA MOBILE) */}
      <div className={`rounded-[2rem] shadow-xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-6 text-[10px] uppercase italic">Atleta</th>
                <th className="p-6 text-[10px] uppercase italic text-center">Pagamento</th>
                <th className="p-6 text-[10px] uppercase italic text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {atletasFiltrados.map((atleta) => (
                <tr key={atleta.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50">
                  <td className="p-6">
                    <div className="font-black uppercase text-sm">{atleta.nomeCompleto}</div>
                    <select 
                      value={atleta.graduacao} 
                      onChange={(e) => handleUpdateGraduacao(atleta.id, e.target.value)}
                      className="text-[9px] font-bold uppercase bg-transparent text-blue-600 outline-none"
                    >
                      {GRADUACOES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black ${atleta.statusPagamento === 'EM_DIA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {atleta.statusPagamento || 'PENDENTE'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-3">
                      {/* BOTÕES MAIORES PARA FACILITAR O TOQUE NO CELULAR */}
                      <button onClick={() => handleBaixaPagamento(atleta.id)} className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-bold">✓</button>
                      <button onClick={() => gerarDocumentoAtleta(atleta)} className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">$</button>
                      <button onClick={() => handleToggleStatus(atleta.id, atleta.ativo)} className={`px-4 h-12 rounded-xl text-[9px] font-black text-white ${atleta.ativo !== false ? 'bg-red-500' : 'bg-green-600'}`}>
                        {atleta.ativo !== false ? "OFF" : "ON"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTÃO FLUTUANTE AJUSTADO PARA MOBILE */}
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-700 text-white px-6 py-4 rounded-2xl font-black uppercase italic shadow-2xl z-40 border-2 border-white text-xs"
      >
        + Matricular
      </button>

      {/* MODAL RESPONSIVO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className={`w-full max-w-2xl h-[90vh] md:h-auto md:max-h-[90vh] rounded-t-[2rem] md:rounded-[2rem] overflow-hidden flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="p-6 border-b flex justify-between items-center font-black uppercase italic text-xs bg-blue-900 text-white">
              Nova Matrícula <button onClick={() => setIsModalOpen(false)} className="text-xl p-2">✕</button>
            </div>
            <div className="p-6 overflow-y-auto pb-24 md:pb-6">
              <CadastroUsuarioForm 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => { setIsModalOpen(false); fetchAtletas(); avisar("Matriculado!"); }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}