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
      const data = await response.json();
      setAtletas(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAtletas(); }, []);

  // --- LÓGICA DE CÁLCULO PARA OS GRÁFICOS ---
  const total = atletas.length || 1; // evita divisão por zero
  const masc = atletas.filter(a => a.genero === 'MASCULINO' || a.sexo === 'M').length;
  const fem = atletas.filter(a => a.genero === 'FEMININO' || a.sexo === 'F').length;
  const ativos = atletas.filter(a => a.ativo !== false).length;
  const emDia = atletas.filter(a => a.statusPagamento === 'EM_DIA').length;

  // Porcentagens para os gráficos
  const percMasc = (masc / total) * 100;
  const percFem = (fem / total) * 100;
  const percFinanceiro = (emDia / total) * 100;

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen text-black font-sans text-left">
      
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">CT FERROVIÁRIO</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logística e Gestão • Sensei Aldisio</p>
        </div>
      </div>

      {/* --- SEÇÃO DE GRÁFICOS E INDICADORES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* GRÁFICO 1: DISTRIBUIÇÃO POR GÊNERO */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Divisão por Gênero</p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1 uppercase">
                <span>Masculino ({masc})</span>
                <span>{percMasc.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${percMasc}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold mb-1 uppercase">
                <span>Feminino ({fem})</span>
                <span>{percFem.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div className="bg-pink-500 h-full transition-all duration-1000" style={{ width: `${percFem}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* GRÁFICO 2: PERFORMANCE FINANCEIRA (EM LINHA) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Saúde Financeira (Mensal)</p>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-black text-emerald-600 leading-none">{percFinanceiro.toFixed(0)}%</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase pb-1">Recebido</span>
          </div>
          <div className="w-full bg-gray-100 h-6 rounded-lg overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${percFinanceiro}%` }}></div>
            <div className="bg-red-200 h-full flex-1"></div>
          </div>
          <div className="flex justify-between mt-3 text-[9px] font-black uppercase tracking-tighter">
            <span className="text-emerald-700">Em dia: {emDia}</span>
            <span className="text-red-600">Pendentes: {total - emDia}</span>
          </div>
        </div>

        {/* GRÁFICO 3: PRESENÇA / ATIVOS */}
        <div className="bg-blue-900 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Status de Matrículas</p>
            <h2 className="text-4xl font-black italic">{ativos}</h2>
            <p className="text-[10px] font-bold uppercase opacity-80">Alunos no Tatame</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-white text-blue-900 text-[10px] font-black uppercase py-3 rounded-lg hover:bg-blue-50 transition-all shadow-md active:scale-95"
          >
            + Nova Matrícula / Professor
          </button>
        </div>
      </div>

      {/* --- TABELA DE GESTÃO --- */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-blue-900 italic">Lista de Atletas do CT</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1e3a8a] text-white">
            <tr>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest">Atleta / Info</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-center">Vencimento</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-center">Status</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-right">Ações</th>
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
                  <span className={`px-2 py-1 rounded text-[8px] font-black tracking-widest ${atleta.statusPagamento === 'EM_DIA' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {atleta.statusPagamento || 'PENDENTE'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => {/* função baixa */}} className="p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 shadow-sm" title="Baixa Manual">✅</button>
                    <button onClick={() => gerarDocumentoAtleta(atleta)} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-sm" title="Carnê">💰</button>
                    <button onClick={() => downloadRelatorioTecnico(atleta.id, atleta.nomeCompleto)} className="p-2 bg-gray-800 text-white rounded hover:bg-black shadow-sm" title="Técnico">🥋</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL MANTIDO IGUAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             {/* ... conteúdo do modal já enviado ... */}
          </div>
        </div>
      )}
    </div>
  );
}