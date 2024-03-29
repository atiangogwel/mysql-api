const express = require('express');
const router = express.Router();
const { getAllRecipesController, getRecipeByIdController, deleteRecipeController } = require('../controllers/recipeController');

// GET all recipes
router.get('/recipes', getAllRecipesController);

// GET a recipe by ID
router.get('/recipes/:recipe_id', getRecipeByIdController);

// DELETE a recipe by ID
router.delete('/recipes/:recipe_id', deleteRecipeController);

module.exports = router;
