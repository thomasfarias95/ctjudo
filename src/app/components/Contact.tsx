"use client";



const Contact: React.FC = () => {









  return (
    <section id="contact" className="py-16 px-4 bg-judo-blue text-black">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold mb-12 text-white">
          Localização e Contato
        </h2>
        <div className="flex flex-col items-center">
          
          <div className="flex-1 bg-white p-8 rounded-lg shadow-xl text-judo-dark-gray ">
            
            <p className="flex items-center mb-4 text-lg text-center">
              <i className="fas fa-map-marker-alt text-judo-blue mr-3 text-xl "></i>
              Rua Mossoró, 3 - Bairro de San Martin, Recife - PE
            </p>
            <p className="flex items-center mb-4 text-lg text-center">
              <i className="fas fa-phone text-judo-blue mr-3 text-xl "></i>
              (81) 998264250
            </p>
            <p className="flex items-center mb-4 text-lg text-center">
              <i className="fas fa-envelope text-judo-blue mr-3 text-xl "></i>
              ctferroviario22@gmail.com
            </p>
            <p className="flex items-center text-lg text-center">
              <i className="fas fa-clock text-judo-blue mr-3 text-xl "></i>
              Horário de Atendimento: Seg-Sex 08h-21h, Sáb 09h-12h
            </p>
            <div className="mt-15 rounded-lg overflow-hidden shadow-md">
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

         
         
        </div>
      </div>
    </section>
  );
};

export default Contact;