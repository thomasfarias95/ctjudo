"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "#about", label: "Sobre Nós" },
    { href: "#teacher", label: "Sensei" },
    { href: "#classes", label: "Aulas" },
  ];

  return (
    <>
      {/* Adicionei h-20 para garantir uma altura fixa e previsível */}
      <nav className="bg-white/95 backdrop-blur-sm text-black p-4 fixed w-full z-50 shadow-md h-20 flex items-center">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" onClick={closeMenu}>
            <Image
              src="/logo.png"
              alt="Logo CT Ferroviário"
              width={180}
              height={60}
              priority
              className="w-auto h-12" // Altura controlada para não quebrar o layout
            />
          </Link>

          <Link href="/" className="text-black text-lg font-bold hidden lg:block">
            Equipe CT Ferroviário de Judô
          </Link>

          {/* Botão Mobile */}
          <div className="md:hidden z-50">
            <button
              onClick={toggleMenu}
              className="text-black p-2 focus:outline-none"
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium hover:text-judo-orange transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="bg-judo-orange text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 shadow-md"
            >
              Contato
            </Link>
          </div>
        </div>
      </nav>

      {/* IMPORTANTE: No seu arquivo principal (page.tsx ou layout.tsx), 
        o componente que vem logo abaixo da Navbar DEVE ter um padding-top.
        Exemplo: 
        <main className="pt-20"> 
          <Hero />
        </main>
      */}
    </>
  );
};

export default Navbar;