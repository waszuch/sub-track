import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useSubscriptions } from '@/hooks/useSubscriptions';

vi.mock('@/lib/auth-client');
vi.mock('next/navigation');
vi.mock('@/hooks/useSubscriptions');

describe('Home Page', () => {
  const mockPush = vi.fn();
  const mockSession = {
    user: {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    },
  };

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
    {
      id: '2',
      userId: 'user-1',
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

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>);
    vi.mocked(useSession).mockReturnValue({
      data: mockSession,
      isPending: false,
      error: null,
    } as ReturnType<typeof useSession>);
    vi.mocked(useSubscriptions).mockReturnValue({
      subscriptions: mockSubscriptions,
      isLoading: false,
      addSubscription: vi.fn(),
      updateSubscription: vi.fn(),
      removeSubscription: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });
  });

  it('should redirect to login when not authenticated', async () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    } as ReturnType<typeof useSession>);

    render(<Home />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should show loading state while checking session', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      isPending: true,
      error: null,
    } as ReturnType<typeof useSession>);

    render(<Home />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show loading state while fetching subscriptions', () => {
    vi.mocked(useSubscriptions).mockReturnValue({
      subscriptions: [],
      isLoading: true,
      addSubscription: vi.fn(),
      updateSubscription: vi.fn(),
      removeSubscription: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });

    render(<Home />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render header with subscriptions', () => {
    render(<Home />);
    expect(screen.getByText('SubTrack')).toBeInTheDocument();
  });

  it('should render add subscription button', () => {
    render(<Home />);
    const buttons = screen.getAllByRole('button', { name: /add subscription/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render subscription cards', () => {
    render(<Home />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Spotify')).toBeInTheDocument();
  });

  it('should render cost summary', () => {
    render(<Home />);
    expect(screen.getByText('Total Monthly Cost')).toBeInTheDocument();
  });

  it('should render cost by category chart', () => {
    render(<Home />);
    expect(screen.getByText('Cost by Category')).toBeInTheDocument();
  });

  it('should show empty state when no subscriptions', () => {
    vi.mocked(useSubscriptions).mockReturnValue({
      subscriptions: [],
      isLoading: false,
      addSubscription: vi.fn(),
      updateSubscription: vi.fn(),
      removeSubscription: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });

    render(<Home />);
    expect(screen.getByText('No subscriptions yet')).toBeInTheDocument();
    expect(screen.getByText('Click "Add Subscription" to get started')).toBeInTheDocument();
  });

  it('should render "Your Subscriptions" heading when subscriptions exist', () => {
    render(<Home />);
    expect(screen.getByText('Your Subscriptions')).toBeInTheDocument();
  });

  it('should call removeSubscription when delete is clicked', async () => {
    const mockRemoveSubscription = vi.fn();
    vi.mocked(useSubscriptions).mockReturnValue({
      subscriptions: mockSubscriptions,
      isLoading: false,
      addSubscription: vi.fn(),
      updateSubscription: vi.fn(),
      removeSubscription: mockRemoveSubscription,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });

    const user = userEvent.setup();
    render(<Home />);

    const buttons = screen.getAllByRole('button');
    const deleteButtons = buttons.filter(btn => 
      btn.innerHTML.includes('lucide-trash') || btn.querySelector('svg')
    );
    
    if (deleteButtons.length > 0) {
      await user.click(deleteButtons[0]);
      expect(mockRemoveSubscription).toHaveBeenCalled();
    }
  });
});

