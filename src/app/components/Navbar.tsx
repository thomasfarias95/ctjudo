"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  // Alterado para caminhos absolutos (/#id) para funcionar a partir de qualquer página
  const navLinks = [
    { href: "/#about", label: "Sobre Nós" },
    { href: "/#teacher", label: "Sensei" }, // Verifique se o ID na Home é 'teacher'
    { href: "/#classes", label: "Aulas" },
    { href: "/#contact", label: "Contato" },
    { href: "/login", label: "Área Restrita" }, // Adicionado para facilitar o acesso
  ];

  return (
    <>
      <nav className="bg-white text-black p-4 fixed top-0 w-full z-[60] shadow-md h-20 flex items-center">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link href="/" onClick={closeMenu}>
            <Image
              src="/logo.png"
              alt="Logo CT Ferroviário"
              width={180}
              height={60}
              priority
              className="w-auto h-12"
            />
          </Link>

          <Link href="/" className="text-black text-lg font-bold hidden lg:block">
            Equipe CT Ferroviário de Judô
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium hover:text-orange-600 transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Botão Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-black p-2 focus:outline-none z-[100] relative" 
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? (
                <svg className="w-9 h-9 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Overlay Escuro */}
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden z-[70] ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
          onClick={closeMenu}
        />

        {/* Menu Lateral (Drawer) */}
        <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[80] md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col p-8 pt-28 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-2xl font-bold text-gray-900 hover:text-orange-600 border-b border-gray-100 pb-4 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;