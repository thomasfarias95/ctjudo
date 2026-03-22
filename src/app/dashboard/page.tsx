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

  const fetchAtletas = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/atletas`);
      const data = await response.json();
      setAtletas(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAtletas(); }, []);

  const handleBaixaPagamento = async (id: number) => {
    try {
      // Captura os dados do atleta antes da atualização para o recibo
      const atletaAlvo = atletas.find(a => a.id === id);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cadastro/atletas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusPagamento: 'EM_DIA' })
      });

      if (response.ok) {
        setAtletas(prev => prev.map(a => 
          a.id === id ? { ...a, statusPagamento: 'EM_DIA' } : a
        ));

        // Baixa o recibo individual no seu PC para você enviar depois
        if (atletaAlvo) {
          gerarReciboIndividual({ ...atletaAlvo, statusPagamento: 'EM_DIA' });
        }
      } else {
        alert("Erro ao registrar baixa no banco.");
      }
    } catch (error) {
      console.error("Erro na API:", error);
      alert("Erro de conexão.");
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
  const percFinanceiro = (emDia / total) * 100;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen text-black font-sans text-left">
      <div className="mb-6 flex justify-between items-end border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter leading-none">CT FERROVIÁRIO</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gestão de Judô • Sensei Aldisio</p>
        </div>
        <button onClick={() => window.location.href = '/'} className="text-red-500 text-[10px] font-black uppercase hover:underline">Sair</button>
      </div>

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
    </div>
  );
}