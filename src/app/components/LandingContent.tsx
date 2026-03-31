'use client';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Teacher from './Teacher';
import Classes from './Classes';
import Contact from './Contact';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

const LandingContent: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Teacher />
        <Classes />
        <Contact />
      </main>
      <WhatsAppButton numero="+5581998264250" />
      <Footer />
    </>
  );
};

export default LandingContent;