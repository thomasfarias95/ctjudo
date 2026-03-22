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
        
        if (typeof window !== 'undefined') {
          document.cookie = "auth_token=true; path=/; max-age=28800; SameSite=Lax";
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('isLoggedIn', 'true');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-black font-sans">
      
      {/* Botão Voltar Animado */}
      <div className="w-full max-w-sm mb-6 flex justify-start">
        <Link 
          href="/" 
          className="group flex items-center bg-blue-900 px-5 py-2.5 rounded-xl shadow-lg text-white hover:bg-blue-800 transition-all duration-300 font-bold uppercase text-[11px] tracking-widest active:scale-95 border border-blue-950"
        >
          <span className="mr-2 transform group-hover:-translate-x-1.5 transition-transform duration-300">←</span> 
          Voltar ao Início
        </Link>
      </div>

      <form onSubmit={handleLogin} className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-sm border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="relative p-1 bg-gradient-to-tr from-blue-900 to-blue-500 rounded-full shadow-xl">
            <Image 
              src="/logo.png" 
              alt="Logo CT Ferroviário" 
              width={110} 
              height={110} 
              className="rounded-full bg-white" 
              priority 
            />
          </div>
        </div>

        <h2 className="text-3xl font-black text-center mb-8 text-blue-900 uppercase tracking-tighter leading-tight">
          Acesso do <br/><span className="text-blue-600">Professor</span>
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] text-center mb-6 border border-red-100 font-bold uppercase tracking-wider animate-shake">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="group">
            <input 
              type="email" 
              placeholder="E-mail" 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl text-black font-semibold focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder:text-gray-400"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="group">
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl text-black font-semibold focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 transition-all duration-200 placeholder:text-gray-400"
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              required
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-5 mt-10 rounded-2xl font-black shadow-xl transition-all duration-300 uppercase tracking-widest text-sm active:scale-[0.98] ${
            loading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-900 text-white hover:bg-blue-950 hover:shadow-blue-200 hover:shadow-2xl'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Autenticando...
            </span>
          ) : 'Entrar no Painel'}
        </button>
      </form>
    </div>
  );
}