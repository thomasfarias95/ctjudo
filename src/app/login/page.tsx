"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // URL da API (Produção ou Fallback)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, senha }),
      });

      if (res.ok) {
        const userData = await res.json();
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard');
      } else if (res.status === 401) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Erro no servidor. Tente novamente mais tarde.');
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      setError('Não foi possível conectar ao servidor. Verifique o backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      
      {/* Botão para voltar à tela principal */}
      <div className="w-full max-w-sm mb-4">
        <Link href="/" className="text-gray-500 hover:text-blue-900 transition flex items-center font-medium">
          <span className="mr-2">←</span> Voltar para o Início
        </Link>
      </div>

      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200">
        
        {/* Logo do CT Ferroviário */}
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo-ct.png" // Certifique-se que o arquivo está na pasta /public
            alt="Logo CT Ferroviário"
            width={100}
            height={100}
            className="rounded-full shadow-sm"
          />
        </div>

        <h2 className="text-2xl font-black text-center mb-6 text-blue-900 uppercase tracking-tight">
          Acesso Restrito
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-4 border border-red-100">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-black transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-black transition"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 mt-8 rounded-xl font-black shadow-lg transition uppercase tracking-wider ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 text-white active:scale-95'
          }`}
        >
          {loading ? 'Validando...' : 'Entrar no Painel'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 CT Ferroviário de Judô
        </p>
      </form>
    </div>
  );
}