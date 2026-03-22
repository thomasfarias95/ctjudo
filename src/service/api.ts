// service/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. Busca financeiro (existente)
export const getFinanceiro = async (atletaId: string) => {
  const response = await fetch(`${API_URL}/api/financeiro/${atletaId}`);
  return response.json();
};

// 2. Download do PDF Técnico (Novo - Vem do Java no Render)
export const downloadRelatorioTecnico = async (id: number, nomeAtleta: string) => {
  try {
    const response = await fetch(`${API_URL}/api/cadastro/atletas/${id}/relatorio-pdf`);
    if (!response.ok) throw new Error('Erro ao gerar PDF Técnico');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Ficha_Tecnica_${nomeAtleta.replace(/\s+/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Erro ao baixar o relatório técnico.");
  }
};

// 3. Alternar Status Ativo/Inativo (Novo - PATCH)
export const updateAtletaStatus = async (id: number, novoStatus: boolean) => {
  const response = await fetch(`${API_URL}/api/cadastro/atletas/${id}/status?ativo=${novoStatus}`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Erro ao atualizar status');
  return response.json();
};

// 4. Promover Atleta / Trocar Faixa (Novo - PATCH)
export const promoverAtleta = async (id: number, novaGraduacao: string) => {
  const response = await fetch(`${API_URL}/api/cadastro/atletas/${id}/graduacao`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novaGraduacao),
  });
  if (!response.ok) throw new Error('Erro ao promover atleta');
  return response.json();
};