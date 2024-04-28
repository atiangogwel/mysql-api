const {getReviewsWithReviewerController,AddRecipeReviewController,getRecipesByUserIdController,updateRecipeController,AddRecipeController, getAllRecipesController,deleteRecipeController,getRecipeByIdController } = require('../controllers/recipeController'); 
const {getReviewsWithReviewer,AddRecipeReview,getRecipesByUserId,updateRecipeById,getRecipeById,deleteRecipeById, AddRecipe, getAllRecipes } = require('../Queries/recipeQuery'); 

// Mock the AddRecipe function
jest.mock('../Queries/recipeQuery', () => ({
  AddRecipe: jest.fn(),
  getAllRecipes: jest.fn(),
  deleteRecipeById: jest.fn(),
  getRecipeById: jest.fn(),
  updateRecipeById: jest.fn(),
  getRecipesByUserId: jest.fn(),
  AddRecipeReview: jest.fn(),
  getReviewsWithReviewer: jest.fn()
}));

describe('AddRecipeController', () => {
  test('adds a new recipe successfully', async () => {
    const req = { body: { name: 'Recipe Name', ingredients: ['Ingredient 1', 'Ingredient 2'], instructions: 'Instructions', userID: 'user123' } };
    const res = { json: jest.fn() };

    AddRecipe.mockResolvedValue(123); 

    await AddRecipeController(req, res);

    expect(AddRecipe).toHaveBeenCalledWith('Recipe Name', ['Ingredient 1', 'Ingredient 2'], 'Instructions', 'user123');
    expect(res.json).toHaveBeenCalledWith({ recipeId: 123, message: 'Recipe added successfully' });
  });
  test('handles error when adding a recipe fails', async () => {
    const req = { body: { name: 'Recipe Name', ingredients: ['Ingredient 1', 'Ingredient 2'], instructions: 'Instructions', userID: 'user123' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    const errorMessage = 'Failed to add recipe';
    AddRecipe.mockRejectedValue(new Error(errorMessage)); 

    const consoleErrorSpy = jest.spyOn(console, 'error'); 

    await AddRecipeController(req, res);

    expect(AddRecipe).toHaveBeenCalledWith('Recipe Name', ['Ingredient 1', 'Ingredient 2'], 'Instructions', 'user123');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding recipe:', expect.any(Error)); 
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });


});

describe('getAllRecipesController', () => {
  test('fetches all recipes successfully', async () => {
    const res = { json: jest.fn() };
    const recipes = [{ id: 1, name: 'Recipe 1' }, { id: 2, name: 'Recipe 2' }];

    getAllRecipes.mockResolvedValue(recipes); 

    await getAllRecipesController(null, res);

    expect(res.json).toHaveBeenCalledWith(recipes);
  });
  test('handles error when fetching recipes fails', async () => {
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    const errorMessage = 'Failed to fetch recipes';
    getAllRecipes.mockRejectedValue(new Error(errorMessage)); 

    await getAllRecipesController(null, res);

    expect(console.error).toHaveBeenCalledWith('Error fetching recipes:', expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
  });
});
describe('deleteRecipeController', () => {
  test('deletes a recipe successfully', async () => {
    const req = { params: { recipe_id: 123 } };
    const res = { json: jest.fn(), status: jest.fn() };

    deleteRecipeById.mockResolvedValue({ affectedRows: 1 }); 

    await deleteRecipeController(req, res);

    expect(deleteRecipeById).toHaveBeenCalledWith(123);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe deleted successfully' });
  });

  test('returns 404 if recipe not found', async () => {
    const req = { params: { recipe_id: 123 } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() }; 
  
    deleteRecipeById.mockResolvedValue({ affectedRows: 0 }); 
  
    await deleteRecipeController(req, res);
  
    expect(deleteRecipeById).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe not found' });
  });
});

describe('getRecipeByIdController', () => {
  test('fetches a recipe by ID successfully', async () => {
    const req = { params: { recipe_id: 123 } };
    const res = { json: jest.fn(), status: jest.fn() };

    const recipe = { id: 123, name: 'Test Recipe' };
    getRecipeById.mockResolvedValue(recipe); 

    await getRecipeByIdController(req, res);

    expect(getRecipeById).toHaveBeenCalledWith(123);
    expect(res.json).toHaveBeenCalledWith(recipe);
  });

  test('returns 404 if recipe not found', async () => {
    const req = { params: { recipe_id: 123 } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    getRecipeById.mockResolvedValue(null); 

    await getRecipeByIdController(req, res);

    expect(getRecipeById).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe with ID 123 not found' });
  });
});
describe('updateRecipeController', () => {
  test('updates a recipe successfully', async () => {
    const req = { params: { recipe_id: 123 }, body: { name: 'Updated Recipe Name', ingredients: ['Ingredient 1', 'Ingredient 2'], instructions: 'Updated Instructions' } };
    const res = { json: jest.fn(), status: jest.fn() };

    const existingRecipe = { id: 123, name: 'Old Recipe Name', ingredients: ['Old Ingredient 1', 'Old Ingredient 2'], instructions: 'Old Instructions' };
    getRecipeById.mockResolvedValue(existingRecipe); // Mock the resolved value of getRecipeById function
    updateRecipeById.mockResolvedValue(); // Mock the resolved value of updateRecipeById function

    await updateRecipeController(req, res);

    expect(getRecipeById).toHaveBeenCalledWith(123);
    expect(updateRecipeById).toHaveBeenCalledWith(123, { name: 'Updated Recipe Name', ingredients: ['Ingredient 1', 'Ingredient 2'], instructions: 'Updated Instructions' });
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe with ID 123 updated successfully' });
  });

  test('returns 404 if recipe not found', async () => {
    const req = { params: { recipe_id: 123 }, body: { name: 'Updated Recipe Name', ingredients: ['Ingredient 1', 'Ingredient 2'], instructions: 'Updated Instructions' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
  
    getRecipeById.mockResolvedValue(null);
  
    await updateRecipeController(req, res);
  
    expect(getRecipeById).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Recipe with ID 123 not found' });
  });
});

describe('getRecipesByUserIdController', () => {
  test('fetches recipes by user ID successfully', async () => {
    const req = { params: { user_id: 'user123' } };
    const res = { json: jest.fn(), status: jest.fn() };

    const recipes = [{ id: 1, name: 'Recipe 1' }, { id: 2, name: 'Recipe 2' }];
    getRecipesByUserId.mockResolvedValue(recipes); 

    await getRecipesByUserIdController(req, res);

    expect(getRecipesByUserId).toHaveBeenCalledWith('user123');
    expect(res.json).toHaveBeenCalledWith(recipes);
  });

  test('returns message if no recipes found', async () => {
    const req = { params: { user_id: 'user123' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    
    getRecipesByUserId.mockResolvedValue([]); 
    
    await getRecipesByUserIdController(req, res);
    
    expect(getRecipesByUserId).toHaveBeenCalledWith('user123');
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
describe('AddRecipeReviewController', () => {
  test('adds a review successfully', async () => {
    const req = { params: { recipe_id: 123 }, body: { review_text: 'Great recipe!', userID: 'user123' } };
    const res = { json: jest.fn(), status: jest.fn() };

    AddRecipeReview.mockResolvedValue(456); 

    await AddRecipeReviewController(req, res);

    expect(AddRecipeReview).toHaveBeenCalledWith(123, 'Great recipe!', 'user123');
    expect(res.json).toHaveBeenCalledWith({ reviewId: 456, message: 'Review added successfully' });
  });

  test('handles error when adding a review fails', async () => {
    const req = { params: { recipe_id: 123 }, body: { review_text: 'Great recipe!', userID: 'user123' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() }; 

    const errorMessage = 'Failed to add review';
    AddRecipeReview.mockRejectedValue(new Error(errorMessage));

    const consoleErrorSpy = jest.spyOn(console, 'error'); 

    await AddRecipeReviewController(req, res);

    expect(AddRecipeReview).toHaveBeenCalledWith(123, 'Great recipe!', 'user123');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding review:', expect.any(Error)); 
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
describe('getReviewsWithReviewerController', () => {
  test('fetches reviews with reviewer successfully', async () => {
    const req = { params: { recipe_id: 123 } };
    const res = { json: jest.fn() };

    const reviews = [{ id: 1, reviewer: 'User1', review_text: 'Great recipe!' }, { id: 2, reviewer: 'User2', review_text: 'Awesome recipe!' }];
    getReviewsWithReviewer.mockResolvedValue(reviews); // Mock the resolved value of getReviewsWithReviewer function

    await getReviewsWithReviewerController(req, res);

    expect(getReviewsWithReviewer).toHaveBeenCalledWith(123);
    expect(res.json).toHaveBeenCalledWith({ reviews });
  });

  test('handles error when retrieving reviews fails', async () => {
    const req = { params: { recipe_id: 123 } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    const errorMessage = 'Failed to retrieve reviews';
    getReviewsWithReviewer.mockRejectedValue(new Error(errorMessage));

    await getReviewsWithReviewerController(req, res);

    expect(getReviewsWithReviewer).toHaveBeenCalledWith(123);
    expect(console.error).toHaveBeenCalledWith('Error retrieving reviews:', expect.any(Error));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
