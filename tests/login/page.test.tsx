import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import Login from '@/app/login/page';
import { useAuth } from '@/components/AuthProvider';
import '@testing-library/jest-dom';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the AuthProvider
jest.mock('@/components/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe('Login Page', () => {
  const mockPush = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Setup default auth mock
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      user: null,
      loading: false,
    });
  });

  it('renders login form correctly', () => {
    render(<Login />);
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByAltText(/pokémon logo/i)).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/username and password are required/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('handles user input correctly', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'password123');

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('handles successful login', async () => {
    mockLogin.mockResolvedValueOnce(true);
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    expect(screen.queryByText(/invalid username or password/i)).not.toBeInTheDocument();
  });

  it('handles failed login', async () => {
    mockLogin.mockResolvedValueOnce(false);
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/invalid username or password/i)).toBeInTheDocument();
  });

  it('handles login error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Network error'));
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/an error occurred. please try again/i)).toBeInTheDocument();
  });

  it('shows loading state during login', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 100)));
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/logging in.../i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(/login/i);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  it('redirects to home if user is already logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { username: 'testuser' },
      loading: false,
    });

    render(<Login />);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('does not redirect while auth is loading', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
    });

    render(<Login />);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
