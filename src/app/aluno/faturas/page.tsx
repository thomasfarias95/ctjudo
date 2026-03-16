"use client";
import { useEffect, useState, useCallback } from 'react';

// 1. Definição da Interface para evitar o erro de 'any'
interface Pagamento {
  id: number;
  dataVencimento: string;
  valor: number;
  pago: boolean;
}

export default function FaturasPage() {
  // 2. Estado tipado corretamente
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);

  // 3. URL da API dinâmica (Usa variável de ambiente ou localhost como fallback)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // 4. Função para buscar os pagamentos (usando useCallback para evitar avisos do React)
  const carregarPagamentos = useCallback(async () => {
    try {
      // Ajuste o ID '1' para ser dinâmico no futuro se necessário
      const res = await fetch(`${API_URL}/api/pagamentos/atleta/1`);
      if (!res.ok) throw new Error("Falha ao buscar dados");
      const data = await res.json();
      setPagamentos(data);
    } catch (err) {
      console.error("Erro ao buscar pagamentos:", err);
    }
  }, [API_URL]);

  useEffect(() => {
    carregarPagamentos();
  }, [carregarPagamentos]);

  // 5. Função para confirmar o pagamento
  const confirmarPagamento = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/pagamentos/confirmar/${id}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        carregarPagamentos();
      } else {
        alert("Erro ao confirmar pagamento.");
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Gestão de Faturas</h1>
      
      <div className="space-y-4">
        {pagamentos.length === 0 && (
          <p className="text-gray-500">Nenhum pagamento encontrado.</p>
        )}
        
        {pagamentos.map((p) => (
          <div 
            key={p.id} 
            className={`p-4 border rounded-xl shadow-sm transition-all ${
              p.pago ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <p className="font-semibold text-gray-700">Vencimento: {p.dataVencimento}</p>
                <p className="text-lg font-bold">Valor: R$ {p.valor.toFixed(2)}</p>
                <p className={`font-bold mt-1 ${p.pago ? 'text-green-600' : 'text-red-600'}`}>
                  {p.pago ? "● Pago" : "○ Pendente"}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {!p.pago && (
                  <>
                    <button 
                      onClick={() => confirmarPagamento(p.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Confirmar Recebimento
                    </button>

                    <a 
                      href={`https://wa.me/5581900000000?text=Olá, sua mensalidade de R$ ${p.valor.toFixed(2)} vencida em ${p.dataVencimento} ainda consta em aberto. Poderia verificar, por favor?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2"
                    >
                      Cobrar no WhatsApp
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}