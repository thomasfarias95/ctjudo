import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-judo-blue py-8 px-4 text-white text-center">
      <div className="container mx-auto">
        <p className="text-sm md:text-base mb-4">
          © {new Date().getFullYear()} Equipe CT Ferroviário Judô. Todos os direitos reservados.
        </p>
        <div className="flex justify-center space-x-6">
          <a href="https://www.instagram.com/ctferroviario2022" target="_blank" rel="noopener noreferrer" className="text-white hover:text-judo-orange transition duration-300">
            <i className="fab fa-instagram text-3xl"></i>
          </a>
        
          <a href="https://wa.me/5581998264250" target="_blank" rel="noopener noreferrer" className="text-white hover:text-judo-orange transition duration-300">
            <i className="fab fa-whatsapp text-3xl"></i>
          </a>
          {/* Adicione outros links de redes sociais aqui */}
        </div>
        <div className="mt-6 text-sm text-gray-300">
          <Link href="/politica-de-privacidade" className="hover:underline mx-2">
            Política de Privacidade
          </Link>
          <Link href="/termos-de-uso" className="hover:underline mx-2">
            Termos de Uso
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;