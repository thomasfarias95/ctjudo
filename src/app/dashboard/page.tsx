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
import { gerarDocumentoAtleta } from './geradorPDF'; // Importando a nossa ferramenta de PDF

// Registro dos componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Atleta {
  id: number;
  nomeCompleto: string;
  turno: string;
  graduacao: string;
  nomeResponsavel: string;
  diaVencimento: number;
  sexo: string;
}

interface Pagamento {
  id: number;
  atleta?: Atleta;
  dataVencimento: string; 
  pago: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    } else {
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

  // Gráficos
  const dataPizza = {
    labels: stats ? Object.keys(stats.genero) : [],
    datasets: [{
      data: stats ? Object.values(stats.genero) : [],
      backgroundColor: ['#3b82f6', '#ec4899', '#94a3b8'],
      borderWidth: 1,
    }]
  };

  const dataBarras = {
    labels: ['Pago', 'Pendente'],
    datasets: [{
      label: 'Mensalidades do Mês',
      data: stats ? [stats.financeiroMensal.PAGO, stats.financeiroMensal.PENDENTE] : [0, 0],
      backgroundColor: ['#10b981', '#f43f5e'],
    }]
  };

  if (loading) return <div className="p-8 text-center text-blue-900 font-bold animate-pulse text-xl">Sincronizando com o CT Ferroviário...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto text-black bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Gestão Sensei</h1>
          <p className="text-gray-500 font-medium">Controle de Atletas e Mensalidades</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition font-bold shadow-lg"> + Matricular </button>
          <button onClick={logout} className="bg-white border border-gray-200 text-gray-500 px-4 py-2 rounded-xl hover:text-red-600 transition font-medium">Sair</button>
        </div>
      </div>
      
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-white">
        <div onClick={() => setMostrarLista(!mostrarLista)} className="cursor-pointer">
          <ResumoCard titulo="Total Atletas" valor={pagamentos.length} cor="blue" />
        </div>
        <ResumoCard titulo="Recebido (Mês)" valor={pagamentos.filter(p => p.pago).length} cor="green" />
        <ResumoCard titulo="Pendentes" valor={pagamentos.filter(p => !p.pago).length} cor="red" />
      </div>

      {/* SEÇÃO DE BI - VISÃO ANALÍTICA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-slate-700 mb-6 text-center">Perfil dos Alunos (Gênero)</h3>
          <div className="h-64 flex justify-center">
            <Pie data={dataPizza} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-slate-700 mb-6 text-center">Saúde Financeira (Mês Atual)</h3>
          <div className="h-64 flex justify-center">
            <Bar data={dataBarras} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      {/* LISTA DE PENDÊNCIAS COM GERADOR DE PDF */}
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        <div className="bg-slate-900 p-5 flex justify-between items-center">
            <h2 className="text-white font-bold text-lg">⚠️ Chamada Financeira / Pendências</h2>
            <span className="text-blue-200 text-sm font-bold uppercase">{new Date().toLocaleDateString('pt-br', { month: 'long' })}</span>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Atleta</th>
              <th className="p-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Vencimento</th>
              <th className="p-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.filter(p => !p.pago).map((p) => (
              <tr key={p.id} className="border-t hover:bg-slate-50 transition-colors">
                <td className="p-4">
                    <div className="font-bold text-slate-800">{p.atleta?.nomeCompleto || "Atleta não identificado"}</div>
                    <div className="text-xs text-gray-500">{p.atleta?.turno} | {p.atleta?.graduacao}</div>
                </td>
                <td className="p-4">
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                        Dia {p.atleta?.diaVencimento || '--'}
                    </span>
                </td>
                <td className="p-4 text-center flex justify-center gap-2">
                  <button onClick={() => confirmarPagamento(p.id)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition text-xs font-bold shadow-sm">
                    Baixa
                  </button>
                  {/* BOTÃO DO PDF */}
                  <button 
                    onClick={() => p.atleta && gerarDocumentoAtleta(p.atleta)} 
                    className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 transition text-xs font-bold border border-slate-200"
                    title="Gerar Cronograma PDF"
                  >
                    📄 PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pagamentos.filter(p => !p.pago).length === 0 && (
            <div className="p-10 text-center text-gray-400 font-medium">Parabéns! Nenhuma pendência registrada.</div>
        )}
      </div>

      {/* Modal de Matrícula */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-300 hover:text-black transition text-2xl"> ✕ </button>
            <h2 className="text-2xl font-black mb-2 text-slate-800 uppercase tracking-tight">Nova Matrícula</h2>
            <p className="text-gray-500 text-sm mb-6 font-medium">Preencha os dados do judoca e do responsável.</p>
            
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

function ResumoCard({ titulo, valor, cor }: { titulo: string, valor: number, cor: 'blue' | 'green' | 'red' }) {
  const cores = { 
    blue: 'bg-blue-600 shadow-blue-200', 
    green: 'bg-emerald-600 shadow-emerald-200', 
    red: 'bg-rose-600 shadow-rose-200' 
  };
  return (
    <div className={`${cores[cor]} p-7 rounded-3xl shadow-xl transition-transform hover:-translate-y-2 active:scale-95`}>
      <p className="text-[10px] uppercase font-black opacity-70 tracking-[0.2em]">{titulo}</p>
      <p className="text-5xl font-black mt-2">{valor}</p>
    </div>
  );
}