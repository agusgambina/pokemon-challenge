import { GET } from '@/app/api/auth/user/route';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/lib/config';
import { cookies } from 'next/headers';

// Mock the next/headers module
jest.mock('next/headers', () => ({
  cookies: jest.fn()
}));

describe('GET /api/auth/user', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user data when valid token is provided', async () => {
    // Create a test token
    const testUser = { username: 'testuser' };
    const token = jwt.sign(testUser, JWT_SECRET);

    // Mock cookies().get() to return our test token
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: token })
    };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    // Make the request
    const response = await GET();
    const data = await response.json();

    // Verify the response
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);
    expect(data).toEqual({
      user: {
        username: 'testuser'
      }
    });
  });

  it('should return 401 when token is missing', async () => {
    // Mock cookies().get() to return undefined
    const mockCookieStore = {
      get: jest.fn().mockReturnValue(undefined)
    };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    // Make the request
    const response = await GET();
    const data = await response.json();

    // Verify the response
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(401);
    expect(data).toEqual({ user: null });
  });

  it('should return 401 when token is invalid', async () => {
    // Mock cookies().get() to return an invalid token
    const mockCookieStore = {
      get: jest.fn().mockReturnValue({ value: 'invalid-token' })
    };
    (cookies as jest.Mock).mockReturnValue(mockCookieStore);

    // Make the request
    const response = await GET();
    const data = await response.json();

    // Verify the response
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(401);
    expect(data).toEqual({ user: null });
  });

  it('should return 500 when an unexpected error occurs', async () => {
    // Mock cookies() to throw an error
    (cookies as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    // Make the request
    const response = await GET();
    const data = await response.json();

    // Verify the response
    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Internal server error' });
  });
});