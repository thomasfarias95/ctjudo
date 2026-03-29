import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Criamos uma instância do Axios
const api = axios.create({
  baseURL: API_URL,
});

// INTERCEPTOR: Antes de qualquer requisição, ele coloca o Token no Header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Login (Para salvar o token pela primeira vez)
export const loginSensei = async (credentials: any) => {
  const response = await api.post('/api/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// 2. Busca financeiro
export const getFinanceiro = async (atletaId: string) => {
  const response = await api.get(`/api/financeiro/${atletaId}`);
  return response.data;
};

// 3. Download do PDF Técnico (Usando Blob no Axios)
export const downloadRelatorioTecnico = async (id: number, nomeAtleta: string) => {
  try {
    const response = await api.get(`/api/cadastro/atletas/${id}/relatorio-pdf`, {
      responseType: 'blob', // Essencial para arquivos
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const nomeArquivo = `Ficha_Tecnica_${nomeAtleta.trim().replace(/\s+/g, '_')}.pdf`;
    link.setAttribute('download', nomeArquivo);
    
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro no download:", error);
    alert("Sua sessão pode ter expirado. Tente logar novamente.");
  }
};

// 4. Alternar Status e Promover (Usando o PATCH unificado)
export const updateAtleta = async (id: number, dados: object) => {
  try {
    const response = await api.patch(`/api/cadastro/atletas/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar atleta:", error);
    throw error;
  }
};

export const updateAtletaStatus = async (id: number, ativo: boolean) => {
  try {
    const response = await api.patch(`/api/cadastro/atletas/${id}/status`, { ativo });
    return response.data;
  } catch (error) {
    console.error("Erro ao mudar status:", error);
    throw error;
  }
};

export default api;