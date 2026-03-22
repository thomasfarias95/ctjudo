import { useState, useEffect } from 'react';
import { downloadRelatorioTecnico, updateAtletaStatus } from '@/service/api';
import { gerarDocumentoAtleta } from './geradorPDF'; // Seu jsPDF local

export default function DashboardAtletas() {
  const [atletas, setAtletas] = useState<any[]>([]);

  // Função para lidar com a mudança de status (Ativar/Desativar)
  const handleToggleStatus = async (id: number, statusAtual: boolean) => {
    try {
      await updateAtletaStatus(id, !statusAtual);
      // Atualiza a lista localmente para refletir a mudança na UI
      setAtletas(atletas.map(a => a.id === id ? { ...a, ativo: !statusAtual } : a));
    } catch (err) {
      alert("Erro ao alterar status.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Gestão CT Ferroviário</h1>
      
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-4">Atleta</th>
              <th className="p-4">Graduação</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {atletas.map((atleta) => (
              <tr key={atleta.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{atleta.nomeCompleto}</td>
                <td className="p-4">{atleta.graduacao}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${atleta.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {atleta.ativo ? 'ATIVO' : 'INATIVO'}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-3">
                  {/* PDF Financeiro (Local) */}
                  <button 
                    onClick={() => gerarDocumentoAtleta(atleta)}
                    className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    title="Cronograma Financeiro"
                  >
                    💰
                  </button>

                  {/* PDF Técnico (Java/Render) */}
                  <button 
                    onClick={() => downloadRelatorioTecnico(atleta.id, atleta.nomeCompleto)}
                    className="p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    title="Relatório Técnico"
                  >
                    🥋
                  </button>

                  {/* Toggle Status */}
                  <button 
                    onClick={() => handleToggleStatus(atleta.id, atleta.ativo)}
                    className={`p-2 rounded text-white ${atleta.ativo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    title={atleta.ativo ? "Desativar" : "Ativar"}
                  >
                    {atleta.ativo ? "OFF" : "ON"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}