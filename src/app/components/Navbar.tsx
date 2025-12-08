"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  
  const closeMenu = () => {
    setIsOpen(false);
  };

  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Lista de links para simplificar a renderização
  const navLinks = [
    { href: "#about", label: "Sobre Nós" },
    { href: "#teacher", label: "Sensei" },
    { href: "#classes", label: "Aulas" },
  ];

  return (
    <>
      <nav className="bg-white text-black p-4 fixed w-full z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={250}
              height={100}
              priority
            />
          </Link>

          <Link href="/" className="text-black text-xl font-bold hidden sm:block">
            Equipe CT Ferroviário de Judô
          </Link>

          
          <div className="md:hidden z-50">
            <button
              onClick={toggleMenu}
              className="text-black focus:outline-none w-12 h-12"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              <i className={`fas ${isOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
            </button>
          </div>

          
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-judo-orange transition duration-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="bg-judo-orange text-black px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300"
            >
              Contato
            </Link>
          </div>
        </div>
      </nav>

      
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-judo-blue shadow-xl 
          transform transition-transform duration-300 ease-in-out
          md:hidden z-40 p-6 
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="pt-20 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu} 
              className="text-white text-lg block py-2 hover:bg-judo-orange transition duration-300 rounded-md px-2"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={closeMenu} 
            className="bg-judo-orange text-white text-lg block px-4 py-2 mt-4 rounded-md hover:bg-orange-600 transition duration-300 text-center font-semibold"
          >
            Contato
          </Link>
        </div>
      </div>

      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;