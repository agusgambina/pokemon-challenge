// Auth utilities for API-based authentication
import { setCookie, deleteCookie } from 'cookies-next';

interface User {
  username: string;
}

// Hardcoded credentials for development
const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'admin';

// Check if credentials are valid
export function validateCredentials(username: string, password: string): boolean {
  return username === VALID_USERNAME && password === VALID_PASSWORD;
}

// Get the current user by checking with the API
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Login the user via API
export async function login(username: string, password: string): Promise<boolean> {
  try {
    // Call login API endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // Include cookies in the response
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    
    // Store token in client-side cookie as a backup (this will be set by the server too)
    // This is just for redundancy
    if (data.token) {
      setCookie('token', data.token, { 
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day in seconds
        sameSite: 'strict' 
      });
    }
    
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

// Logout the user via API
export async function logout(): Promise<void> {
  try {
    // Call logout API endpoint
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies in the request
    });
    
    // Delete the token from client-side cookies (redundant, as the server will do this too)
    deleteCookie('token', { path: '/' });
  } catch (error) {
    console.error('Logout error:', error);
  }
} 