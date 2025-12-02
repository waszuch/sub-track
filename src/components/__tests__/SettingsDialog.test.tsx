import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsDialog } from '../SettingsDialog';
import { useSubscriptions } from '@/hooks/useSubscriptions';

vi.mock('@/hooks/useSubscriptions');

describe('SettingsDialog', () => {
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

  const mockAddSubscription = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSubscriptions).mockReturnValue({
      subscriptions: mockSubscriptions,
      isLoading: false,
      addSubscription: mockAddSubscription,
      updateSubscription: vi.fn(),
      removeSubscription: vi.fn(),
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    });
  });

  it('should render settings button', () => {
    render(<SettingsDialog />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should open dialog when button is clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsDialog />);
    
    const settingsButton = screen.getByRole('button');
    await user.click(settingsButton);
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
    });
  });

  it('should render export and import sections', async () => {
    const user = userEvent.setup();
    render(<SettingsDialog />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /export data/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /import data/i })).toBeInTheDocument();
    });
  });

  it('should trigger download when export button is clicked', async () => {
    const user = userEvent.setup();
    const createElementSpy = vi.spyOn(document, 'createElement');
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
    
    render(<SettingsDialog />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('Export Subscriptions')).toBeInTheDocument();
    });
    
    const exportButton = screen.getByText('Export Subscriptions').closest('button')!;
    await user.click(exportButton);
    
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalled();
    
    createElementSpy.mockRestore();
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });

  it('should have hidden file input for import', async () => {
    const user = userEvent.setup();
    render(<SettingsDialog />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /import data/i })).toBeInTheDocument();
    });
    
    const fileInput = document.getElementById('file-import');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', '.json');
  });

  it('should trigger file input when import button is clicked', async () => {
    const user = userEvent.setup();
    render(<SettingsDialog />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('Import Subscriptions')).toBeInTheDocument();
    });
    
    const fileInput = document.getElementById('file-import') as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');
    
    const importButton = screen.getByText('Import Subscriptions').closest('button')!;
    await user.click(importButton);
    
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('should process valid JSON file on import', async () => {
    const user = userEvent.setup();
    render(<SettingsDialog />);
    
    await user.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /import data/i })).toBeInTheDocument();
    });
    
    const fileInput = document.getElementById('file-import') as HTMLInputElement;
    
    const importData = [
      {
        name: 'Test Subscription',
        priceMonthly: '10.99',
        currency: 'USD',
        category: 'Software',
        nextPaymentDate: '2024-12-01',
        active: true,
      },
    ];
    
    const file = new File([JSON.stringify(importData)], 'test.json', { type: 'application/json' });
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(mockAddSubscription).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Subscription',
          priceMonthly: '10.99',
          currency: 'USD',
        })
      );
    });
  });
});

