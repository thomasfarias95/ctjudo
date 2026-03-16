"use client";
import { useEffect, useState } from 'react';

export default function FaturasPage() {
  const [pagamentos, setPagamentos] = useState([]);

  // Função para buscar os pagamentos do backend
  const carregarPagamentos = () => {
    fetch('http://localhost:8080/api/pagamentos/atleta/1')
      .then(res => res.json())
      .then(data => setPagamentos(data))
      .catch(err => console.error("Erro ao buscar pagamentos:", err));
  };

  useEffect(() => {
    carregarPagamentos();
  }, []);

  // Função para confirmar o pagamento (baixa no sistema)
  const confirmarPagamento = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/pagamentos/confirmar/${id}`, {
        method: 'PUT',
      });
      
      if (response.ok) {
        // Recarrega a lista para atualizar o status na tela
        carregarPagamentos();
      } else {
        alert("Erro ao confirmar pagamento.");
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gestão de Faturas</h1>
      <div className="space-y-4">
        {pagamentos.map((p: any) => (
          <div key={p.id} className={`p-4 border rounded shadow-sm ${p.pago ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Vencimento: {p.dataVencimento}</p>
                <p>Valor: R$ {p.valor}</p>
                <p className={`font-bold ${p.pago ? 'text-green-600' : 'text-red-600'}`}>
                  {p.pago ? "Status: Pago" : "Status: Pendente"}
                </p>
              </div>
              
              <div className="flex gap-2">
                {!p.pago && (
                  <>
                    {/* Botão de Baixa Automática */}
                    <button 
                      onClick={() => confirmarPagamento(p.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Confirmar Recebimento
                    </button>

                    {/* Botão de Cobrança WhatsApp */}
                    <a 
                      href={`https://wa.me/55NUMERO_DO_ALUNO?text=Olá, sua mensalidade de R$ ${p.valor} venceu em ${p.dataVencimento}. Poderia verificar o pagamento?`}
                      target="_blank"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
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