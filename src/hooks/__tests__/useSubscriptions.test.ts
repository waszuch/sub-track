import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSubscriptions } from '../useSubscriptions';
import { useTRPC } from '@/trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/trpc/client');

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSubscriptions', () => {
  const mockSubscriptions = [
    {
      id: '1',
      userId: 'user-1',
      name: 'Netflix',
      priceMonthly: '15.99',
      currency: 'USD',
      category: 'Entertainment',
      nextPaymentDate: '2024-12-15',
      active: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  const mockMutate = vi.fn();
  const mockQueryOptions = vi.fn(() => ({
    queryKey: ['subscriptions.getAll'],
    queryFn: vi.fn(() => Promise.resolve(mockSubscriptions)),
  }));

  const mockMutationOptions = vi.fn(() => ({
    mutationFn: mockMutate,
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTRPC).mockReturnValue({
      subscriptions: {
        getAll: {
          queryOptions: mockQueryOptions,
        },
        create: {
          mutationOptions: mockMutationOptions,
        },
        update: {
          mutationOptions: mockMutationOptions,
        },
        delete: {
          mutationOptions: mockMutationOptions,
        },
      },
    } as any);
  });

  it('should return subscriptions from query', async () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.subscriptions).toEqual(mockSubscriptions);
    });
  });

  it('should have isLoading state', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('isLoading');
  });

  it('should provide addSubscription function', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: createWrapper(),
    });

    expect(result.current.addSubscription).toBeDefined();
    expect(typeof result.current.addSubscription).toBe('function');
  });

  it('should provide updateSubscription function', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: createWrapper(),
    });

    expect(result.current.updateSubscription).toBeDefined();
    expect(typeof result.current.updateSubscription).toBe('function');
  });

  it('should provide removeSubscription function', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: createWrapper(),
    });

    expect(result.current.removeSubscription).toBeDefined();
    expect(typeof result.current.removeSubscription).toBe('function');
  });

  it('should have mutation states', () => {
    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('isCreating');
    expect(result.current).toHaveProperty('isUpdating');
    expect(result.current).toHaveProperty('isDeleting');
  });

  it('should return empty array when no subscriptions', async () => {
    mockQueryOptions.mockReturnValue({
      queryKey: ['subscriptions.getAll'],
      queryFn: vi.fn(() => Promise.resolve([])),
    });

    const { result } = renderHook(() => useSubscriptions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.subscriptions).toEqual([]);
    });
  });
});

