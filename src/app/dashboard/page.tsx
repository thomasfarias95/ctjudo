"use client"; 

import { useState, useEffect } from 'react';
import { downloadRelatorioTecnico, updateAtletaStatus } from '@/service/api';
import { gerarDocumentoAtleta } from './geradorPDF';
import { gerarReciboIndividual } from './gerarReciboIndividual'; 
import CadastroUsuarioForm from './CadastroUsuarioForm'; 

export default function DashboardAtletas() {
  const [atletas, setAtletas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  // --- LOGOUT ---
  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };

  // --- BUSCA DE DADOS ---
  const fetchAtletas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cadastro/atletas?t=${new Date().getTime()}`);
      
      if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setAtletas(data);
      } else {
        setAtletas([]);
      }
    } catch (error) { 
      console.error("Erro ao buscar atletas:", error); 
      setAtletas([]); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      window.location.href = '/';
      return;
    }
    fetchAtletas(); 
  }, []);

  // --- BAIXA DE PAGAMENTO (SINCRONIZADA COM JAVA) ---
  const handleBaixaPagamento = async (id: number) => {
    const atletaAlvo = atletas.find(a => a.id === id);
    if (!atletaAlvo) return;

    // Backup para reverter se der erro no servidor
    const backupAtletas = [...atletas];

    // Atualização Otimista (Melhora a UX)
    setAtletas(prev => prev.map(a => 
      a.id === id ? { ...a, statusPagamento: 'EM_DIA' } : a
    ));

    try {
      const response = await fetch(`${API_URL}/api/cadastro/atletas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusPagamento: 'EM_DIA' })
      });

      if (response.ok) {
        // Se gravou no Java, gera o recibo
        gerarReciboIndividual({ ...atletaAlvo, statusPagamento: 'EM_DIA' });
      } else {
        // Se o Java deu erro (ex: Erro 500), volta o status para Pendente
        setAtletas(backupAtletas);
        alert("Erro no servidor: O pagamento não pôde ser processado no banco.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      setAtletas(backupAtletas);
      alert("Falha na conexão com o servidor do CT.");
    }
  };

  // --- ATIVAR/DESATIVAR ATLETA ---
  const handleToggleStatus = async (id: number, statusAtual: any) => {
    const novoStatus = statusAtual === false;
    try {
      await updateAtletaStatus(id, novoStatus);
      setAtletas(prev => prev.map(a => a.id === id ? { ...a, ativo: novoStatus } : a));
    } catch (err) { 
      alert("Erro ao alterar status de atividade."); 
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-blue-900 font-black italic animate-pulse uppercase tracking-widest">
      Carregando CT Ferroviário...
    </div>
  );

  // --- CÁLCULOS DE GESTÃO ---
  const listaSegura = Array.isArray(atletas) ? atletas : [];
  const totalValido = listaSegura.length;
  const divisor = totalValido > 0 ? totalValido : 1;

  const masc = listaSegura.filter(a => a?.genero === 'MASCULINO' || a?.sexo === 'M').length;
  const fem = listaSegura.filter(a => a?.genero === 'FEMININO' || a?.sexo === 'F').length;
  const ativos = listaSegura.filter(a => a?.ativo !== false).length;
  const emDia = listaSegura.filter(a => a?.statusPagamento === 'EM_DIA').length;

  const percMasc = (masc / divisor) * 100;
  const percFem = (fem / divisor) * 100;
  const percFinanceiro = (emDia / divisor) * 100;

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen text-black font-sans">
      
      {/* HEADER PROFISSIONAL */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">CT FERROVIÁRIO</h1>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">Sistema de Gestão de Atletas • Sensei Aldisio</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-white text-red-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all duration-300 border border-red-100 shadow-sm active:scale-95"
        >
          Sair do Sistema
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* CARD GÊNERO */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Censo da Academia</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] font-black mb-1.5 uppercase text-blue-700">♂ Masculino ({masc})</div>
              <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-700" style={{ width: `${percMasc}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-black mb-1.5 uppercase text-pink-600">♀ Feminino ({fem})</div>
              <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full transition-all duration-700" style={{ width: `${percFem}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD FINANCEIRO */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saúde Financeira</p>
            <span className="text-emerald-600 font-black text-lg">{percFinanceiro.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-red-50 h-10 rounded-2xl overflow-hidden flex mb-3 p-1 border border-red-100">
            <div className="bg-emerald-500 h-full rounded-xl transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.3)]" style={{ width: `${percFinanceiro}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
            <span className="flex items-center text-emerald-700"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></span> EM DIA: {emDia}</span>
            <span className="flex items-center text-red-600"><span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span> PENDENTE: {totalValido - emDia}</span>
          </div>
        </div>

        {/* CARD TOTAL/MATRÍCULA */}
        <div className="bg-blue-900 p-6 rounded-[2rem] shadow-xl text-white flex flex-col justify-between transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total de Alunos</p>
              <h2 className="text-4xl font-black italic tracking-tighter">{totalValido}</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status Ativo</p>
              <h2 className="text-4xl font-black italic text-green-400 tracking-tighter">{ativos}</h2>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="mt-6 bg-white text-blue-900 text-[11px] font-black uppercase py-3 rounded-xl shadow-lg hover:bg-blue-50 transition-colors active:scale-95"
          >
            + Nova Matrícula
          </button>
        </div>
      </div>

      {/* LISTAGEM DE ATLETAS */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-6 font-bold uppercase text-[11px] tracking-[0.2em]">Atleta / Graduação</th>
                <th className="p-6 font-bold uppercase text-[11px] tracking-[0.2em] text-center">Vencimento</th>
                <th className="p-6 font-bold uppercase text-[11px] tracking-[0.2em] text-center">Situação</th>
                <th className="p-6 font-bold uppercase text-[11px] tracking-[0.2em] text-right">Ações de Gestão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listaSegura.map((atleta) => (
                <tr key={atleta.id} className="hover:bg-blue-50/50 transition-all duration-200">
                  <td className="p-6">
                    <div className="font-black text-gray-800 text-base uppercase leading-tight">{atleta.nomeCompleto || atleta.nome}</div>
                    <div className="text-[10px] font-bold text-blue-500 uppercase mt-1">
                      🥋 {atleta.graduacao} • 🕒 {atleta.turno}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="inline-block bg-gray-100 px-3 py-1 rounded-lg text-gray-600 font-bold text-xs uppercase">
                      Dia {atleta.diaVencimento || 10}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest border-2 shadow-sm ${
                      atleta.statusPagamento === 'EM_DIA' 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {atleta.statusPagamento || 'PENDENTE'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleBaixaPagamento(atleta.id)} 
                        className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 shadow-lg hover:shadow-emerald-100 transition-all active:scale-90" 
                        title="Confirmar Pagamento"
                      >
                        ✓
                      </button>
                      <button 
                        onClick={() => gerarDocumentoAtleta(atleta)} 
                        className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-100 transition-all active:scale-90" 
                        title="Histórico Financeiro"
                      >
                        $
                      </button>
                      <button 
                        onClick={() => downloadRelatorioTecnico(atleta.id, atleta.nomeCompleto)} 
                        className="w-10 h-10 flex items-center justify-center bg-slate-800 text-white rounded-xl hover:bg-black shadow-lg transition-all active:scale-90" 
                        title="Ficha Técnica"
                      >
                        🥋
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(atleta.id, atleta.ativo)} 
                        className={`px-3 py-1 rounded-xl text-[10px] font-black text-white shadow-md transition-all active:scale-90 ${
                          atleta.ativo !== false ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
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

      {/* MODAL DE CADASTRO (DESIGN REFINADO) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-100">
            <div className="bg-blue-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black uppercase tracking-[0.2em] text-xs italic">Formulário de Matrícula</h3>
                <p className="text-[9px] opacity-60 uppercase font-bold mt-1">CT FERROVIÁRIO • INGRESSO DE ATLETA</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-88px)] custom-scrollbar">
              <CadastroUsuarioForm 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => { setIsModalOpen(false); fetchAtletas(); }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}