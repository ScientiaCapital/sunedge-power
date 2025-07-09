import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeEnv } from './lib/env-validation';

// Validate environment variables before starting the app
try {
  initializeEnv();
} catch (error) {
  console.error('Failed to initialize environment:', error);
  // Show error in development
  if (import.meta.env.DEV) {
    document.body.innerHTML = `
      <div style="padding: 20px; background: #fee; color: #c00; font-family: monospace;">
        <h1>Environment Configuration Error</h1>
        <pre>${error instanceof Error ? error.message : 'Unknown error'}</pre>
        <p>Please check your .env file and ensure all required variables are set.</p>
      </div>
    `;
    throw error;
  }
}

createRoot(document.getElementById('root')!).render(<App />);
