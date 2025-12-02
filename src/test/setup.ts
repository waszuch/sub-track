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
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => {
      const { children, ...rest } = props;
      return { type: 'div', props: rest, children };
    },
  },
  AnimatePresence: (props: any) => props.children,
}));

// Mock recharts
vi.mock('recharts', () => ({
  PieChart: (props: any) => ({ type: 'PieChart', props }),
  Pie: (props: any) => ({ type: 'Pie', props }),
  Cell: (props: any) => ({ type: 'Cell', props }),
  ResponsiveContainer: (props: any) => ({ type: 'ResponsiveContainer', props }),
  Legend: (props: any) => ({ type: 'Legend', props }),
  Tooltip: (props: any) => ({ type: 'Tooltip', props }),
}));

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

