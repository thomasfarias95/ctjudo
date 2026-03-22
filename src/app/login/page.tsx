"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (res.ok) {
        const userData = await res.json();
        
        // Grava os dados apenas se estiver no navegador
        if (typeof window !== 'undefined') {
          // Grava o cookie e espera um pouco antes de mudar de página
          document.cookie = "auth_token=true; path=/; max-age=28800; SameSite=Lax";
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('isLoggedIn', 'true');
          
          // Redireciona via Next.js Router
          router.push('/dashboard');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Credenciais inválidas.');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-black font-sans">
      
      <div className="w-full max-w-sm mb-6 flex justify-start">
  <Link 
    href="/" 
    className="group flex items-center bg-blue-900 px-6 py-3 rounded-xl shadow-xl text-white hover:bg-blue-800 transition-all duration-300 font-black uppercase text-[10px] tracking-widest active:scale-95 border border-blue-800"
  >
    <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 
    Voltar ao Início
  </Link>
</div>

      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-gray-200">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="Logo" width={120} height={120} className="rounded-full shadow-lg border-4 border-gray-50" priority />
        </div>

        <h2 className="text-3xl font-black text-center mb-8 text-blue-900 uppercase tracking-tighter leading-none">
          Acesso do <br/> Professor
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs text-center mb-6 border border-red-100 font-black uppercase">
            {error}
          </div>
        )}
        
        <div className="space-y-5">
          <input 
            type="email" placeholder="E-mail" 
            className="w-full p-4 border-2 border-gray-100 rounded-2xl text-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-100"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <input 
            type="password" placeholder="Senha" 
            className="w-full p-4 border-2 border-gray-100 rounded-2xl text-black font-bold focus:outline-none focus:ring-4 focus:ring-blue-100"
            value={senha} onChange={(e) => setSenha(e.target.value)} required
          />
        </div>
        
        <button 
          type="submit" disabled={loading}
          className={`w-full py-5 mt-10 rounded-2xl font-black shadow-xl transition-all uppercase tracking-widest text-sm ${
            loading ? 'bg-gray-400' : 'bg-blue-900 text-white hover:bg-blue-800'
          }`}
        >
          {loading ? 'Validando...' : 'Entrar no Painel'}
        </button>
      </form>
    </div>
  );
}