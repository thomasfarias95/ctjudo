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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/cadastro/novo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        onSuccess();
      } else {
        alert("Erro ao cadastrar.");
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 text-gray-900 bg-white">
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-red-600 font-bold">X Fechar</button>
      </div>

      <select className="w-full p-3 border rounded-lg" value={formData.papel} onChange={(e) => setFormData({...formData, papel: e.target.value})}>
        <option value="ALUNO">Aluno</option>
        <option value="PROFESSOR">Professor</option>
      </select>

      <input className="w-full p-3 border rounded-lg" placeholder="Nome Completo" required onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})} />
      <input className="w-full p-3 border rounded-lg" placeholder="E-mail" type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <input className="w-full p-3 border rounded-lg" placeholder="Telefone" onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
      
      {/* Graduação agora aparece para ambos */}
      <input className="w-full p-3 border rounded-lg" placeholder="Graduação" onChange={(e) => setFormData({...formData, graduacao: e.target.value})} />

      {/* Senha aparece apenas para professor */}
      {formData.papel === 'PROFESSOR' && (
        <input className="w-full p-3 border rounded-lg" placeholder="Senha" type="password" onChange={(e) => setFormData({...formData, senha: e.target.value})} />
      )}

      {/* Dia de Vencimento apenas para aluno */}
      {formData.papel === 'ALUNO' && (
        <div className="flex items-center gap-2">
          <label>Dia de Vencimento:</label>
          <input type="number" className="w-20 p-2 border rounded-lg" value={formData.diaVencimento} onChange={(e) => setFormData({...formData, diaVencimento: parseInt(e.target.value)})} />
        </div>
      )}

      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Confirmar Cadastro</button>
    </form>
  );
}