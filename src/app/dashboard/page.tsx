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

  // --- FUNÇÃO DE LOGOUT (BLINDAGEM) ---
  const handleLogout = () => {
    // 1. Mata o Cookie (fazendo ele expirar agora) para o Middleware barrar o acesso
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
    // 2. Limpa os dados locais de sessão
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    // 3. Manda para a tela de login (Raiz)
    window.location.href = '/';
  };

  const fetchAtletas = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/atletas?t=${new Date().getTime()}`);
      const data = await response.json();
      setAtletas(data);
    } catch (error) { 
      console.error("Erro ao buscar atletas:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    // Segurança adicional: Se não houver registro de login no navegador, expulsa
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      window.location.href = '/';
      return;
    }
    fetchAtletas(); 
  }, []);

  const handleBaixaPagamento = async (id: number) => {
    const atletaAlvo = atletas.find(a => a.id === id);

    setAtletas(prev => prev.map(a => 
      a.id === id ? { ...a, statusPagamento: 'EM_DIA' } : a
    ));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/atletas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusPagamento: 'EM_DIA' })
      });

      if (response.ok) {
        if (atletaAlvo) {
          gerarReciboIndividual({ ...atletaAlvo, statusPagamento: 'EM_DIA' });
        }
      } else {
        alert("O recibo foi gerado, mas o servidor Java não conseguiu salvar o status. Verifique o console do IntelliJ.");
        if (atletaAlvo) gerarReciboIndividual({ ...atletaAlvo, statusPagamento: 'EM_DIA' });
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("SEM CONEXÃO: Recibo gerado offline. O status voltará a PENDENTE no F5 até que a conexão com o servidor Java seja restaurada.");
      if (atletaAlvo) {
        gerarReciboIndividual({ ...atletaAlvo, statusPagamento: 'EM_DIA' });
      }
    }
  };

  const handleToggleStatus = async (id: number, statusAtual: any) => {
    const novoStatus = statusAtual === false;
    try {
      await updateAtletaStatus(id, novoStatus);
      setAtletas(prev => prev.map(a => a.id === id ? { ...a, ativo: novoStatus } : a));
    } catch (err) { alert("Erro ao alterar status."); }
  };

  if (loading) return <div className="p-6 text-center text-blue-900 font-black italic animate-pulse">CARREGANDO DOJO...</div>;

  const total = atletas.length || 1;
  const masc = atletas.filter(a => a.genero === 'MASCULINO' || a.sexo === 'M').length;
  const fem = atletas.filter(a => a.genero === 'FEMININO' || a.sexo === 'F').length;
  const ativos = atletas.filter(a => a.ativo !== false).length;
  const emDia = atletas.filter(a => a.statusPagamento === 'EM_DIA').length;
  const percMasc = (masc / total) * 100;
  const percFem = (fem / total) * 100;
  const percFinanceiro = (emDia / total) * 100;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen text-black font-sans text-left">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">CT FERROVIÁRIO</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gestão de Judô</p>
        </div>
        {/* BOTÃO SAIR ATUALIZADO */}
        <button 
          onClick={handleLogout} 
          className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all border border-red-100"
        >
          Sair do Sistema
        </button>
      </div>

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-[9px] font-black text-gray-400 uppercase mb-3 tracking-widest">Distribuição por Gênero</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] font-black mb-1 uppercase text-blue-700">♂ MASCULINO ({masc})</div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: `${percMasc}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-black mb-1 uppercase text-pink-600">♀ FEMININO ({fem})</div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full" style={{ width: `${percFem}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-[9px] font-black text-gray-400 uppercase mb-3 tracking-widest">Saúde Financeira ({percFinanceiro.toFixed(0)}%)</p>
          <div className="w-full bg-red-100 h-8 rounded-lg overflow-hidden flex mb-2">
            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${percFinanceiro}%` }}></div>
          </div>
          <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
            <span className="text-emerald-700">EM DIA: {emDia}</span>
            <span className="text-red-600">PENDENTE: {total - emDia}</span>
          </div>
        </div>

        <div className="bg-blue-900 p-5 rounded-2xl shadow-lg text-white flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div><p className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Atletas</p><h2 className="text-3xl font-black italic">{total}</h2></div>
            <div className="text-right"><p className="text-[9px] font-black uppercase tracking-widest opacity-60">Ativos</p><h2 className="text-3xl font-black italic text-green-400">{ativos}</h2></div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-white text-blue-900 text-[10px] font-black uppercase py-2 rounded shadow-md hover:bg-blue-50">+ Nova Matrícula</button>
        </div>
      </div>

      {/* TABELA DE GESTÃO */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1e3a8a] text-white">
            <tr>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest">Atleta / Info</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-center">Vencimento</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-right">Gestão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {atletas.map((atleta) => (
              <tr key={atleta.id} className="hover:bg-blue-50/40 transition-colors">
                <td className="p-4">
                  <div className="font-extrabold text-gray-800 text-sm uppercase leading-none mb-1">{atleta.nomeCompleto || atleta.nome}</div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase">{atleta.turno} • {atleta.graduacao}</div>
                </td>
                <td className="p-4 text-center font-bold text-gray-600 text-xs">Dia {atleta.diaVencimento || 28}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest border ${atleta.statusPagamento === 'EM_DIA' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {atleta.statusPagamento || 'PENDENTE'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleBaixaPagamento(atleta.id)} className="p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 shadow-sm" title="Dar Baixa">✅</button>
                    <button onClick={() => gerarDocumentoAtleta(atleta)} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm" title="Financeiro">💰</button>
                    <button onClick={() => downloadRelatorioTecnico(atleta.id, atleta.nomeCompleto)} className="p-2 bg-slate-800 text-white rounded hover:bg-black shadow-sm" title="Técnico">🥋</button>
                    <button 
                      onClick={() => handleToggleStatus(atleta.id, atleta.ativo)} 
                      className={`px-2 py-1 rounded text-[10px] font-black text-white ${atleta.ativo !== false ? 'bg-red-500' : 'bg-green-600'}`}
                    >
                      {atleta.ativo !== false ? "OFF" : "ON"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CADASTRO */}
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