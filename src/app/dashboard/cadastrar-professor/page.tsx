"use client";
import { useState } from 'react';

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    papel: 'ALUNO',
    nomeCompleto: '',
    email: '',
    senha: '', 
    numeroZempo: '',
    graduacao: '',
    diaVencimento: 10
  });

  // Puxa a URL da Vercel ou usa o Render como fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'diaVencimento' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ajustado para usar a variável dinâmica do Render
      const res = await fetch(`${API_URL}/api/cadastro/novo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Cadastro realizado com sucesso! Agora você já pode fazer login.");
        // Limpa o formulário após o sucesso
        setFormData({
          papel: 'ALUNO',
          nomeCompleto: '',
          email: '',
          senha: '',
          numeroZempo: '',
          graduacao: '',
          diaVencimento: 10
        });
      } else {
        const errorMsg = await res.text();
        alert("Erro ao cadastrar: " + errorMsg);
      }
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      alert("Erro de conexão com o servidor. Verifique se o backend no Render está ativo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg border max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-900">Novo Cadastro</h2>
      
      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Perfil</label>
      <select 
        name="papel" 
        className="w-full p-2 mb-4 border rounded bg-white text-black" 
        onChange={handleChange} 
        value={formData.papel}
      >
        <option value="ALUNO">Aluno</option>
        <option value="PROFESSOR">Professor</option>
      </select>

      <input 
        name="nomeCompleto" 
        className="w-full p-2 mb-2 border rounded text-black" 
        placeholder="Nome Completo" 
        value={formData.nomeCompleto}
        required 
        onChange={handleChange} 
      />
      
      <input 
        name="email" 
        type="email"
        className="w-full p-2 mb-2 border rounded text-black" 
        placeholder="E-mail" 
        value={formData.email}
        required 
        onChange={handleChange} 
      />
      
      <input 
        name="senha" 
        type="password" 
        className="w-full p-2 mb-2 border rounded text-black" 
        placeholder="Senha de Acesso" 
        value={formData.senha}
        required 
        onChange={handleChange} 
      />

      {formData.papel === 'PROFESSOR' ? (
        <>
          <input 
            name="numeroZempo" 
            className="w-full p-2 mb-2 border rounded text-black" 
            placeholder="Número Zempo" 
            value={formData.numeroZempo}
            onChange={handleChange} 
          />
          <input 
            name="graduacao" 
            className="w-full p-2 mb-2 border rounded text-black" 
            placeholder="Graduação" 
            value={formData.graduacao}
            onChange={handleChange} 
          />
        </>
      ) : (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dia de Vencimento da Mensalidade</label>
          <input 
            name="diaVencimento" 
            type="number" 
            className="w-full p-2 mb-2 border rounded text-black" 
            placeholder="Dia de Vencimento" 
            value={formData.diaVencimento}
            onChange={handleChange} 
          />
        </>
      )}

      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-4"
      >
        Finalizar Cadastro
      </button>
    </form>
  );
}