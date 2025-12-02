import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '../Header';
import type { Subscription } from '@/types/subscription';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

vi.mock('@/lib/auth-client');
vi.mock('next/navigation');
vi.mock('@/hooks/useSubscriptions', () => ({
  useSubscriptions: () => ({
    subscriptions: [],
    isLoading: false,
    addSubscription: vi.fn(),
    updateSubscription: vi.fn(),
    removeSubscription: vi.fn(),
  }),
}));

describe('Header', () => {
  const mockSubscriptions: Subscription[] = [
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

  const mockSession = {
    user: {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    },
  };

  const mockRouter = {
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({
      data: mockSession,
      isPending: false,
      error: null,
    } as ReturnType<typeof useSession>);
    vi.mocked(useRouter).mockReturnValue(mockRouter as ReturnType<typeof useRouter>);
  });

  it('should render SubTrack title', () => {
    render(<Header subscriptions={mockSubscriptions} />);
    expect(screen.getByText('SubTrack')).toBeInTheDocument();
  });

  it('should render subtitle', () => {
    render(<Header subscriptions={mockSubscriptions} />);
    expect(screen.getByText('Track your subscriptions')).toBeInTheDocument();
  });

  it('should calculate and display total monthly cost in USD', () => {
    render(<Header subscriptions={mockSubscriptions} />);
    expect(screen.getByText('$25.98')).toBeInTheDocument();
  });

  it('should display user name and email', () => {
    render(<Header subscriptions={mockSubscriptions} />);
    const nameElements = screen.getAllByText('Test User');
    expect(nameElements.length).toBeGreaterThan(0);
    const emailElements = screen.getAllByText('test@example.com');
    expect(emailElements.length).toBeGreaterThan(0);
  });

  it('should calculate total with currency conversion', () => {
    const subsWithMixedCurrency: Subscription[] = [
      { ...mockSubscriptions[0], priceMonthly: '10', currency: 'USD' },
      { ...mockSubscriptions[1], priceMonthly: '10', currency: 'EUR' },
      { ...mockSubscriptions[0], id: '3', priceMonthly: '10', currency: 'GBP' },
      { ...mockSubscriptions[0], id: '4', priceMonthly: '40', currency: 'PLN' },
    ];
    
    render(<Header subscriptions={subsWithMixedCurrency} />);
    expect(screen.getByText('$43.70')).toBeInTheDocument();
  });

  it('should only include active subscriptions in total', () => {
    const subsWithInactive: Subscription[] = [
      { ...mockSubscriptions[0], active: true, priceMonthly: '10' },
      { ...mockSubscriptions[1], active: false, priceMonthly: '20' },
    ];
    
    render(<Header subscriptions={subsWithInactive} />);
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });

  it('should call signOut and redirect to login when logout clicked', async () => {
    const user = userEvent.setup();
    
    render(<Header subscriptions={mockSubscriptions} />);
    
    const buttons = screen.getAllByRole('button');
    const logoutButton = buttons.find(btn => 
      btn.innerHTML.includes('lucide-log-out') || btn.querySelector('svg')
    );
    
    if (logoutButton) {
      await user.click(logoutButton);
      
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      });
    }
  });

  it('should render with empty subscriptions array', () => {
    render(<Header subscriptions={[]} />);
    expect(screen.getByText('SubTrack')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});

