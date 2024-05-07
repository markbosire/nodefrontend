import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Why from '../components/Why';
import Footer from '../components/Footer';
import Break from '../components/Break';

function LandingPage() {
  return (
    <div className='LP'>
      <Navbar />
      <Hero id="hero" />
      <Break />
      <Why id="why" />
      <Break />

      <Footer />
    </div>
  );
}

export default LandingPage;
