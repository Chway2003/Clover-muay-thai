import Header from '@/components/Header';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Clover Muay Thai | Dublin 6',
  description: 'Contact Clover Muay Thai at 14 Miltown Road, Dublin 6 D06 AK57. Professional Muay Thai training in Dublin. Call +353 83 372 6141 or email clovermuaythai@gmail.com',
  keywords: 'Clover Muay Thai, Dublin, Miltown Road, Muay Thai training, martial arts, Dublin 6, D06 AK57',
  openGraph: {
    title: 'Contact Clover Muay Thai - Dublin 6',
    description: 'Visit us at 14 Miltown Road, Dublin 6 D06 AK57 for professional Muay Thai training',
    type: 'website',
    locale: 'en_IE',
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-clover-green">
      <Header />
      <Contact />
      <Footer />
    </main>
  );
}
