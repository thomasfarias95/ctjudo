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
    
    // PAYLOAD LIMPO: Sem turno e com isenção para Professor
    const payload = {
      ...formData,
      email: formData.papel === 'ALUNO' && !formData.email 
        ? `aluno_${Date.now()}@ctferroviario.com` 
        : formData.email,
      diaVencimento: formData.papel === 'PROFESSOR' ? null : formData.diaVencimento,
    };

    try {
      const res = await fetch(`${API_URL}/api/cadastro/novo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Cadastro realizado com sucesso! Oss!");
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
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      
      {/* SELETOR DE PERFIL */}
      <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
        <button 
          type="button"
          onClick={() => setFormData({...formData, papel: 'ALUNO'})}
          className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase italic ${formData.papel === 'ALUNO' ? 'bg-blue-900 shadow-lg text-white' : 'text-gray-400'}`}
        >
          Novo Aluno
        </button>
        <button 
          type="button"
          onClick={() => setFormData({...formData, papel: 'PROFESSOR'})}
          className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all uppercase italic ${formData.papel === 'PROFESSOR' ? 'bg-blue-900 shadow-lg text-white' : 'text-gray-400'}`}
        >
          Novo Professor
        </button>
      </div>

      <div className="space-y-3">
        {/* NOME COMPLETO */}
        <div>
          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Nome Completo</label>
          <input type="text" name="nomeCompleto" required onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl font-bold bg-gray-50" placeholder="Nome do Judoca" />
        </div>

        {/* NASCIMENTO E SEXO */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Nascimento</label>
            <input type="date" name="dataNascimento" required onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl text-xs font-bold bg-gray-50" />
          </div>
          <div>
            <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Sexo</label>
            <select name="sexo" onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl text-xs font-bold bg-gray-50">
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
        </div>

        {/* WHATSAPP */}
        <div>
          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">WhatsApp</label>
          <input type="text" name="telefone" required onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl font-bold bg-gray-50" placeholder="(81) 9...." />
        </div>

        {/* CAMPOS ESPECÍFICOS DE ALUNO */}
        {formData.papel === 'ALUNO' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            <div>
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Responsável (Pai/Mãe)</label>
              <input type="text" name="nomeResponsavel" required onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl font-bold bg-gray-50" placeholder="Nome do pai ou mãe" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Graduação</label>
                <select name="graduacao" onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl text-xs font-bold bg-gray-50">
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
                <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Vencimento</label>
                <input type="number" name="diaVencimento" defaultValue={10} min={1} max={31} onChange={handleChange} className="w-full p-4 border border-gray-200 rounded-2xl font-black bg-blue-50 text-blue-900" />
              </div>
            </div>
          </div>
        )}

        {/* CAMPOS ESPECÍFICOS DE PROFESSOR */}
        {formData.papel === 'PROFESSOR' && (
          <div className="p-4 bg-blue-900 rounded-2xl space-y-3 shadow-inner animate-in slide-in-from-bottom-2 duration-300">
            <p className="text-[9px] font-black text-blue-200 uppercase italic">Acesso ao Painel do Sensei</p>
            <input type="email" name="email" required onChange={handleChange} className="w-full p-3 border-none rounded-xl text-sm font-bold bg-white/10 text-white placeholder:text-blue-300" placeholder="e-mail@ctf.com" />
            <div>
              <label className="block text-[8px] font-bold text-blue-300 mb-1 uppercase tracking-tighter">Senha Provisória</label>
              <input type="text" name="senha" defaultValue="123" onChange={handleChange} className="w-full p-3 border-none rounded-xl text-sm font-bold bg-white/10 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onClose} className="flex-1 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest">
          Cancelar
        </button>
        <button type="submit" className="flex- py-4 bg-blue-900 text-white rounded-2xl font-black shadow-xl uppercase italic tracking-widest text-[10px] hover:scale-95 transition-all">
          Salvar {formData.papel === 'ALUNO' ? 'Judoca' : 'Professor'}
        </button>
      </div>
    </form>
  );
}