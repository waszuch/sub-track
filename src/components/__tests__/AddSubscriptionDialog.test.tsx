import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddSubscriptionDialog } from '../AddSubscriptionDialog';

describe('AddSubscriptionDialog', () => {
  const mockOnAdd = vi.fn();

  it('should render trigger button', () => {
    render(<AddSubscriptionDialog onAdd={mockOnAdd} />);
    expect(screen.getByRole('button', { name: /add subscription/i })).toBeInTheDocument();
  });

  it('should open dialog when trigger button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddSubscriptionDialog onAdd={mockOnAdd} />);
    
    const triggerButton = screen.getByRole('button', { name: /add subscription/i });
    await user.click(triggerButton);
    
    await waitFor(() => {
      expect(screen.getByText('Add New Subscription')).toBeInTheDocument();
    });
  });

  it('should render all form fields', async () => {
    const user = userEvent.setup();
    render(<AddSubscriptionDialog onAdd={mockOnAdd} />);
    
    await user.click(screen.getByRole('button', { name: /add subscription/i }));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/monthly price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/currency/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next payment date/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<AddSubscriptionDialog onAdd={mockOnAdd} />);
    
    await user.click(screen.getByRole('button', { name: /add subscription/i }));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });
    
    await user.type(screen.getByLabelText(/name/i), 'Netflix');
    await user.type(screen.getByLabelText(/monthly price/i), '15.99');
    await user.type(screen.getByLabelText(/next payment date/i), '2024-12-15');
    
    const submitButton = screen.getByRole('button', { name: /add subscription$/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Netflix',
          priceMonthly: '15.99',
          currency: 'USD',
          active: true,
        })
      );
    });
  });

  it('should close dialog on cancel', async () => {
    const user = userEvent.setup();
    render(<AddSubscriptionDialog onAdd={mockOnAdd} />);
    
    await user.click(screen.getByRole('button', { name: /add subscription/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Add New Subscription')).toBeInTheDocument();
    });
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Add New Subscription')).not.toBeInTheDocument();
    });
  });

  it('should have default currency as USD', async () => {
    const user = userEvent.setup();
    render(<AddSubscriptionDialog onAdd={mockOnAdd} />);
    
    await user.click(screen.getByRole('button', { name: /add subscription/i }));
    
    await waitFor(() => {
      const currencyTrigger = screen.getByRole('combobox', { name: /currency/i });
      expect(currencyTrigger).toHaveTextContent('USD');
    });
  });
});

