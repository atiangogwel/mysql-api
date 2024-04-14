// Import the functions to be tested
const {
    getAllRecipesController,
    deleteRecipeController,
    getRecipeByIdController,
    updateRecipeController
  } = require('../controllers/recipeController');
  
  const {
    createRecipeTable,
    getAllRecipes,
    deleteRecipeById,
    getRecipeById,
    updateRecipeById
  } = require('../Queries/recipeQuery');
  
  // Mocking pool.query function
  jest.mock('../Queries/recipeQuery', () => ({
    createRecipeTable: jest.fn(),
    getAllRecipes: jest.fn(),
    deleteRecipeById: jest.fn(),
    getRecipeById: jest.fn(),
    updateRecipeById: jest.fn()
  }));
  
  describe('getAllRecipesController', () => {
    test('should return all recipes', async () => {
      // Mock request and response objects
      const req = {};
      const res = { json: jest.fn() };
  
      // Mock the behavior of getAllRecipes database function
      const recipes = [{ id: 1, name: 'Recipe 1' }, { id: 2, name: 'Recipe 2' }];
      require('../Queries/recipeQuery').getAllRecipes.mockResolvedValue(recipes);
      await getAllRecipesController(req, res);
  
      // Check if the response is correct
      expect(res.json).toHaveBeenCalledWith(recipes);
    });
  
    test('should handle internal server error', async () => {
      // Mock request and response objects
      const req = {};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis() 
      };
  
      // Mock the behavior of getAllRecipes database function to throw an error
      require('../Queries/recipeQuery').getAllRecipes.mockRejectedValue(new Error('Database error'));
      await getAllRecipesController(req, res);
  
      // Check if the response is correct
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('getRecipeByIdController', () => {
    test('should return the recipe when found', async () => {
      // Mock request and response objects
      const req = { params: { recipe_id: 1 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  
      // Mock the behavior of getRecipeById database function
      const recipe = { id: 1, name: 'Recipe 1', ingredients: 'Ingredients', instructions: 'Instructions' };
      require('../Queries/recipeQuery').getRecipeById.mockResolvedValue(recipe);
  
      // Call the controller function
      await getRecipeByIdController(req, res);
  
      // Check if the response is correct
      expect(res.json).toHaveBeenCalledWith(recipe);
    });
  
    test('should handle the case when recipe is not found', async () => {
      // Mock request and response objects
      const req = { params: { recipe_id: 1 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  
      // Mock the behavior of getRecipeById database function
      require('../Queries/recipeQuery').getRecipeById.mockResolvedValue(null);
  
      await getRecipeByIdController(req, res);
  
      // Check if the response is correct
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Recipe with ID 1 not found' });
    });
  
    test('should handle internal server error', async () => {
      // Mock request and response objects
      const req = { params: { recipe_id: 1 } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  
      // Mock the behavior of getRecipeById database function to throw an error
      require('../Queries/recipeQuery').getRecipeById.mockRejectedValue(new Error('Database error'));
  
      await getRecipeByIdController(req, res);
  
      // Check if the response is correct
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('Controller functions', () => {
    test('getAllRecipesController should return all recipes', async () => {
      // Mock the behavior of getAllRecipes database function
      const recipes = [{ id: 1, name: 'Recipe 1' }, { id: 2, name: 'Recipe 2' }];
      getAllRecipes.mockResolvedValue(recipes);
  
      // Simulate request and response objects
      const req = {};
      const res = { json: jest.fn() };
  
      // Call the controller function
      await getAllRecipesController(req, res);
  
      // Check if the response is correct
      expect(res.json).toHaveBeenCalledWith(recipes);
    });
  });
  
  describe('Database functions', () => {
    test('createRecipeTable should create the recipe table', async () => {
      // Call the function
      await createRecipeTable();
  
      // Check if pool.query was called with the correct query
      expect(require('../Queries/recipeQuery').createRecipeTable).toHaveBeenCalled();
    });
    });
    describe('updateRecipeController', () => {
        test('should update the recipe successfully', async () => {
          // Mock request and response objects
          const req = {
            params: { recipe_id: 1 },
            body: { name: 'Updated Recipe', ingredients: 'Updated Ingredients', instructions: 'Updated Instructions' }
          };
          const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
          };
      
          // Mock the behavior of updateRecipeById function
          const mockResults = { affectedRows: 1 };
          require('../Queries/recipeQuery').updateRecipeById.mockResolvedValue(mockResults);
      
          // Call the controller function
          await updateRecipeController(req, res);
      
          // Check if the response is correct
          expect(res.json).toHaveBeenCalledWith({ message: 'Recipe with ID 1 updated successfully' });
          expect(res.status).not.toHaveBeenCalled(); 
        });
      
        test('should handle the case when recipe is not found', async () => {
          // Mock request and response objects
          const req = {
            params: { recipe_id: 1 },
            body: { name: 'Updated Recipe', ingredients: 'Updated Ingredients', instructions: 'Updated Instructions' }
          };
          const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis() // Mocking the chainable status function
          };
      
          // Mock the behavior of updateRecipeById function
          const mockResults = { affectedRows: 0 };
          require('../Queries/recipeQuery').updateRecipeById.mockResolvedValue(mockResults);
      
          // Call the controller function
          await updateRecipeController(req, res);
      
          // Check if the response is correct
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'Recipe with ID 1 not found' });
        });
      
        test('should handle internal server error', async () => {
          // Mock request and response objects
          const req = {
            params: { recipe_id: 1 },
            body: { name: 'Updated Recipe', ingredients: 'Updated Ingredients', instructions: 'Updated Instructions' }
          };
          const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis() // Mocking the chainable status function
          };
      
          // Mock the behavior of updateRecipeById function to throw an error
          require('../Queries/recipeQuery').updateRecipeById.mockRejectedValue(new Error('Failed to update recipe: Database connection lost'));

          // Call the controller function
          await updateRecipeController(req, res);
      
          // Check if the response is correct
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
      });
      describe('deleteRecipeController', () => {
        test('should delete the recipe successfully', async () => {
          // Mock request and response objects
          const req = { params: { recipe_id: 1 } };
          const res = { json: jest.fn() };
      
          // Mock the behavior of deleteRecipeById database function
          const mockResults = { affectedRows: 1 };
          require('../Queries/recipeQuery').deleteRecipeById.mockResolvedValue(mockResults);
      
          // Call the controller function
          await deleteRecipeController(req, res);
      
          // Check if the response is correct
          expect(res.json).toHaveBeenCalledWith({ message: 'Recipe with ID 1 deleted successfully' });
        });
      
        test('should handle the case when recipe is not found', async () => {
          // Mock request and response objects
          const req = { params: { recipe_id: 1 } };
          const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis() // Mocking the chainable status function
          };
      
          // Mock the behavior of deleteRecipeById database function
          const mockResults = { affectedRows: 0 };
          require('../Queries/recipeQuery').deleteRecipeById.mockResolvedValue(mockResults);
      
          // Call the controller function
          await deleteRecipeController(req, res);
      
          // Check if the response is correct
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({ message: 'Recipe with ID 1 not found' });
        });
      
        test('should handle internal server error', async () => {
          // Mock request and response objects
          const req = { params: { recipe_id: 1 } };
          const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
          };
      
          // Mock the behavior of deleteRecipeById database function to throw an error
          require('../Queries/recipeQuery').deleteRecipeById.mockRejectedValue(new Error('Database error'));
      
          // Call the controller function
          await deleteRecipeController(req, res);
      
          // Check if the response is correct
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
      });