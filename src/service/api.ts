// service/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

// 1. Busca financeiro
export const getFinanceiro = async (atletaId: string) => {
  const response = await fetch(`${API_URL}/api/financeiro/${atletaId}`);
  if (!response.ok) throw new Error('Erro ao buscar financeiro');
  return response.json();
};

// 2. Download do PDF Técnico (Sincronizado com o novo Controller)
export const downloadRelatorioTecnico = async (id: number, nomeAtleta: string) => {
  try {
    const response = await fetch(`${API_URL}/api/cadastro/atletas/${id}/relatorio-pdf`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });

    if (!response.ok) throw new Error('Erro ao gerar PDF Técnico no servidor');

    const blob = await response.blob();
    if (blob.size === 0) throw new Error('Arquivo PDF vazio');

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const nomeArquivo = `Ficha_Tecnica_${nomeAtleta.trim().replace(/\s+/g, '_')}.pdf`;
    link.setAttribute('download', nomeArquivo);
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      link.remove();
      window.URL.revokeObjectURL(url);
    }, 250);

  } catch (error) {
    console.error("Erro no download:", error);
    alert("Erro ao baixar relatório. Verifique se o servidor está ativo.");
  }
};

// 3. Alternar Status Ativo/Inativo (Ajustado para o Patch principal do Controller)
export const updateAtletaStatus = async (id: number, novoStatus: boolean) => {
  try {
    const response = await fetch(`${API_URL}/api/cadastro/atletas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: novoStatus }), // Enviando como objeto para o Java mapear
    });
    
    if (!response.ok) throw new Error('Erro ao atualizar status');
    return true; 
  } catch (error) {
    console.error("Erro no PATCH status:", error);
    throw error;
  }
};

// 4. Promover Atleta / Trocar Faixa (Ajustado para o Patch principal)
export const promoverAtleta = async (id: number, novaGraduacao: string) => {
  try {
    const response = await fetch(`${API_URL}/api/cadastro/atletas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ graduacao: novaGraduacao }),
    });

    if (!response.ok) throw new Error('Erro ao promover atleta');
    return true;
  } catch (error) {
    console.error("Erro no PATCH graduação:", error);
    throw error;
  }
};