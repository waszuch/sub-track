import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SubscriptionCard } from '../SubscriptionCard';
import type { Subscription } from '@/types/subscription';

describe('SubscriptionCard', () => {
  const mockSubscription: Subscription = {
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
  };

  const mockOnDelete = vi.fn();

  it('should render subscription name', () => {
    render(<SubscriptionCard subscription={mockSubscription} onDelete={mockOnDelete} />);
    expect(screen.getByText('Netflix')).toBeInTheDocument();
  });

  it('should render price and currency', () => {
    render(<SubscriptionCard subscription={mockSubscription} onDelete={mockOnDelete} />);
    expect(screen.getByText('15.99 USD')).toBeInTheDocument();
  });

  it('should render category badge', () => {
    render(<SubscriptionCard subscription={mockSubscription} onDelete={mockOnDelete} />);
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
  });

  it('should render next payment date', () => {
    render(<SubscriptionCard subscription={mockSubscription} onDelete={mockOnDelete} />);
    expect(screen.getByText('Dec 15, 2024')).toBeInTheDocument();
  });

  it('should not render category badge when category is null', () => {
    const subWithoutCategory = { ...mockSubscription, category: null };
    render(<SubscriptionCard subscription={subWithoutCategory} onDelete={mockOnDelete} />);
    expect(screen.queryByText('Entertainment')).not.toBeInTheDocument();
  });

  it('should not render next payment date when not provided', () => {
    const subWithoutDate = { ...mockSubscription, nextPaymentDate: null };
    render(<SubscriptionCard subscription={subWithoutDate} onDelete={mockOnDelete} />);
    expect(screen.queryByText(/Next payment/)).not.toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<SubscriptionCard subscription={mockSubscription} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should render with different currencies', () => {
    const subWithEUR = { ...mockSubscription, currency: 'EUR', priceMonthly: '12.99' };
    render(<SubscriptionCard subscription={subWithEUR} onDelete={mockOnDelete} />);
    expect(screen.getByText('12.99 EUR')).toBeInTheDocument();
  });
});


