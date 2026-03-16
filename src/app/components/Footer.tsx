import Link from 'next/link';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-judo-blue py-12 px-4 text-white text-center">
      <div className="container mx-auto max-w-4xl">
        
        {/* Logos das Federações */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10 p-6 bg-white/5 rounded-2xl">
          <Image src="/cbj.jpg" alt="Logo CBJ" width={160} height={80} className="object-contain" />
          <Image src="/fpeju.jpg" alt="Logo FPEJU" width={100} height={50} className="object-contain" />
        </div>
        
        {/* Redes Sociais */}
        <div className="flex justify-center space-x-8 mb-8">
          <a 
            href="https://www.instagram.com/ctferroviario2022" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-judo-orange transition-colors duration-300"
            aria-label="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram as any} className="w-8 h-8" />
          </a>

          <a 
            href="https://wa.me/5581998264250" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-judo-orange transition-colors duration-300"
            aria-label="WhatsApp"
          >
            <FontAwesomeIcon icon={faWhatsapp as any} className="w-8 h-8" />
          </a>
        </div>

        {/* Links Legais e Área do Professor */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300 mb-6">
          <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">
            Política de Privacidade
          </Link>
          <Link href="/termos-de-uso" className="hover:text-white transition-colors">
            Termos de Uso
          </Link>
          {/* Link da Área do Professor adicionado abaixo */}
          <Link href="/login" className="hover:text-judo-orange font-semibold transition-colors">
            Área do Professor
          </Link>
        </div>

        <p className="text-sm md:text-base text-gray-400">
          © {new Date().getFullYear()} Equipe CT Ferroviário Judô. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;