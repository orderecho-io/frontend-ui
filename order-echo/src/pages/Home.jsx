import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/hero/HeroSection';
import HowItWorks from '../components/features/HowItWorks';
import BenefitsSection from '../components/features/BenefitsSection';
import LeadCaptureForm from '../components/forms/LeadCaptureForm';

export default function Home() {
  const scrollToGetStarted = () => {
    const element = document.getElementById('get-started');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onGetStarted={scrollToGetStarted} />
      
      <main>
        <HeroSection onGetStarted={scrollToGetStarted} />
        
        <div id="how-it-works">
          <HowItWorks onGetStarted={scrollToGetStarted} />
        </div>
        
        <div id="benefits">
          <BenefitsSection />
        </div>
        
        <LeadCaptureForm />
      </main>
      
      <Footer />
    </div>
  );
}
