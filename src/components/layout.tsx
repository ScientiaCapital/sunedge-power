import { ReactNode, useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // Add keyboard navigation detection
  useEffect(() => {
    let keyboardNavigation = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        keyboardNavigation = true;
        document.body.classList.add('keyboard-navigating');
      }
    };

    const handleMouseDown = () => {
      if (keyboardNavigation) {
        keyboardNavigation = false;
        document.body.classList.remove('keyboard-navigating');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      {/* Skip to main content link for screen readers and keyboard users */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Main content area with proper landmark */}
      <main id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
    </>
  );
};

export default Layout;
