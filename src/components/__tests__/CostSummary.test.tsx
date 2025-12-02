import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CostSummary } from '../CostSummary';
import type { Subscription } from '@/types/subscription';

describe('CostSummary', () => {
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

  it('should render title', () => {
    render(<CostSummary subscriptions={mockSubscriptions} />);
    expect(screen.getByText('Total Monthly Cost')).toBeInTheDocument();
  });

  it('should calculate and display total cost', () => {
    render(<CostSummary subscriptions={mockSubscriptions} />);
    expect(screen.getByText('$25.98')).toBeInTheDocument();
  });

  it('should display subscription count - plural', () => {
    render(<CostSummary subscriptions={mockSubscriptions} />);
    expect(screen.getByText('2 active subscriptions')).toBeInTheDocument();
  });

  it('should display subscription count - singular', () => {
    render(<CostSummary subscriptions={[mockSubscriptions[0]]} />);
    expect(screen.getByText('1 active subscription')).toBeInTheDocument();
  });

  it('should group and display costs by currency', () => {
    const mixedCurrencySubs: Subscription[] = [
      { ...mockSubscriptions[0], priceMonthly: '15.99', currency: 'USD' },
      { ...mockSubscriptions[1], priceMonthly: '9.99', currency: 'EUR' },
    ];
    
    render(<CostSummary subscriptions={mixedCurrencySubs} />);
    expect(screen.getByText('15.99 USD')).toBeInTheDocument();
    expect(screen.getByText('9.99 EUR')).toBeInTheDocument();
  });

  it('should handle multiple subscriptions with same currency', () => {
    render(<CostSummary subscriptions={mockSubscriptions} />);
    expect(screen.getByText('25.98 USD')).toBeInTheDocument();
  });

  it('should convert currencies to USD for total', () => {
    const mixedCurrencySubs: Subscription[] = [
      { ...mockSubscriptions[0], priceMonthly: '10', currency: 'USD' },
      { ...mockSubscriptions[1], priceMonthly: '10', currency: 'EUR' },
    ];
    
    render(<CostSummary subscriptions={mixedCurrencySubs} />);
    // USD: 10, EUR: 10*1.1=11, Total: 21
    expect(screen.getByText('$21.00')).toBeInTheDocument();
  });

  it('should only include active subscriptions', () => {
    const subsWithInactive: Subscription[] = [
      { ...mockSubscriptions[0], active: true, priceMonthly: '10' },
      { ...mockSubscriptions[1], active: false, priceMonthly: '20' },
    ];
    
    render(<CostSummary subscriptions={subsWithInactive} />);
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });

  it('should handle empty subscriptions array', () => {
    render(<CostSummary subscriptions={[]} />);
    expect(screen.getByText('$0.00')).toBeInTheDocument();
    expect(screen.getByText('0 active subscriptions')).toBeInTheDocument();
  });

  it('should render DollarSign icon', () => {
    const { container } = render(<CostSummary subscriptions={mockSubscriptions} />);
    const icon = container.querySelector('.lucide-dollar-sign');
    expect(icon).toBeInTheDocument();
  });
});


