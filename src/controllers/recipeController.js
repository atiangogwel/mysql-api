const { getAllRecipes, getRecipeById, updateRecipeById, deleteRecipeById } = require('../Queries/recipeQuery');

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
      res.status(404).json({ message: `Recipe with ID ${recipeId} not found` });
    } else {
      res.json({ message: `Recipe with ID ${recipeId} deleted successfully` });
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
  const recipeId = req.params.recipe_id;
  const updatedRecipeData = req.body;
  
  try {
    const results = await updateRecipeById(recipeId, updatedRecipeData);
    if (results.affectedRows === 0) {
      res.status(404).json({ message: `Recipe with ID ${recipeId} not found` });
    } else {
      res.json({ message: `Recipe with ID ${recipeId} updated successfully` });
    }
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllRecipesController,
  deleteRecipeController,
  getRecipeByIdController,
  updateRecipeController
};
