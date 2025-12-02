import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../page';
import { signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

vi.mock('@/lib/auth-client');
vi.mock('next/navigation');

describe('RegisterPage', () => {
  const mockPush = vi.fn();
  const mockSignUp = { email: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>);
    vi.mocked(signUp).email = mockSignUp.email;
  });

  it('should render registration form', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText('Start tracking your subscriptions today')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should render create account button', () => {
    render(<RegisterPage />);
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should render link to login page', () => {
    render(<RegisterPage />);
    const link = screen.getByRole('link', { name: /sign in/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    mockSignUp.email.mockResolvedValue({});
    
    render(<RegisterPage />);
    
    await user.type(screen.getByLabelText(/^name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(mockSignUp.email).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should show error message on registration failure', async () => {
    const user = userEvent.setup();
    mockSignUp.email.mockRejectedValue(new Error('Email already exists'));
    
    render(<RegisterPage />);
    
    await user.type(screen.getByLabelText(/^name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  it('should show password requirement hint', () => {
    render(<RegisterPage />);
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
  });

  it('should have proper input types', () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/^name/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');
  });

  it('should have proper placeholders', () => {
    render(<RegisterPage />);
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });
});

