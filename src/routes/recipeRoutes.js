const express = require('express');
const router = express.Router();
const {AddRecipeController, getRecipesByUserIdController, getAllRecipesController, getRecipeByIdController,updateRecipeController, deleteRecipeController } = require('../controllers/recipeController');

// GET all recipes
router.get('/recipes', getAllRecipesController);

// GET a recipe by ID
router.get('/recipes/:recipe_id', getRecipeByIdController);

// UPDATE a recipe by ID
router.post('/recipes/update/:recipe_id', updateRecipeController);
//add a recipe
router.post('/recipes/add_new', AddRecipeController);



// DELETE a recipe by ID
router.delete('/recipes/:recipe_id', deleteRecipeController);

//get recipe asscociated with a given user
router.get('/recipes/user/:user_id', getRecipesByUserIdController);

module.exports = router;
