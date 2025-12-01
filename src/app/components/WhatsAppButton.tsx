'use client'

import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; 

interface WhatsAppButtonProps {
  numero: string; 
  mensagem?: string; 
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ numero, mensagem }) => {
  // 1. Prepara a URL
  const numeroLimpo = numero.replace(/\D/g, ''); 
  const mensagemCodificada = mensagem ? `?text=${encodeURIComponent(mensagem)}` : '';
  const url = `https://wa.me/${numeroLimpo}${mensagemCodificada}`;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label="Fale conosco pelo WhatsApp"
      className="
        fixed 
        bottom-8 md:bottom-8 
        right-4 md:right-8 
        bg-green-500 
        hover:bg-green-600 
        text-white 
        p-3 md:p-4 
        rounded-full 
        shadow-lg 
        transition-all 
        duration-300 
        flex items-center 
        justify-center 
       z-50 " >
      
      <FontAwesomeIcon icon={faWhatsapp} className="w-8 h-8 md:w-10 md:h-10" />
    </a>
  );
};

export default WhatsAppButton;