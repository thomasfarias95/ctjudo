"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import CadastroUsuarioForm from './CadastroUsuarioForm';
import { gerarDocumentoAtleta } from './geradorPDF';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Atleta {
  id: number;
  nomeCompleto: string;
  turno: string;
  graduacao: string;
  nomeResponsavel: string;
  diaVencimento: number;
  sexo: string;
  ultimaNotificacao?: string; // Campo vindo do seu novo Backend Java
}

interface Pagamento {
  id: number;
  atleta?: Atleta;
  dataVencimento: string; 
  pago: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostrarListaCompleta, setMostrarListaCompleta] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
      carregarDados();
    }
  }, [router]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const resPag = await fetch(`${API_URL}/api/pagamentos`);
      const dataPag = await resPag.json();
      setPagamentos(dataPag);

      const resStats = await fetch(`${API_URL}/api/dashboard/estatisticas`);
      if (resStats.ok) {
        const dataStats = await resStats.json();
        setStats(dataStats);
      }
    } catch (err) {
      console.error("Erro ao conectar ao backend:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmarPagamento = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/pagamentos/confirmar/${id}`, { method: 'PUT' });
      if (res.ok) carregarDados();
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    router.replace('/login');
  };

  // Lógica dos Gráficos com Fallback para evitar quebras
  const dataPizza = {
    labels: stats?.genero ? Object.keys(stats.genero) : [],
    datasets: [{
      data: stats?.genero ? Object.values(stats.genero) : [],
      backgroundColor: ['#3b82f6', '#ec4899', '#94a3b8'],
      borderWidth: 1,
    }]
  };

  const dataBarras = {
    labels: ['Pago', 'Pendente'],
    datasets: [{
      label: 'Mensalidades do Mês',
      data: stats?.financeiroMensal ? [stats.financeiroMensal.PAGO, stats.financeiroMensal.PENDENTE] : [0, 0],
      backgroundColor: ['#10b981', '#f43f5e'],
    }]
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
        <p className="text-blue-900 font-bold text-xl uppercase tracking-tighter">Sincronizando com o CT Ferroviário...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto text-black bg-gray-50 min-h-screen">
      {/* Header Protegido */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tighter">Gestão Sensei</h1>
          <p className="text-gray-500 font-medium">Olá, {user?.nome || 'Sensei'} 👋</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition font-black shadow-lg uppercase text-sm"> + Matricular </button>
          <button onClick={logout} className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-2xl hover:text-red-600 transition font-bold shadow-sm">Sair</button>
        </div>
      </div>
      
      {/* Cards de Resumo - Clique em Total Atletas para alternar a lista */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-white">
        <div onClick={() => setMostrarListaCompleta(!mostrarListaCompleta)} className="cursor-pointer">
          <ResumoCard titulo="Total Atletas" valor={pagamentos.length} cor="blue" info={mostrarListaCompleta ? "Clique para fechar" : "Ver todos"} />
        </div>
        <ResumoCard titulo="Recebido (Mês)" valor={pagamentos.filter(p => p.pago).length} cor="green" />
        <ResumoCard titulo="Pendentes" valor={pagamentos.filter(p => !p.pago).length} cor="red" />
      </div>

      {/* LISTA COMPLETA (Aparece ao clicar no Card Azul) */}
      {mostrarListaCompleta && (
        <div className="mb-10 animate-in slide-in-from-top duration-300">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-4 uppercase text-sm tracking-widest">Lista Geral de Atletas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                 {pagamentos.map(p => (
                   <div key={p.id} className="p-3 bg-gray-50 rounded-xl text-sm border border-gray-100 flex justify-between items-center">
                      <span className="font-bold">{p.atleta?.nomeCompleto}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{p.atleta?.turno}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* SEÇÃO DE BI - VISÃO ANALÍTICA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-slate-700 mb-6 text-center uppercase text-xs tracking-widest">Perfil dos Alunos (Gênero)</h3>
          <div className="h-64 flex justify-center">
            <Pie data={dataPizza} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-slate-700 mb-6 text-center uppercase text-xs tracking-widest">Saúde Financeira (Mês Atual)</h3>
          <div className="h-64 flex justify-center">
            <Bar data={dataBarras} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* LISTA DE PENDÊNCIAS COM STATUS DE ZAP */}
      <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100">
        <div className="bg-slate-900 p-6 flex justify-between items-center">
            <h2 className="text-white font-black text-lg uppercase tracking-tight">⚠️ Pendências do Mês</h2>
            <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">
              {new Date().toLocaleDateString('pt-br', { month: 'long' })}
            </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Atleta</th>
                <th className="p-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Vencimento</th>
                <th className="p-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pagamentos.filter(p => !p.pago).map((p) => {
                // Lógica para verificar se o Zap foi enviado hoje
                const hojeStr = new Date().toISOString().split('T')[0];
                const jaNotificado = p.atleta?.ultimaNotificacao === hojeStr;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{p.atleta?.nomeCompleto || "Atleta não identificado"}</span>
                          {jaNotificado && (
                            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1" title="Notificado automaticamente hoje">
                                ⚡ ZAP OK
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium">{p.atleta?.turno} | {p.atleta?.graduacao}</div>
                    </td>
                    <td className="p-5 text-sm">
                        <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-xl text-[11px] font-black">
                            DIA {p.atleta?.diaVencimento || '--'}
                        </span>
                    </td>
                    <td className="p-5 text-center flex justify-center gap-3">
                      <button onClick={() => confirmarPagamento(p.id)} className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-600 transition text-[11px] font-black shadow-md uppercase">
                        Baixa
                      </button>
                      <button 
                        onClick={() => p.atleta && gerarDocumentoAtleta(p.atleta)} 
                        className="bg-white text-slate-400 px-5 py-2.5 rounded-xl hover:text-blue-600 hover:border-blue-600 transition text-[11px] font-black border border-gray-200 uppercase"
                      >
                        📄 PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {pagamentos.filter(p => !p.pago).length === 0 && (
            <div className="p-20 text-center">
               <p className="text-gray-300 font-black uppercase tracking-widest text-sm">Tudo em dia por aqui! ✅</p>
            </div>
        )}
      </div>

      {/* Modal de Matrícula */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-300 hover:text-black transition text-2xl"> ✕ </button>
            <h2 className="text-3xl font-black mb-1 text-slate-900 uppercase tracking-tighter">Matrícula</h2>
            <p className="text-gray-400 text-xs mb-8 font-bold uppercase tracking-widest">Novo Judoca no CT Ferroviário</p>
            
            <CadastroUsuarioForm 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => { 
                    carregarDados(); 
                    setIsModalOpen(false); 
                }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ResumoCard({ titulo, valor, cor, info }: { titulo: string, valor: number, cor: 'blue' | 'green' | 'red', info?: string }) {
  const cores = { 
    blue: 'bg-blue-700 shadow-blue-200 hover:bg-blue-800', 
    green: 'bg-emerald-600 shadow-emerald-100', 
    red: 'bg-rose-600 shadow-rose-100' 
  };
  return (
    <div className={`${cores[cor]} p-8 rounded-[2.5rem] shadow-xl transition-all duration-300 hover:-translate-y-2 active:scale-95 group`}>
      <p className="text-[10px] uppercase font-black opacity-60 tracking-[0.3em]">{titulo}</p>
      <div className="flex items-end justify-between">
        <p className="text-6xl font-black mt-2 tracking-tighter">{valor}</p>
        {info && <span className="text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">{info}</span>}
      </div>
    </div>
  );
}