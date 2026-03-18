"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Puxa a URL da Vercel (Production) ou usa o Render como fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Ajustado: agora usa a variável API_URL em vez de localhost
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, senha }),
      });

      if (res.ok) {
        const userData = await res.json();
        
        // Salvamos o objeto completo do usuário no localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redireciona para o Dashboard após o sucesso
        router.push('/dashboard');
      } else if (res.status === 401) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Erro no servidor. Tente novamente mais tarde.');
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      setError('Não foi possível conectar ao servidor. Verifique se o backend está ativo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Acesso ao Sistema</h2>
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        
        <input 
          type="email" 
          placeholder="E-mail" 
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Senha" 
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold transition ${loading ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} text-white`}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}