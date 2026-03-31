import axios from 'axios';

// Certifique-se de que na Vercel a variável NEXT_PUBLIC_API_URL 
// seja apenas: https://ct-ferroviario.onrender.com (SEM o /api no final)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

// INTERCEPTOR: Inteligente para não quebrar rotas públicas
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Só adiciona o cabeçalho se o token REALMENTE existir e for válido
  // Isso evita que o Spring Security dê 403 em rotas públicas como /api/professores
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- MÉTODOS DE AUTENTICAÇÃO ---

export const loginSensei = async (credentials: any) => {
  // A rota completa será: baseURL + /api/auth/login
  const response = await api.post('/api/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// --- MÉTODOS DE DADOS ---

// Busca a lista de professores (pública - essencial para carregar as fotos)
export const getProfessores = async () => {
  const response = await api.get('/api/professores');
  return response.data;
};

export const getFinanceiro = async (atletaId: string) => {
  const response = await api.get(`/api/financeiro/${atletaId}`);
  return response.data;
};

// --- MÉTODOS DE ATUALIZAÇÃO E ARQUIVOS ---

export const downloadRelatorioTecnico = async (id: number, nomeAtleta: string) => {
  try {
    const response = await api.get(`/api/cadastro/atletas/${id}/relatorio-pdf`, {
      responseType: 'blob',
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
    alert("Sessão expirada ou erro no servidor. Tente logar novamente.");
  }
};

export const updateAtleta = async (id: number, dados: object) => {
  const response = await api.patch(`/api/cadastro/atletas/${id}`, dados);
  return response.data;
};

export const updateAtletaStatus = async (id: number, ativo: boolean) => {
  const response = await api.patch(`/api/cadastro/atletas/${id}/status`, { ativo });
  return response.data;
};

export default api;