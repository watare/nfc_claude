import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Global test setup
beforeAll(async () => {
  // Setup test database, mocks, etc.
});

afterAll(async () => {
  // Cleanup after all tests
});

beforeEach(() => {
  // Reset state before each test
});

afterEach(() => {
  // Cleanup after each test
});