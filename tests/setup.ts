// This file can be used for any global test setup
// For example, extending Jest matchers or setting up test environment variables

import '@testing-library/jest-dom';

beforeAll(() => {
  // Global setup before all tests
});

afterAll(() => {
  // Global cleanup after all tests
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '',
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ src, alt = '', ...props }) => {
    return {
      src,
      alt,
      ...props,
    };
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); 