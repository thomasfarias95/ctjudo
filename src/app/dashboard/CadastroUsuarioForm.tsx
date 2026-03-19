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
    senha: '123', // Senha padrão inicial
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
        alert("Atleta matriculado com sucesso!");
        onSuccess();
      } else {
        alert("Erro ao matricular atleta.");
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      <div>
        <label className="block text-sm font-bold text-gray-700">Nome Completo do Aluno</label>
        <input type="text" name="nomeCompleto" required onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" placeholder="Ex: João Silva" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700">Nascimento</label>
          <input type="date" name="dataNascimento" required onChange={handleChange} className="w-full p-2 border rounded-lg text-black" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700">Sexo</label>
          <select name="sexo" onChange={handleChange} className="w-full p-2 border rounded-lg text-black">
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="O">Outro</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700">Nome do Responsável (Obrigatório para Kids)</label>
        <input type="text" name="nomeResponsavel" required onChange={handleChange} className="w-full p-2 border rounded-lg text-black" placeholder="Nome do Pai ou Mãe" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700">Turno de Treino</label>
          <select name="turno" onChange={handleChange} className="w-full p-2 border rounded-lg text-black">
            <option value="MANHA">Manhã</option>
            <option value="TARDE">Tarde</option>
            <option value="NOITE">Noite</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700">Dia de Vencimento</label>
          <input type="number" name="diaVencimento" defaultValue={10} min={1} max={28} onChange={handleChange} className="w-full p-2 border rounded-lg text-black" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700">WhatsApp / Telefone</label>
        <input type="text" name="telefone" required onChange={handleChange} className="w-full p-2 border rounded-lg text-black" placeholder="(81) 9...." />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700">E-mail (Para Login)</label>
        <input type="email" name="email" required onChange={handleChange} className="w-full p-2 border rounded-lg text-black" placeholder="email@exemplo.com" />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 font-bold transition text-gray-600">
          Cancelar
        </button>
        <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold shadow-md transition">
          Confirmar Matrícula
        </button>
      </div>
    </form>
  );
}