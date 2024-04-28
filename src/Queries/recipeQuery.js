const pool = require('../dbConfig');

// Create the recipe table if it does not exist
const createRecipeTableQuery = `
  CREATE TABLE IF NOT EXISTS recipe (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredients TEXT,
    instructions TEXT,
    userID INT,
    FOREIGN KEY (userID) REFERENCES users(userID)
  )
`;

// Wrap pool.query in a function that returns a promise
const executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Use async/await to execute the query
const execute = async () => {
  try {
    const results = await executeQuery(createRecipeTableQuery);
    console.log('Recipe table created or already exists');
  } catch (error) {
    console.error('Error creating recipe table:', error);
  }
};

execute();

// Define the SQL query to insert a new recipe
const AddRecipe = (name, ingredients, instructions, userID) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO recipe (name, ingredients, instructions, userID) VALUES (?, ?, ?, ?)';
    pool.query(query, [name, ingredients, instructions, userID], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results.insertId); 
    });
  });
};


const getAllRecipes = (callback) => {
  const query = `
    SELECT recipe.*, CONCAT(users.last_name, ' ', users.first_name) AS creator_name
    FROM recipe
    INNER JOIN users ON recipe.userID = users.userID
  `;
  
  // Check if a callback function is provided
  if (callback && typeof callback === 'function') {
    pool.query(query, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results);
    });
  } else {
    // If no callback is provided, return a promise
    return new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  }
};




// Function to delete a recipe by its ID
const deleteRecipeById = (recipeId) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM recipe WHERE recipe_id = ?';
    pool.query(query, [recipeId], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

//add recipe review
const AddRecipeReview = (recipeId, review, userID) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO reviews (recipe_id, review_text, userID) VALUES (?, ?, ?)';
    pool.query(query, [recipeId, review, userID], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results.insertId);
    });
  });
};

//get reviews
const getReviewsWithReviewer = (recipeId) => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT r.review_id, r.review_text, CONCAT(u.first_name, ' ', u.last_name) AS Reviewer
    FROM reviews AS r
    INNER JOIN users AS u ON r.userID = u.userID
    WHERE r.recipe_id = ?
    `;
    pool.query(query, [recipeId], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};


const getRecipeById = (recipeId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM recipe WHERE recipe_id = ?';
    pool.query(query, [recipeId], (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      if (results.length === 0) {
        resolve(null);
        return;
      }
      resolve(results[0]);
    });
  });
};

  
const updateRecipeById = (recipeId, updatedRecipeData) => {
  return new Promise((resolve, reject) => {
    // Retrieve existing recipe details
    getRecipeById(recipeId)
      .then(existingRecipe => {
        if (!existingRecipe) {
          reject(new Error(`Recipe with ID ${recipeId} not found`));
          return;
        }

        // Merge updated fields with existing recipe data
        const mergedRecipeData = {
          ...existingRecipe,
          ...updatedRecipeData
        };

        // Remove recipeId from merged data to prevent it from being updated
        delete mergedRecipeData.recipe_id;

        const { name, ingredients, instructions } = mergedRecipeData;
        const query = 'UPDATE recipe SET name = ?, ingredients = ?, instructions = ? WHERE recipe_id = ?';
        
        pool.query(query, [name, ingredients, instructions, recipeId], (error, results) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(results);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
};


  const getRecipesByUserId = (userId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM recipe WHERE userID = ?';
      pool.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
  
  
module.exports = {
  getAllRecipes,
  deleteRecipeById,
  getRecipeById,
  updateRecipeById,
  getRecipesByUserId,
  AddRecipe,
  AddRecipeReview,
  getReviewsWithReviewer
};
