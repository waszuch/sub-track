import { vi } from 'vitest';

export const mockSubscriptions = [
  {
    id: '1',
    userId: 'test-user-id',
    name: 'Netflix',
    priceMonthly: '15.99',
    currency: 'USD',
    category: 'Entertainment',
    nextPaymentDate: '2024-12-15',
    active: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    userId: 'test-user-id',
    name: 'Spotify',
    priceMonthly: '9.99',
    currency: 'USD',
    category: 'Music',
    nextPaymentDate: '2024-12-20',
    active: true,
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
];

export const mockUseTRPC = vi.fn(() => ({
  subscriptions: {
    getAll: {
      queryOptions: vi.fn(() => ({
        queryKey: ['subscriptions.getAll'],
        queryFn: vi.fn(() => Promise.resolve(mockSubscriptions)),
      })),
    },
    create: {
      mutationOptions: vi.fn(() => ({
        mutationFn: vi.fn((data) => Promise.resolve({ ...data, id: '3' })),
      })),
    },
    update: {
      mutationOptions: vi.fn(() => ({
        mutationFn: vi.fn(() => Promise.resolve({})),
      })),
    },
    delete: {
      mutationOptions: vi.fn(() => ({
        mutationFn: vi.fn(() => Promise.resolve({ success: true })),
      })),
    },
  },
}));

vi.mock('@/trpc/client', () => ({
  useTRPC: mockUseTRPC,
}));









