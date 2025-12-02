import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    pathname: '/',
    query: {},
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({
    theme: 'light',
    setTheme: vi.fn(),
    themes: ['light', 'dark'],
  })),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const React = await import('react');
  return {
    motion: {
      div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => 
        React.createElement('div', props, children),
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
  };
});

// Mock recharts
vi.mock('recharts', async () => {
  const React = await import('react');
  return {
    PieChart: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) =>
      React.createElement('div', { 'data-testid': 'pie-chart', ...props }, children),
    Pie: (props: { [key: string]: unknown }) =>
      React.createElement('div', { 'data-testid': 'pie', ...props }),
    Cell: (props: { [key: string]: unknown }) =>
      React.createElement('div', { 'data-testid': 'cell', ...props }),
    ResponsiveContainer: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) =>
      React.createElement('div', { 'data-testid': 'responsive-container', ...props }, children),
    Legend: (props: { [key: string]: unknown }) =>
      React.createElement('div', { 'data-testid': 'legend', ...props }),
    Tooltip: (props: { [key: string]: unknown }) =>
      React.createElement('div', { 'data-testid': 'tooltip', ...props }),
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Global fetch mock to avoid AbortSignal issues with better-auth
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: async () => ({}),
    text: async () => '',
    headers: new Headers(),
    status: 200,
    statusText: 'OK',
  } as Response)
);

