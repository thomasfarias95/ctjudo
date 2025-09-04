import Head from 'next/head';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Classes from './components/Classes';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Teacher from './components/Teacher';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Equipe CT Ferroviario de Judô - Disciplina, Respeito e Superação</title>
        <meta name="description" content="Junte-se à Equipe Bushido Judô! Aulas para todas as idades, desenvolvimento físico e mental. Venha treinar conosco!" />
        <meta name="keywords" content="judô, aulas de judô, equipe de judô, artes marciais, Recife, Pernambuco, crianças, adultos, defesa pessoal" />
      </Head>
      <body className="overflow-x-hidden" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Teacher/>
        <Classes />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
};

export default HomePage;