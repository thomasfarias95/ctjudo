"use client";
import { useState } from 'react';

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    papel: 'ALUNO',
    nomeCompleto: '',
    email: '',
    senha: '', // Adicionado campo senha para ambos
    numeroZempo: '',
    graduacao: '',
    diaVencimento: 10
  });

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
      const res = await fetch('http://localhost:8080/api/cadastro/novo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
      } else {
        const errorMsg = await res.text();
        alert("Erro ao cadastrar: " + errorMsg);
      }
    } catch (err) {
      alert("Erro de conexão com o servidor. Verifique o backend.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg border max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Novo Cadastro</h2>
      
      <select name="papel" className="w-full p-2 mb-4 border rounded" onChange={handleChange} value={formData.papel}>
        <option value="ALUNO">Aluno</option>
        <option value="PROFESSOR">Professor</option>
      </select>

      <input name="nomeCompleto" className="w-full p-2 mb-2 border rounded" placeholder="Nome Completo" required onChange={handleChange} />
      <input name="email" className="w-full p-2 mb-2 border rounded" placeholder="E-mail" required onChange={handleChange} />
      <input name="senha" type="password" className="w-full p-2 mb-2 border rounded" placeholder="Senha de Acesso" required onChange={handleChange} />

      {formData.papel === 'PROFESSOR' ? (
        <>
          <input name="numeroZempo" className="w-full p-2 mb-2 border rounded" placeholder="Número Zempo" onChange={handleChange} />
          <input name="graduacao" className="w-full p-2 mb-2 border rounded" placeholder="Graduação" onChange={handleChange} />
        </>
      ) : (
        <input name="diaVencimento" type="number" className="w-full p-2 mb-2 border rounded" placeholder="Dia de Vencimento" onChange={handleChange} />
      )}

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Cadastrar</button>
    </form>
  );
}