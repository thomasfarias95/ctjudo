"use client";
import { useState } from 'react';

export default function CadastroUsuarioForm({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    papel: 'ALUNO',
    nomeCompleto: '',
    email: '',
    senha: '', // Usada apenas para professor
    telefone: '',
    graduacao: '', // Agora disponível para ambos
    diaVencimento: 10 // Apenas para aluno
  });

  // URL dinâmica para o Render
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Atualizado: trocado localhost pela variável API_URL
      const res = await fetch(`${API_URL}/api/cadastro/novo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert("Cadastro de " + formData.papel.toLowerCase() + " realizado!");
        onSuccess();
      } else {
        const errorMsg = await res.text();
        alert("Erro ao cadastrar: " + errorMsg);
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      alert("Não foi possível conectar ao servidor do CT.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 text-gray-900 bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-blue-900">Novo Registro</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-red-600 font-bold transition">✕</button>
      </div>

      <label className="block text-sm font-medium text-gray-700">Tipo de Cadastro</label>
      <select 
        className="w-full p-3 border rounded-lg bg-gray-50 text-black" 
        value={formData.papel} 
        onChange={(e) => setFormData({...formData, papel: e.target.value})}
      >
        <option value="ALUNO">Aluno</option>
        <option value="PROFESSOR">Professor / Adm</option>
      </select>

      <input 
        className="w-full p-3 border rounded-lg text-black" 
        placeholder="Nome Completo" 
        required 
        onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})} 
      />
      
      <input 
        className="w-full p-3 border rounded-lg text-black" 
        placeholder="E-mail" 
        type="email" 
        onChange={(e) => setFormData({...formData, email: e.target.value})} 
      />
      
      <input 
        className="w-full p-3 border rounded-lg text-black" 
        placeholder="Telefone (ex: 819...)" 
        onChange={(e) => setFormData({...formData, telefone: e.target.value})} 
      />
      
      <input 
        className="w-full p-3 border rounded-lg text-black" 
        placeholder="Graduação (ex: Faixa Preta)" 
        onChange={(e) => setFormData({...formData, graduacao: e.target.value})} 
      />

      {formData.papel === 'PROFESSOR' && (
        <input 
          className="w-full p-3 border rounded-lg text-black bg-blue-50" 
          placeholder="Defina uma Senha" 
          type="password" 
          required
          onChange={(e) => setFormData({...formData, senha: e.target.value})} 
        />
      )}

      {formData.papel === 'ALUNO' && (
        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700">Dia do Vencimento:</label>
          <input 
            type="number" 
            min="1" 
            max="31"
            className="w-20 p-2 border rounded-lg text-black text-center" 
            value={formData.diaVencimento} 
            onChange={(e) => setFormData({...formData, diaVencimento: parseInt(e.target.value)})} 
          />
        </div>
      )}

      <button 
        type="submit" 
        className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-md"
      >
        Confirmar Cadastro
      </button>
    </form>
  );
}