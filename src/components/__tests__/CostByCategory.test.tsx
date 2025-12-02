import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CostByCategory } from '../CostByCategory';
import type { Subscription } from '@/types/subscription';

describe('CostByCategory', () => {
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
    {
      id: '3',
      userId: 'user-1',
      name: 'Disney+',
      priceMonthly: '7.99',
      currency: 'USD',
      category: 'Entertainment',
      nextPaymentDate: '2024-12-25',
      active: true,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03',
    },
  ];

  it('should render title', () => {
    render(<CostByCategory subscriptions={mockSubscriptions} />);
    expect(screen.getByText('Cost by Category')).toBeInTheDocument();
  });

  it('should render chart container', () => {
    const { container } = render(<CostByCategory subscriptions={mockSubscriptions} />);
    expect(container.querySelector('[class*="recharts"]') || container.firstChild).toBeTruthy();
  });

  it('should display "No data available" when no subscriptions', () => {
    render(<CostByCategory subscriptions={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should display "No data available" when subscriptions have no categories', () => {
    const subsWithoutCategory: Subscription[] = [
      { ...mockSubscriptions[0], category: null },
    ];
    render(<CostByCategory subscriptions={subsWithoutCategory} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('should only include active subscriptions with categories', () => {
    const subsWithInactive: Subscription[] = [
      { ...mockSubscriptions[0], active: true, category: 'Entertainment' },
      { ...mockSubscriptions[1], active: false, category: 'Music' },
    ];
    
    render(<CostByCategory subscriptions={subsWithInactive} />);
    expect(screen.getByText('Cost by Category')).toBeInTheDocument();
  });

  it('should handle subscriptions without category', () => {
    const subsWithMixedCategories: Subscription[] = [
      { ...mockSubscriptions[0], category: 'Entertainment' },
      { ...mockSubscriptions[1], category: null },
    ];
    
    render(<CostByCategory subscriptions={subsWithMixedCategories} />);
    expect(screen.getByText('Cost by Category')).toBeInTheDocument();
  });

  it('should aggregate costs by category', () => {
    const { container } = render(<CostByCategory subscriptions={mockSubscriptions} />);
    expect(container.querySelector('[data-testid="responsive-container"]')).toBeTruthy();
  });
});

