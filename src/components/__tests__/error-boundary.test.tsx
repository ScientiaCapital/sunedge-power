import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../error-boundary';

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console errors in tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
  });

  it('should display error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should not display error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.queryByText('Test error message')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom error page</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom error page')).toBeInTheDocument();
  });

  it('should have Try Again button when error occurs', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    // Verify Try Again button exists and is clickable
    const tryAgainButton = screen.getByText('Try Again');
    expect(tryAgainButton).toBeInTheDocument();

    // The button should be clickable (this will call handleReset internally)
    await user.click(tryAgainButton);

    // Note: In a real implementation, the parent component would need to handle
    // the reset by changing what's rendered inside the error boundary
  });

  it('should navigate home when Go Home is clicked', async () => {
    const user = userEvent.setup();
    const originalLocation = window.location;

    // Mock window.location
    const windowLocation = window as Window & { location: Location };
    delete windowLocation.location;
    windowLocation.location = { ...originalLocation, href: '' } as Location;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    await user.click(screen.getByText('Go Home'));
    expect(window.location.href).toBe('/');

    // Restore window.location
    window.location = originalLocation;
  });

  it('should show contact information', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Need help? Call us at')).toBeInTheDocument();
    expect(screen.getByText('1-888-SUN-EDGE')).toBeInTheDocument();
  });
});
