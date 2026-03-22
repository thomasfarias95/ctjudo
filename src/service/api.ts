// service/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. Busca financeiro (existente)
export const getFinanceiro = async (atletaId: string) => {
  const response = await fetch(`${API_URL}/api/financeiro/${atletaId}`);
  if (!response.ok) throw new Error('Erro ao buscar financeiro');
  return response.json();
};

// 2. Download do PDF Técnico (Ajustado para Mobile)
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
    
    // Sanitização do nome do arquivo
    const nomeArquivo = `Ficha_Tecnica_${nomeAtleta.trim().replace(/\s+/g, '_')}.pdf`;
    link.setAttribute('download', nomeArquivo);
    
    document.body.appendChild(link);
    link.click();
    
    // Pequeno delay para garantir o download em navegadores mobile (Chrome/Safari)
    setTimeout(() => {
      link.remove();
      window.URL.revokeObjectURL(url);
    }, 250);

  } catch (error) {
    console.error("Erro no download:", error);
    alert("Erro ao baixar relatório. Verifique se o servidor está ativo.");
  }
};

// 3. Alternar Status Ativo/Inativo
export const updateAtletaStatus = async (id: number, novoStatus: boolean) => {
  try {
    const response = await fetch(`${API_URL}/api/cadastro/atletas/${id}/status?ativo=${novoStatus}`, {
      method: 'PATCH',
    });
    
    if (!response.ok) throw new Error('Erro na resposta do servidor ao atualizar status');
    return await response.json();
  } catch (error) {
    console.error("Erro no PATCH status:", error);
    throw error;
  }
};

// 4. Promover Atleta / Trocar Faixa
export const promoverAtleta = async (id: number, novaGraduacao: string) => {
  try {
    const response = await fetch(`${API_URL}/api/cadastro/atletas/${id}/graduacao`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaGraduacao),
    });

    if (!response.ok) throw new Error('Erro ao promover atleta');
    return await response.json();
  } catch (error) {
    console.error("Erro no PATCH graduação:", error);
    throw error;
  }
};