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
    senha: '123', 
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
    
    // Se for ALUNO, gera um email interno para o banco não dar erro de "not null"
    const payload = {
      ...formData,
      email: formData.papel === 'ALUNO' && !formData.email 
        ? `aluno_${Date.now()}@ctferroviario.com` 
        : formData.email
    };

    try {
      const res = await fetch(`${API_URL}/api/cadastro/novo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        onSuccess();
      } else {
        const errorMsg = await res.text();
        alert("Erro ao cadastrar: " + errorMsg);
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-black">
      
      {/* SELETOR DE PAPEL */}
      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button 
          type="button"
          onClick={() => setFormData({...formData, papel: 'ALUNO'})}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${formData.papel === 'ALUNO' ? 'bg-white shadow text-blue-900' : 'text-gray-500'}`}
        >
          NOVO ALUNO
        </button>
        <button 
          type="button"
          onClick={() => setFormData({...formData, papel: 'PROFESSOR'})}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${formData.papel === 'PROFESSOR' ? 'bg-white shadow text-blue-900' : 'text-gray-500'}`}
        >
          NOVO PROFESSOR
        </button>
      </div>

      {/* DADOS BÁSICOS (PARA TODOS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
          <input type="text" name="nomeCompleto" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" placeholder="Nome do Judoca ou Professor" />
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

      {/* DADOS LOGÍSTICOS (PARA TODOS, MAS FOCO NO ALUNO) */}
      <div className="space-y-4">
        {formData.papel === 'ALUNO' && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsável (Pai/Mãe)</label>
            <input type="text" name="nomeResponsavel" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="Nome do responsável" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp / Telefone</label>
            <input type="text" name="telefone" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" placeholder="(81) 9...." />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Turno de Aula</label>
            <select name="turno" value={formData.turno} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl text-sm">
              <option value="MANHA">Manhã</option>
              <option value="TARDE">Tarde</option>
              <option value="NOITE">Noite</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Graduação</label>
            <select name="graduacao" onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl text-sm">
              <option value="Branca">Branca</option>
              <option value="Cinza">Cinza</option>
              <option value="Azul">Azul</option>
              <option value="Amarela">Amarela</option>
              <option value="Laranja">Laranja</option>
              <option value="Verde">Verde</option>
              <option value="Roxa">Roxa</option>
              <option value="Marrom">Marrom</option>
              <option value="Preta">Preta</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dia Vencimento</label>
            <input type="number" name="diaVencimento" defaultValue={10} min={1} max={28} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl" />
          </div>
        </div>
      </div>

      {/* ACESSO APENAS PARA PROFESSOR */}
      {formData.papel === 'PROFESSOR' && (
        <div className="bg-blue-50 p-4 rounded-2xl space-y-3">
          <p className="text-[10px] font-bold text-blue-800 uppercase">Credenciais de Acesso ao Painel</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-blue-900 mb-1">E-mail para Login</label>
              <input type="email" name="email" required onChange={handleChange} className="w-full p-2 border border-blue-200 rounded-lg text-sm" placeholder="professor@ctferroviario.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-900 mb-1">Senha</label>
              <input type="text" name="senha" defaultValue="123" onChange={handleChange} className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white" />
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-gray-400 font-bold hover:text-gray-600 transition">
          Cancelar
        </button>
        <button type="submit" className="flex-1 px-4 py-3 bg-blue-900 text-white rounded-2xl font-black shadow-lg hover:bg-blue-800 transition uppercase tracking-wide">
          Salvar {formData.papel === 'ALUNO' ? 'Aluno' : 'Professor'}
        </button>
      </div>
    </form>
  );
}