import Link from 'next/link';
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-judo-blue py-8 px-4 text-white text-center">
 <div className="container mx-auto ">
       <div className="flex-1 mx-auto max-w-2xl justify-center space-x-6 items-center mb-2  p-4   animate-fade-in flex flex-col md:flex-row gap-12 shadow-xl">
          <Image
            src="/cbj.jpg"
            alt="Logo"
            width={180}
            height={100}
            priority
          />
          <Image
            src="/fpeju.jpg"
            alt="Logo"
            width={130}
            height={70}
            priority
          />
          </div>
     
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