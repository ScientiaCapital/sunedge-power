import React, { useState } from 'react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Commercial Solar', href: '#services' },
  { label: 'C&I Solutions', href: '#solutions' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Why Solar', href: '#why' },
  { label: 'Contact', href: '#contact' },
];

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((open) => !open);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-secondary-dark">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center font-bold text-xl text-primary">
          <span className="sr-only">SunEdge Power</span>
          <img src="/favicon.ico" alt="SunEdge Power Logo" className="h-8 w-8 mr-2" />
          SunEdge Power
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-primary hover:text-accent transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-4 px-6 py-2 rounded-full bg-accent text-secondary font-semibold shadow-lg hover:bg-accent-green transition"
          >
            Get a Quote
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex items-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Open menu"
          onClick={handleMenuToggle}
        >
          <span className="sr-only">Open menu</span>
          <svg
            className="h-7 w-7 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-primary text-secondary shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 border-b border-secondary-dark">
          <span className="font-bold text-xl">Menu</span>
          <button
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close menu"
            onClick={handleMenuToggle}
          >
            <svg
              className="h-6 w-6 text-secondary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-6 p-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-lg font-medium hover:text-accent transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-4 px-6 py-2 rounded-full bg-accent text-secondary font-semibold shadow-lg hover:bg-accent-green transition"
            onClick={() => setMenuOpen(false)}
          >
            Get a Quote
          </a>
        </nav>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={handleMenuToggle}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default Navigation;
