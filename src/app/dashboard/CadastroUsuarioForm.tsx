"use client";
import { useState } from 'react';

interface CadastroProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CadastroUsuarioForm({ onClose, onSuccess }: CadastroProps) {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '123', // Senha padrão para o primeiro acesso do aluno/pai
    dataNascimento: '',
    sexo: 'M',
    turno: 'MANHA',
    graduacao: 'Branca',
    nomeResponsavel: '',
    telefone: '',
    diaVencimento: 10,
    papel: 'ALUNO'
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ct-ferroviario.onrender.com';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/cadastro/novo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Matrícula realizada com sucesso!");
        onSuccess();
      } else {
        const errorMsg = await res.text();
        alert("Erro ao cadastrar: " + errorMsg);
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert("Erro de conexão com o servidor do Render.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-black">
      {/* Dados do Aluno */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Judoca</label>
          <input type="text" name="nomeCompleto" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="Nome Completo" />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nascimento</label>
          <input type="date" name="dataNascimento" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl text-sm" />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sexo</label>
          <select name="sexo" onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl text-sm">
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Dados de Contato e Logística */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsável (Pai/Mãe)</label>
          <input type="text" name="nomeResponsavel" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="Quem responde pelo aluno?" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp do Responsável</label>
            <input type="text" name="telefone" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="(81) 9...." />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Turno de Aula</label>
            <select name="turno" onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl text-sm">
              <option value="MANHA">Manhã</option>
              <option value="TARDE">Tarde</option>
              <option value="NOITE">Noite</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-2xl">
        <div>
          <label className="block text-xs font-bold text-blue-900 uppercase mb-1">Dia Vencimento</label>
          <input type="number" name="diaVencimento" defaultValue={10} min={1} max={28} onChange={handleChange} className="w-full p-2 border border-blue-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-blue-900 uppercase mb-1">E-mail de Acesso</label>
          <input type="email" name="email" required onChange={handleChange} className="w-full p-2 border border-blue-200 rounded-lg text-sm" placeholder="email@exemplo.com" />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-gray-400 font-bold hover:text-gray-600 transition">
          Cancelar
        </button>
        <button type="submit" className="flex-1 px-4 py-3 bg-blue-900 text-white rounded-2xl font-black shadow-lg hover:bg-blue-800 transition uppercase tracking-wide">
          Salvar Matrícula
        </button>
      </div>
    </form>
  );
}