import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Classes from './components/Classes';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Teacher from './components/Teacher';


export const metadata: Metadata = {
  title: 'Equipe CT Ferroviario de Judô - Disciplina, Respeito e Superação',
  description: 'Junte-se à Equipe Bushido Judô! Aulas para todas as idades, desenvolvimento físico e mental. Venha treinar conosco!',
  keywords: ['judô', 'aulas de judô', 'equipe de judô', 'artes marciais', 'Recife', 'Pernambuco', 'crianças', 'adultos', 'defesa pessoal'],
};


const HomePage: React.FC = () => {
  return (
    <>
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