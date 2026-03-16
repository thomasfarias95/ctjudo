"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Contact: React.FC = () => {
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.485121272097!2d-34.91262648522254!3d-8.055819794199999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab18a1a1a1a1a1%3A0x1a1a1a1a1a1a1a1a!2sRua%20Mossor%C3%B3%2C%203%20-%20San%20Martin%2C%20Recife%20-%20PE!5e0!3m2!1spt-BR!2sbr!4v1612345678901!5m2!1spt-BR!2sbr";

  return (
    <section id="contact" className="py-16 px-4 bg-gray-900 text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold mb-12 text-judo-orange">Localização e Contato</h2>
        
        <div className="w-full bg-black p-8 rounded-lg shadow-2xl border border-gray-800">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
            <div className="flex items-start space-x-4">
              <div className="text-judo-orange text-2xl mt-1">📍</div>
              <div>
                <h4 className="font-bold text-judo-orange">Endereço</h4>
                <p className="text-white">Rua Mossoró, 3 - San Martin, Recife - PE</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-judo-orange text-2xl mt-1">📞</div>
              <div>
                <h4 className="font-bold text-judo-orange">Telefone / WhatsApp</h4>
                <p className="text-white">(81) 99826-4250</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-judo-orange text-2xl mt-1">✉️</div>
              <div>
                <h4 className="font-bold text-judo-orange">E-mail</h4>
                <p className="text-white break-all">ctferroviario22@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="text-judo-orange text-2xl mt-1">⏰</div>
              <div>
                <h4 className="font-bold text-judo-orange">Atendimento</h4>
                <p className="text-white">Seg-Sex: 08h às 21h<br/>Sáb: 09h às 12h</p>
              </div>
            </div>
          </div>

          {/* Redes Sociais com o cast 'as any' para resolver o erro de tipos */}
          <div className="flex justify-center gap-8 mb-8 border-t border-gray-800 pt-6">
            <a href="https://instagram.com/ctferroviario2022" target="_blank" rel="noopener noreferrer" className="text-white hover:text-judo-orange transition-colors text-3xl">
              <FontAwesomeIcon icon={faInstagram as any} />
            </a>
            <a href="https://wa.me/5581998264250" target="_blank" rel="noopener noreferrer" className="text-white hover:text-judo-orange transition-colors text-3xl">
              <FontAwesomeIcon icon={faWhatsapp as any} />
            </a>
          </div>

          <div className="rounded-lg overflow-hidden shadow-inner border border-gray-700">
            <iframe
              src={mapSrc}
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Localização do CT Ferroviário"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;