import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock canvas-confetti for headless test runner
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});
