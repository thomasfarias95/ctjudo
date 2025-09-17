"use client";
import React, { useState } from "react";
import { sendEmail } from "../components/service/emails";
import { FormData } from "../components/types/FormData";



const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    user_name: "",
    user_email: "",
    user_phone: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  // Validação dos campos obrigatórios
  if (!formData.user_name || !formData.user_email || !formData.message) {
    setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
    setIsLoading(false);
    setTimeout(() => setErrorMessage(""), 5000);
    return;
  }

  try {
    await sendEmail(formData);
    setIsSent(true);
    setFormData({
      user_name: "",
      user_email: "",
      user_phone: "",
      message: "",
    });
    setTimeout(() => setIsSent(false), 5000);
  } catch (error) {
    console.error("Erro ao enviar:", error);
    setErrorMessage("Ocorreu um erro ao enviar sua mensagem.");
    setTimeout(() => setErrorMessage(""), 5000);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <section id="contact" className="py-16 px-4 bg-judo-blue text-black">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold mb-12 text-white">
          Entre em Contato Conosco!
        </h2>

        {isSent && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md animate-fade-in">
             Sua mensagem foi enviada com sucesso!
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md animate-fade-in">
             {errorMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 text-left">
          {/* Localização e Contato */}
          <div className="flex-1 bg-white p-8 rounded-lg shadow-xl text-judo-dark-gray">
            <h3 className="text-2xl font-semibold mb-6 text-judo-orange">
              Localização e Contato
            </h3>
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

          {/* Formulário */}
          <div className="flex-1 bg-white p-8 rounded-lg shadow-xl text-judo-dark-gray">
            <h3 className="text-2xl font-semibold mb-6 text-judo-orange">
              Envie-nos uma Mensagem
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="user_name" className="block text-lg font-medium mb-2">
                  Nome Completo:
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judo-blue"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="user_email" className="block text-lg font-medium mb-2">
                  E-mail:
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judo-blue"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="user_phone" className="block text-lg font-medium mb-2">
                  Telefone (Opcional):
                </label>
                <input
                  type="tel"
                  id="user_phone"
                  name="user_phone"
                  value={formData.user_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judo-blue"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-lg font-medium mb-2">
                  Sua Mensagem:
                </label>
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
                disabled={isLoading}
                className={`w-full bg-judo-orange text-black px-8 py-4 rounded-full text-lg font-semibold transition duration-300 shadow-lg transform ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-orange-600 hover:scale-105"
                }`}
              >
                {isLoading ? "Enviando..." : "Enviar Mensagem"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;