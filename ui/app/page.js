'use client';

import { useRef, useState } from 'react';
import Header from '../components/home/Header';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import Showcase from '../components/home/Showcase';
import Testimonials from '../components/home/Testimonials';
import Footer from '../components/home/Footer';
import LoginModal from '../components/LoginModal';

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const footerRef = useRef(null);

  const handleScrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="flex flex-col min-h-screen">
      <Header onContactClick={handleScrollToFooter} />
      <div className="flex-grow">
        <Hero onOpenLogin={() => setIsLoginOpen(true)} />
        <HowItWorks />
        <Showcase />
        <Testimonials />
      </div>
      <div ref={footerRef}>
        <Footer />
      </div>
      <LoginModal isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </main>
  );
}