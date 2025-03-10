// Configuration settings for the application

// JWT settings
export const JWT_SECRET = process.env.JWT_SECRET || 'pokemon-challenge-default-jwt-secret';
export const JWT_EXPIRATION = '24h';  // Token expiration time

// Hardcoded credentials for development - in production, use a database
export const VALID_USERNAME = 'admin';
export const VALID_PASSWORD = 'admin'; 