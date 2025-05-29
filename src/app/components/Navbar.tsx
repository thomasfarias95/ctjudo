"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-judo-blue bg-white text-black p-4 fixed w-full z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Image 
          src="/logo.png" 
          alt={'logo'}
          width={150}
          height={80}
            >
        </Image>
        <Link href="/" className="text-black text-2xl font-bold">
          Equipe CT Ferroviário de Judô
        </Link>

        {/* Botão para Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-black focus:outline-none">
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex space-x-6">
          <Link href="#about" className="text-black  hover:text-judo-orange transition duration-300">
            Sobre Nós
          </Link>
          <Link href="#classes" className="text-black  hover:text-judo-orange transition duration-300">
            Aulas
          </Link>
          
          <Link href="#contact" className="bg-judo-orange text-black  px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300">
            Contato
          </Link>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-judo-blue mt-4">
          <Link href="#about" onClick={() => setIsOpen(false)} className="block text-white px-4 py-2 hover:bg-judo-orange transition duration-300">
            Sobre Nós
          </Link>
          <Link href="#classes" onClick={() => setIsOpen(false)} className="block text-white px-4 py-2 hover:bg-judo-orange transition duration-300">
            Aulas
          </Link>
          
          <Link href="#contact" onClick={() => setIsOpen(false)} className="block bg-judo-orange text-white px-4 py-2 mt-2 rounded-md hover:bg-orange-600 transition duration-300">
            Contato
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;