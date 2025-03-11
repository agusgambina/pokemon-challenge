import { POST } from '@/app/api/auth/logout/route';
import { NextResponse } from 'next/server';

describe('Logout Route Handler', () => {
  // Mock NextResponse
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully handle logout request', async () => {
    // Mock NextResponse.json
    const jsonMock = jest.spyOn(NextResponse, 'json');

    const response = await POST();

    // Verify response status and body
    expect(jsonMock).toHaveBeenCalledWith(
      { success: true },
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
        }
      }
    );

    expect(response.status).toBe(200);
  });

  it('should handle errors appropriately', async () => {
    // Mock console.error to avoid cluttering test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Mock NextResponse.json to throw an error
    jest.spyOn(NextResponse, 'json').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const response = await POST();

    // Verify error handling
    expect(consoleSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error));
    expect(response.status).toBe(500);
    
    // Clean up
    consoleSpy.mockRestore();
  });
});