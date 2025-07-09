import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', href: '/', isRoute: true },
  { label: 'About', href: '#about', isRoute: false },
  { label: 'Services', href: '#services', isRoute: false },
  { label: 'Our Team', href: '/team', isRoute: true },
  { label: 'Contact', href: '#contact', isRoute: false },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/">
              <img
                src="/lovable-uploads/356f7c51-3f64-4d92-96d7-4711e82204e5.png"
                alt="SunEdge Power Logo"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-foreground hover:text-secondary transition-colors duration-200 font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-secondary transition-colors duration-200 font-medium"
                  onClick={(e) => {
                    if (location.pathname !== '/') {
                      e.preventDefault();
                      window.location.href = '/' + item.href;
                    }
                  }}
                >
                  {item.label}
                </a>
              ),
            )}
            <Button variant="secondary" className="ml-4">
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) =>
                item.isRoute ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="text-foreground hover:text-secondary transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-foreground hover:text-secondary transition-colors duration-200 font-medium py-2"
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      if (location.pathname !== '/') {
                        e.preventDefault();
                        window.location.href = '/' + item.href;
                      }
                    }}
                  >
                    {item.label}
                  </a>
                ),
              )}
              <Button variant="secondary" className="mt-4 w-full">
                Get Quote
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
