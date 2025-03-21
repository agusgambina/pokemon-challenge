export const cookies = () => ({
  get: jest.fn(),
  getAll: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
});

export const headers = () => new Headers(); 