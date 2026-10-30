import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

describe('Accessibility & UI Resilience Suite', () => {
  it('renders a WCAG-compliant skip-to-main-content link', () => {
    render(<App />);
    const skipLink = screen.getByRole('link', { name: /Skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders standard semantic landmarks for screen readers', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument(); // <header>
    expect(screen.getByRole('main')).toBeInTheDocument();   // <main id="main-content">
  });

  it('ErrorBoundary gracefully catches child crashes and displays fallback UI', () => {
    // Suppress console.error during expected throw
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const ThrowingComponent = () => {
      throw new Error('Simulated UI Rendering Failure');
    };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Application State Interrupted/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload & Recover State/i })).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
