import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Classes from '@/components/Classes';
import Trainers from '@/components/Trainers';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-clover-green">
      <Header />
      <Hero />
      <About />
      <Classes />
      <Trainers />
      <Contact />
      <Footer />
    </main>
  );
}
