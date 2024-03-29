const pool = require('../dbConfig');

const getAllRecipes = (callback) => {
  const query = 'SELECT * FROM recipe';
  pool.query(query, (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results);
  });
};

// Function to delete a recipe by its ID
const deleteRecipeById = (recipeId, callback) => {
    const query = 'DELETE FROM recipe WHERE recipe_id = ?';
    pool.query(query, [recipeId], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results);
    });
  };


  const getRecipeById = (recipeId, callback) => {
    const query = 'SELECT * FROM recipe WHERE recipe_id = ?';
    pool.query(query, [recipeId], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null);
        return;
      }
      callback(null, results[0]);
    });
  };
  
module.exports = {
  getAllRecipes,
  deleteRecipeById,
  getRecipeById
};
