"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CadastroUsuarioForm from './CadastroUsuarioForm';

interface Pagamento {
  id: number;
  atleta?: { nomeCompleto: string };
  dataVencimento: string; 
  pago: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);

  // Define a URL da API (Render)
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
      // Atualizado para usar API_URL
      const res = await fetch(`${API_URL}/api/pagamentos`); 
      if (!res.ok) throw new Error("Erro ao conectar ao backend");
      const data = await res.json();
      setPagamentos(data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmarPagamento = async (id: number) => {
    try {
      // Atualizado para usar API_URL
      const res = await fetch(`${API_URL}/api/pagamentos/confirmar/${id}`, { 
        method: 'PUT' 
      });
      
      if (res.ok) {
        carregarDados();
      } else {
        alert("Erro ao confirmar pagamento.");
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    router.replace('/login');
  };

  const formatarData = (dataStr: string) => {
    if (!dataStr) return "--/--";
    const partes = dataStr.split('-');
    // Garante que mostre no formato brasileiro DD/MM
    return `${partes[2]}/${partes[1]}`;
  };

  const isVencido = (dataVencimento: string, pago: boolean) => {
    if (pago) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = new Date(dataVencimento);
    vencimento.setHours(0, 0, 0, 0);
    return vencimento < hoje;
  };

  const total = pagamentos.length;
  const emDia = pagamentos.filter(p => p.pago === true).length;
  const inadimplentes = pagamentos.filter(p => p.pago === false);

  if (loading) return <div className="p-8 text-center text-blue-900 font-bold animate-pulse">Carregando painel financeiro...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Painel Financeiro - Sensei</h1>
        <div className="flex gap-4">
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"> + Novo Cadastro </button>
          <button onClick={logout} className="text-gray-500 hover:text-red-600 transition font-medium">Sair</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div onClick={() => setMostrarLista(!mostrarLista)} className="cursor-pointer">
          <ResumoCard titulo="Total de Atletas" valor={total} cor="blue" />
        </div>
        <ResumoCard titulo="Em Dia" valor={emDia} cor="green" />
        <ResumoCard titulo="Inadimplentes" valor={inadimplentes.length} cor="red" />
      </div>

      {mostrarLista && (
        <div className="bg-white p-6 rounded-2xl shadow mb-8 border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-blue-900">Lista Geral de Pagamentos</h3>
          <ul className="divide-y">
            {pagamentos.map(p => (
              <li key={p.id} className="py-3 flex justify-between items-center">
                <span className="font-medium">{p.atleta?.nomeCompleto || `Atleta ID: ${p.id}`}</span>
                <div className="flex items-center gap-4">
                  <span className={`font-bold ${p.pago ? 'text-green-600' : 'text-red-600'}`}>
                    {p.pago ? 'PAGO' : 'PENDENTE'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4 text-white-900">Alunos com Pendência</h2>
      <div className="bg-white shadow rounded-2xl overflow-hidden border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Vencimento</th>
              <th className="p-4 text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {inadimplentes.map((p) => {
              const atrasado = isVencido(p.dataVencimento, p.pago);
              return (
                <tr key={p.id} className={`border-t transition-colors ${atrasado ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>
                  <td className="p-4 font-medium">
                    {p.atleta?.nomeCompleto || "Carregando..."}
                    {atrasado && <span className="ml-2 text-[10px] font-bold text-red-600 uppercase border border-red-600 px-1 rounded">Atrasado</span>}
                  </td>
                  <td className={`p-4 ${atrasado ? 'text-red-700 font-bold' : 'text-gray-700'}`}>
                    {formatarData(p.dataVencimento)}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => confirmarPagamento(p.id)} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-bold shadow-sm">
                      Dar Baixa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {inadimplentes.length === 0 && (
            <div className="p-8 text-center text-gray-500">Nenhuma pendência encontrada!</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">Novo Cadastro</h2>
            <CadastroUsuarioForm onClose={() => setIsModalOpen(false)} onSuccess={() => { carregarDados(); setIsModalOpen(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}

function ResumoCard({ titulo, valor, cor }: { titulo: string, valor: number, cor: 'blue' | 'green' | 'red' }) {
  const cores = { 
    blue: 'bg-blue-50 text-blue-800 border-blue-200', 
    green: 'bg-green-50 text-green-800 border-green-200', 
    red: 'bg-red-50 text-red-800 border-red-200' 
  };
  return (
    <div className={`${cores[cor]} p-6 rounded-xl border shadow-sm transition-transform hover:scale-105`}>
      <p className="font-semibold text-sm uppercase opacity-80">{titulo}</p>
      <p className="text-4xl font-bold mt-1">{valor}</p>
    </div>
  );
}