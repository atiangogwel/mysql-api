const pool = require('../dbConfig');
const bcrypt = require('bcrypt');

const createUser = (userData, callback) => {
  const { last_name, first_name, email, password } = userData;
  
  // Generate a salt and hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Store the hashed password in the database
    const query = 'INSERT INTO users (last_name, first_name, email, password) VALUES (?, ?, ?, ?)';
    pool.query(query, [last_name, first_name, email, hash], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, results);
    });
  });
};


const getAllUsers = (callback) => {
  const query = 'SELECT * FROM users';
  pool.query(query, (error, results) => {
    if (error) {
      callback(error, null);
      return;
    }
    callback(null, results);
  });
};
// Function to update a user by ID
const updateUser = (userID, updatedUserData, callback) => {
  const { last_name, first_name, email, password } = updatedUserData;

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Update the user in the database with the hashed password
    const query = 'UPDATE users SET last_name = ?, first_name = ?, email = ?, password = ? WHERE userID = ?';
    pool.query(query, [last_name, first_name, email, hash, userID], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      // If the user was successfully updated, generate a new JWT token
      const token = jwt.sign({ userID: userID }, JWT_SECRET, { expiresIn: '1h' });

      callback(null, { results, token }); // Return the updated user data and the new token
    });
  });
};
module.exports = {
  createUser,getAllUsers,updateUser
};
