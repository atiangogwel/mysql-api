const {getReviewsWithReviewer,AddRecipeReview,AddRecipe, getAllRecipes, getRecipeById, updateRecipeById, deleteRecipeById, getRecipesByUserId } = require('../Queries/recipeQuery');

const AddRecipeController = async (req, res) => {
  const { name, ingredients, instructions, userID } = req.body;

  try {
    // Call the AddRecipe function to insert the new recipe
    const recipeId = await AddRecipe(name, ingredients, instructions, userID);
    res.json({ recipeId: recipeId, message: 'Recipe added successfully' });
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Controller function to handle fetching all recipes
const getAllRecipesController = async (req, res) => {
  try {
    const results = await getAllRecipes(); 
    res.json(results);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: error.message });
  }
};

// Controller function to delete a recipe by ID
const deleteRecipeController = async (req, res) => {
  const recipeId = req.params.recipe_id;
  try {
    const results = await deleteRecipeById(recipeId);
    if (results.affectedRows === 0) {
      res.status(404).json({ message: `Recipe not found` });
    } else {
      res.json({ message: `Recipe deleted successfully` });
    }
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Controller function to fetch a recipe by ID
const getRecipeByIdController = async (req, res) => {
  const recipeId = req.params.recipe_id;
  try {
    const result = await getRecipeById(recipeId);
    if (!result) {
      res.status(404).json({ message: `Recipe with ID ${recipeId} not found` });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to update a recipe by ID
const updateRecipeController = async (req, res) => {
  const recipeId = req.params.recipe_id; // Get the recipe ID from request parameters
  const updatedRecipeData = req.body; // Get the updated recipe data from request body
  
  try {
    // Check if the recipe with the given ID exists
    const existingRecipe = await getRecipeById(recipeId);
    if (!existingRecipe) {
      //else return a 404 error
      res.status(404).json({ message: `Recipe with ID ${recipeId} not found` });
      return;
    }
    // Update the recipe 
    await updateRecipeById(recipeId, updatedRecipeData);

    // Send a success response
    res.json({ message: `Recipe updated successfully` });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Controller function to fetch recipes by user ID
const getRecipesByUserIdController = async (req, res) => {
  const userId = req.params.user_id;
  try {
    const results = await getRecipesByUserId(userId);
    if (results.length === 0) {
      res.status(200).json({ message: `No recipes found}` });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error("Error fetching recipes by user ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const AddRecipeReviewController = async (req, res) => {
  const { recipe_id } = req.params;
  const { review_text,userID } = req.body;

  try {
    const reviewId = await AddRecipeReview(recipe_id, review_text, userID); // Passing userID to the function
    res.json({ reviewId: reviewId, message: 'Review added successfully' });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getReviewsWithReviewerController = async (req, res) => {
  const { recipe_id } = req.params;

  try {
    const reviews = await getReviewsWithReviewer(recipe_id);
    res.json({ reviews });
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  getAllRecipesController,
  deleteRecipeController,
  getRecipeByIdController,
  updateRecipeController,
  getRecipesByUserIdController,
  AddRecipeController,
  AddRecipeReviewController,
  getReviewsWithReviewerController
};
