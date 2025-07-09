import React from 'react';

const HeroSection = () => (
  <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center bg-black">
    {/* Background image */}
    <img
      src="/commercial-solar-hero.jpg"
      srcSet="/commercial-solar-hero.jpg 1200w, /commercial-solar-hero-mobile.jpg 600w"
      alt="Commercial solar installation"
      className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
      loading="eager"
      aria-hidden="true"
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
    {/* Content */}
    <div className="relative z-10 flex flex-col items-center text-center px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-secondary drop-shadow-lg mb-4 animate-fade-in">
        Powering America’s Businesses with Solar
      </h1>
      <p className="text-lg md:text-2xl text-secondary/80 mb-8 max-w-2xl animate-fade-in delay-100">
        Commercial & Industrial Solar Solutions for a Sustainable Future
      </p>
      <a
        href="#contact"
        className="px-8 py-3 rounded-full bg-accent text-secondary font-semibold text-lg shadow-lg hover:bg-accent-green transition animate-fade-in delay-200"
      >
        Get a Quote
      </a>
    </div>
  </section>
);

export default HeroSection;
