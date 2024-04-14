// Import controller functions
const {
  createUserController,
  getAllUsersController,
  updateUserController
} = require('../controllers/userContoller');

// Import query functions
const { createUser, getAllUsers, updateUser } = require('../Queries/userQuery');

// Mock dependencies
jest.mock('../Queries/userQuery');

describe('createUserController', () => {
  test('should create a new user successfully', async () => {
    const req = { body: { name: 'Test User', email: 'test@example.com', password: 'password' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const mockResults = { insertId: 1 };
    createUser.mockResolvedValueOnce(mockResults);

    await createUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully', userID: 1 });
  });

  test('should handle internal server error when creating user', async () => {
    const req = { body: { name: 'Test User', email: 'test@example.com', password: 'password' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const mockError = new Error('Database error');
    createUser.mockRejectedValueOnce(mockError);

    await createUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('getAllUsersController', () => {
  test('should get all users successfully', async () => {
    const req = {};
    const res = { json: jest.fn() };

    const mockUsers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
    getAllUsers.mockResolvedValueOnce(mockUsers);

    await getAllUsersController(req, res);

    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  test('should handle internal server error when fetching users', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const mockError = new Error('Database error');
    getAllUsers.mockRejectedValueOnce(mockError);

    await getAllUsersController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('updateUserController', () => {
  test('should update user successfully', async () => {
    const req = { params: { userID: 1 }, body: { name: 'Updated User' } };
    const res = {
      json: jest.fn()
    };

    const mockResult = { token: 'newToken' };
    updateUser.mockResolvedValueOnce(mockResult);

    await updateUserController(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'User with ID 1 updated successfully', token: 'newToken' });
  });

  test('should handle user not found when updating user', async () => {
    const req = { params: { userID: 1 }, body: { name: 'Updated User' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    updateUser.mockResolvedValueOnce(null);

    await updateUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User with ID 1 not found' });
  });

  test('should handle internal server error when updating user', async () => {
    const req = { params: { userID: 1 }, body: { name: 'Updated User' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const mockError = new Error('Database error');
    updateUser.mockRejectedValueOnce(mockError);

    await updateUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
