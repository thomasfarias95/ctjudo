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
        localStorage.setItem('user', JSON.stringify(userData));
        router.push('/dashboard');
      } else if (res.status === 401) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Erro no servidor. Tente novamente mais tarde.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      
      {/* BOTÃO VOLTAR - FONTE BLACK E DESTAQUE */}
      <div className="w-full max-w-sm mb-6 flex justify-start">
        <Link 
          href="/" 
          className="group flex items-center bg-white px-5 py-3 rounded-2xl shadow-md border border-gray-200 text-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300 font-black uppercase text-xs tracking-widest"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> 
          Voltar ao Início
        </Link>
      </div>

      <form onSubmit={handleLogin} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-gray-200">
        
        {/* Logo do CT Ferroviário */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/logo.png" 
            alt="Logo CT Ferroviário"
            width={120}
            height={120}
            className="rounded-full shadow-lg border-4 border-gray-50"
          />
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
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 text-black transition font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1 tracking-widest text-left">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 text-black transition font-bold"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-5 mt-10 rounded-2xl font-black shadow-xl transition-all uppercase tracking-widest text-sm ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 text-white active:scale-95 hover:shadow-blue-200'
          }`}
        >
          {loading ? 'Validando...' : 'Entrar no Painel'}
        </button>

        <p className="text-center text-[10px] font-black text-gray-300 mt-8 uppercase tracking-[0.2em]">
          © 2026 CT Ferroviário
        </p>
      </form>
    </div>
  );
}