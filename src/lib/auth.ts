// Simple authentication utilities
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

// Get the current user from localStorage
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Login the user
export function login(username: string, password: string): boolean {
  if (!validateCredentials(username, password)) return false;
  
  localStorage.setItem('user', JSON.stringify({ username }));
  return true;
}

// Logout the user
export function logout(): void {
  localStorage.removeItem('user');
} 