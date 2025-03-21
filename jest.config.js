const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^next/navigation$': '<rootDir>/tests/__mocks__/nextNavigation.ts',
    '^next/server$': '<rootDir>/tests/__mocks__/nextServer.ts',
    '^next/headers$': '<rootDir>/tests/__mocks__/nextHeaders.ts',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!next)/',
  ],
}; 