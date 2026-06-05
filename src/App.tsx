import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import IntroPreloader from './components/IntroPreloader';

const PortfolioHome = () => {
  return (
    <main
      className="relative w-full"
      style={{ overflowX: 'clip', background: '#0C0C0C' }}
    >
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
};

const App = () => {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      const completed = localStorage.getItem('rahul_wani_intro_complete');
      return completed !== 'true';
    } catch (e) {
      return true;
    }
  });

  const handleIntroComplete = () => {
    try {
      localStorage.setItem('rahul_wani_intro_complete', 'true');
    } catch (e) {
      console.warn('LocalStorage is disabled or full:', e);
    }
    setShowIntro(false);
  };

  return (
    <BrowserRouter>
      {showIntro && <IntroPreloader onComplete={handleIntroComplete} />}
      <Routes>
        {/* Guest Entry Gateways */}
        <Route path="/" element={<PortfolioHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
