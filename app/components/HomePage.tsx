'use client';

import Footer from './Footer';
import Hero from './sections/Hero';
import Mission from './sections/Mission';
import Services from './sections/Services';
import Audiences from './sections/Audiences';
import Partners from './sections/Partners';
import Why from './sections/Why';
import Values from './sections/Values';
import Geography from './sections/Geography';
import Approach from './sections/Approach';
import CTA from './sections/CTA';

type Page = 'home' | 'about' | 'services' | 'corporates' | 'academic' | 'donors' | 'government' | 'contact';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      <Hero onNavigate={onNavigate} />
      <Mission />
      <Services onNavigate={onNavigate} />
      <Audiences onNavigate={onNavigate} />
      <Partners />
      <Why />
      <Values />
      <Geography />
      <Approach />
      <CTA onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
