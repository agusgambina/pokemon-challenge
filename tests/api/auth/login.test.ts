import { POST } from '@/app/api/auth/login/route';
import jwt from 'jsonwebtoken';
import { findUserByUsername, verifyPassword } from '@/lib/services/userService';
import { JWT_SECRET, JWT_EXPIRATION } from '@/lib/config';

// Mock the external dependencies
jest.mock('@/lib/services/userService');
jest.mock('jsonwebtoken');

describe('Login Route Handler', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock user data
  const mockUser = {
    id: '123',
    username: 'testuser',
    password: 'hashedpassword'
  };

  // Test for missing credentials
  it('should return 400 if username or password is missing', async () => {
    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser' }) // Missing password
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  // Test for invalid username
  it('should return 401 if user is not found', async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue(null);

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'nonexistent', password: 'password123' })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid username or password');
  });

  // Test for invalid password
  it('should return 401 if password is incorrect', async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue(mockUser);
    (verifyPassword as jest.Mock).mockResolvedValue(false);

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'wrongpassword' })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid username or password');
  });

  // Test for successful login
  it('should return 200 with token for valid credentials', async () => {
    (findUserByUsername as jest.Mock).mockResolvedValue(mockUser);
    (verifyPassword as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mock.jwt.token');

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'correctpassword' })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.token).toBe('mock.jwt.token');
    expect(data.user).toEqual({
      username: mockUser.username,
      id: mockUser.id
    });

    // Verify JWT token generation
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        username: mockUser.username,
        userId: mockUser.id
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Verify cookie is set
    const headers = response.headers;
    expect(headers.get('Set-Cookie')).toContain('token=mock.jwt.token');
    expect(headers.get('Set-Cookie')).toContain('HttpOnly');
    expect(headers.get('Set-Cookie')).toContain('SameSite=Strict');
  });

  // Test for server error
  it('should return 500 if an error occurs', async () => {
    (findUserByUsername as jest.Mock).mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'testuser', password: 'password123' })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});