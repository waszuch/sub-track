import { vi } from 'vitest';

export const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  },
  session: {
    token: 'test-token',
    expiresAt: new Date(Date.now() + 86400000),
  },
};

export const mockUseSession = vi.fn(() => ({
  data: mockSession,
  isPending: false,
  error: null,
}));

export const mockSignIn = {
  email: vi.fn().mockResolvedValue({}),
};

export const mockSignUp = {
  email: vi.fn().mockResolvedValue({}),
};

export const mockSignOut = vi.fn().mockResolvedValue(undefined);

vi.mock('@/lib/auth-client', () => ({
  useSession: mockUseSession,
  signIn: mockSignIn,
  signUp: mockSignUp,
  signOut: mockSignOut,
  authClient: {
    $fetch: vi.fn(),
  },
}));

