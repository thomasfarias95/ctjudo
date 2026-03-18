"use client";
import { useEffect, useState, useCallback } from 'react';

// 1. Definição da Interface
interface Pagamento {
  id: number;
  dataVencimento: string;
  valor: number;
  pago: boolean;
}

export default function FaturasPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. URL da API dinâmica ajustada para o seu Render
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  // 3. Função para buscar os pagamentos
  const carregarPagamentos = useCallback(async () => {
    setLoading(true);
    try {
      // Nota: No futuro, o '1' pode ser substituído pelo ID do atleta selecionado
      const res = await fetch(`${API_URL}/api/pagamentos/atleta/1`);
      if (!res.ok) throw new Error("Falha ao buscar faturas");
      const data = await res.json();
      setPagamentos(data);
    } catch (err) {
      console.error("Erro ao buscar pagamentos:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    carregarPagamentos();
  }, [carregarPagamentos]);

  // 4. Função para confirmar o pagamento (Baixa manual)
  const confirmarPagamento = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/pagamentos/confirmar/${id}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        alert("Pagamento confirmado com sucesso!");
        carregarPagamentos();
      } else {
        alert("Erro ao confirmar pagamento no servidor.");
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert("Erro de conexão com o Render.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Gestão de Faturas</h1>
        <button 
          onClick={() => carregarPagamentos()} 
          className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
        >
          Atualizar Lista
        </button>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-gray-500 animate-pulse">Buscando faturas no banco...</p>
        ) : pagamentos.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed rounded-xl">
             <p className="text-gray-500">Nenhum histórico de faturas para este aluno.</p>
          </div>
        ) : (
          pagamentos.map((p) => (
            <div 
              key={p.id} 
              className={`p-5 border rounded-xl shadow-sm transition-all ${
                p.pago ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase">Vencimento</p>
                  <p className="font-bold text-gray-800">{p.dataVencimento}</p>
                  <p className="text-2xl font-black text-blue-900 mt-1">R$ {p.valor.toFixed(2)}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {p.pago ? (
                    <span className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                      <span className="text-xs">✔</span> PAGO
                    </span>
                  ) : (
                    <>
                      <button 
                        onClick={() => confirmarPagamento(p.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-bold shadow-md"
                      >
                        Dar Baixa (Manual)
                      </button>

                      <a 
                        href={`https://wa.me/5581900000000?text=Olá! Identificamos que a mensalidade do CT Ferroviário no valor de R$ ${p.valor.toFixed(2)} (vencida em ${p.dataVencimento}) ainda está pendente. Poderia nos enviar o comprovante?`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-bold flex items-center gap-2 shadow-md"
                      >
                        Cobrar no WhatsApp
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}