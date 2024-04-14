const { JSDOM } = require('jsdom');

// Initialize JSDOM
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;
// the function to be tested
const { authenticateUser } = require('../Queries/authQuery');

// Mock the dependencies
jest.mock('../dbConfig', () => ({
  query: jest.fn()
}));
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

describe('authenticateUser', () => {
  test('should authenticate user successfully', async () => {
    // Mock the database query to return user data
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
    require('../dbConfig').query.mockImplementation((query, values, callback) => {
      callback(null, [mockUser]);
    });
    // Mock bcrypt comparison to return true
    require('bcrypt').compare.mockImplementation((password, hashedPassword, callback) => {
      callback(null, true);
    });

    // Call the authenticateUser function
    const user = await authenticateUser('test@example.com', 'password');

    // Check if the user object is returned
    expect(user).toEqual(mockUser);
  });

  test('should return null if user does not exist', async () => {
    // Mock the database query to return empty result
    require('../dbConfig').query.mockImplementation((query, values, callback) => {
      callback(null, []);
    });
    const user = await authenticateUser('nonexistent@example.com', 'password');
    expect(user).toBeNull();
  });

  test('should return null if password is incorrect', async () => {
    // Mock the database query to return user data
    const mockUser = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
    require('../dbConfig').query.mockImplementation((query, values, callback) => {
      callback(null, [mockUser]);
    });
    // Mock bcrypt comparison to return false
    require('bcrypt').compare.mockImplementation((password, hashedPassword, callback) => {
      callback(null, false);
    });

    const user = await authenticateUser('test@example.com', 'incorrectPassword');
    // Check if null is returned
    expect(user).toBeNull();
  });

  test('should handle database error', async () => {
    // Mock the database query to return an error
    const mockError = new Error('Database error');
    require('../dbConfig').query.mockImplementation((query, values, callback) => {
      callback(mockError, null);
    });    await expect(authenticateUser('test@example.com', 'password')).rejects.toThrowError('Database error');
  });
});
