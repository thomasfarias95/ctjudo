"use client";
import React, { useState } from 'react';


const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  // Estado para exibir o status do envio (sucesso/erro)
  const [status, setStatus] = useState('');

  // Lida com a mudança nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lida com o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página
    setStatus('Enviando...'); // Atualiza o status para "Enviando..."

    try {
      // Faz uma requisição POST para a API Route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indica que o corpo da requisição é JSON
        },
        body: JSON.stringify(formData), // Converte os dados do formulário para JSON
      });

      const data = await response.json(); // Analisa a resposta JSON

      if (response.ok) {
        // Se a resposta for bem-sucedida (status 2xx)
        setStatus('Mensagem enviada com sucesso!');
        setFormData({ name: '', email: '',phone:'', message: '' }); // Limpa o formulário
      } else {
        // Se houver um erro na resposta da API
        setStatus(`Erro: ${data.message || 'Ocorreu um erro desconhecido.'}`);
      }
    } catch (error) {
      // Lida com erros de rede ou outros erros durante a requisição
      console.error('Erro ao enviar o formulário:', error);
      setStatus('Erro ao conectar com o servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <section id="contact" className="py-16 px-4 bg-judo-blue text-black">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold mb-12 text-white">Entre em Contato Conosco!</h2>
        <div className="flex flex-col md:flex-row gap-8 text-left">
          {/* Informações de Contato */}
          <div className="flex-1 bg-white p-8 rounded-lg shadow-xl text-judo-dark-gray">
            <h3 className="text-2xl font-semibold mb-6 text-judo-orange">Localização e Contato</h3>
            <p className="flex items-center mb-4 text-lg">
              <i className="fas fa-map-marker-alt text-judo-blue mr-3 text-xl"></i>
              Rua Mossoró, 3 - Bairro de San Martin, Recife - PE
            </p>
            <p className="flex items-center mb-4 text-lg">
              <i className="fas fa-phone text-judo-blue mr-3 text-xl"></i>
              (81) 998264250
            </p>
            <p className="flex items-center mb-4 text-lg">
              <i className="fas fa-envelope text-judo-blue mr-3 text-xl"></i>
              ctferroviario22@gmail.com
            </p>
            <p className="flex items-center text-lg">
              <i className="fas fa-clock text-judo-blue mr-3 text-xl"></i>
              Horário de Atendimento: Seg-Sex 08h-21h, Sáb 09h-12h
            </p>
            <div className="mt-8 rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.3119464256783!2d-34.92730609999999!3d-8.069630799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab19356abc2ce7%3A0x9d207724608e12ca!2sR.%20Mossor%C3%B3%2C%203%20-%20San%20Martin%2C%20Recife%20-%20PE%2C%2050761-290!5e0!3m2!1spt-BR!2sbr!4v1748286405256!5m2!1spt-BR!2sbr"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="flex-1 bg-white p-8 rounded-lg shadow-xl text-judo-dark-gray">
            <h3 className="text-2xl font-semibold mb-6 text-judo-orange">Envie-nos uma Mensagem</h3>
            <form onSubmit={handleSubmit} action="/submit-form" method="POST">
            <input type="hidden" name="access_key" value="6423db76-2cbd-4a67-bc60-bc98cfce112d" />
              <div className="mb-4">
                <label htmlFor="name" className="block text-lg font-medium mb-2">Nome Completo:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judo-blue"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-medium mb-2">E-mail:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judo-blue"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-lg font-medium mb-2">Telefone (Opcional):</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judo-blue"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-lg font-medium mb-2">Sua Mensagem:</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judo-blue resize-y"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-judo-orange text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-lg transform hover:scale-105"
              >
                Enviar Mensagem
              </button>
              {status}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;